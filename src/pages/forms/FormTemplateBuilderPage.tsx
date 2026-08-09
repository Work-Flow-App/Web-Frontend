import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShortTextIcon from '@mui/icons-material/ShortText';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { Loader } from '../../components/UI';
import { Badge } from '../../components/UI/Badge';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useFormSubmit } from '../../hooks';
import { useGlobalModalOuterContext, ModalSizes } from '../../components/UI/GlobalModal';
import {
  formService,
  FORM_FIELD_ROLE_TARGET_OPTIONS,
  FormFieldDtoRoleTargetEnum,
} from '../../services/api';
import type { FormTemplateRequest } from '../../services/api';
import { FieldForm, type BuilderField } from './components/FieldForm';
import { typeLabel, TYPE_ICON, TYPE_COLOR, ROLE_COLOR } from './utils/formFieldRender';
import { floowColors } from '../../theme/colors';
import * as S from './FormTemplateBuilderPage.styles';

const roleLabel = (value?: string) => FORM_FIELD_ROLE_TARGET_OPTIONS.find((o) => o.value === value)?.label || value || 'Either';

// ─── Sortable field row ─────────────────────────────────────────────────────────

interface SortableFieldItemProps {
  field: BuilderField;
  index: number;
  onEdit: (field: BuilderField) => void;
  onDelete: (clientId: number) => void;
}

const SortableFieldItem: React.FC<SortableFieldItemProps> = ({ field, index, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `order-${field.clientId}`,
    data: { type: 'order', field },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // dnd-kit requires inline style for the CSS transform — cannot be a styled-component
  const dndStyle = { transform: CSS.Transform.toString(transform), transition };

  const fieldColor = S.STEP_COLORS[index % S.STEP_COLORS.length];
  const TypeIcon = TYPE_ICON[field.type || ''] || ShortTextIcon;
  const typeColor = TYPE_COLOR[field.type || ''] || floowColors.slate.main;
  const roleColor = ROLE_COLOR[field.roleTarget || FormFieldDtoRoleTargetEnum.Both] || floowColors.slate.main;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(field);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(field.clientId);
  };

  return (
    <S.FieldRow ref={setNodeRef} style={dndStyle} className={isDragging ? 'dragging' : ''}>
      {/* Col 1 — drag grip */}
      <S.FieldDragGrip className="field-drag-grip" {...attributes} {...listeners}>
        <DragIndicatorIcon fontSize="small" />
      </S.FieldDragGrip>

      {/* Col 2 — numbered circle on the rail */}
      <S.FieldNumberColumn>
        <S.FieldNumberBadge accentcolor={fieldColor}>{index + 1}</S.FieldNumberBadge>
      </S.FieldNumberColumn>

      {/* Col 3 — field card with colored left border */}
      <S.FieldCardBody className="field-card-body" accentcolor={fieldColor}>
        <S.FieldTitleRow>
          <S.FieldLabel>{field.label}</S.FieldLabel>
        </S.FieldTitleRow>
        <S.FieldMetaRow>
          <S.ColorTag tint={typeColor}>
            <TypeIcon />
            {typeLabel(field.type)}
          </S.ColorTag>
          <S.ColorTag tint={roleColor}>{roleLabel(field.roleTarget)}</S.ColorTag>
          {field.required && (
            <Badge variant="warning" size="small">
              Required
            </Badge>
          )}
        </S.FieldMetaRow>
      </S.FieldCardBody>

      {/* Col 4 — context menu trigger */}
      <S.FieldKebabButton className="field-kebab" size="small" onClick={handleMenuOpen} aria-label="Field options">
        <MoreVertIcon fontSize="small" />
      </S.FieldKebabButton>

      <S.FieldContextMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <S.FieldEditMenuItem onClick={handleEdit}>
          <EditIcon />
          Edit
        </S.FieldEditMenuItem>
        <S.FieldDeleteMenuItem onClick={handleDelete}>
          <DeleteIcon />
          Delete
        </S.FieldDeleteMenuItem>
      </S.FieldContextMenu>
    </S.FieldRow>
  );
};

// ─── Page ───────────────────────────────────────────────────────────────────────

interface TemplateDraftState {
  name?: string;
  description?: string;
}

export const FormTemplateBuilderPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  // "new" is a sentinel id: the template hasn't been created yet, so fields are built up
  // client-side (like editing) and only sent to the server once, on the first save - see
  // handleSaveTemplate. This is what avoids wasting an empty v1 that a normal edit would
  // immediately archive and replace the moment a field gets added.
  const isNew = templateId === 'new';

  const [template, setTemplate] = useState<FormTemplateRequest | null>(null);
  const [fields, setFields] = useState<BuilderField[]>([]);
  const [loading, setLoading] = useState(true);
  const { saving, withSaving } = useFormSubmit();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadTemplate = useCallback(async () => {
    if (!templateId) return;
    try {
      setLoading(true);
      // No get-by-id endpoint for templates - the list is the source of truth.
      const response = await formService.getAllTemplates();
      const found = (Array.isArray(response.data) ? response.data : []).find((t) => String(t.id) === templateId);
      if (!found) {
        showError('Template not found');
        return;
      }
      setTemplate(found);
      setFields((found.fields || []).map((f, i) => ({ ...f, clientId: f.id ?? Date.now() + i })));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load template'));
    } finally {
      setLoading(false);
    }
  }, [templateId, showError]);

  useEffect(() => {
    if (isNew) {
      const draft = (location.state as TemplateDraftState | null) || null;
      if (!draft?.name) {
        showError('Start a new template from the Forms page.');
        navigate('/company/forms', { replace: true });
        return;
      }
      setTemplate({ name: draft.name, description: draft.description || '', fields: [] });
      setFields([]);
      setLoading(false);
      return;
    }
    loadTemplate();
    // location.state is only read once, on entry into "new" mode - re-running this on every
    // location change would wipe out in-progress field edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, loadTemplate]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeIdStr = active.id as string;
    const overId = over.id as string;

    if (activeIdStr.startsWith('order-') && overId.startsWith('order-')) {
      const oldIndex = fields.findIndex((f) => `order-${f.clientId}` === activeIdStr);
      const newIndex = fields.findIndex((f) => `order-${f.clientId}` === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setFields(arrayMove(fields, oldIndex, newIndex));
      }
    }
  };

  const handleCloseModal = () => resetGlobalModalOuterProps();

  const handleSaveField = (field: BuilderField) => {
    const existing = fields.find((f) => f.clientId === field.clientId);
    if (existing) {
      setFields(fields.map((f) => (f.clientId === field.clientId ? field : f)));
      showSuccess('Field updated');
    } else {
      setFields([...fields, field]);
      showSuccess('Field added');
    }
    handleCloseModal();
  };

  const handleAddField = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <FieldForm initialField={null} onSave={handleSaveField} isEditing={false} />,
      fieldName: 'addFormField',
      size: ModalSizes.MEDIUM,
    });
  };

  const handleEditField = (field: BuilderField) => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <FieldForm initialField={field} onSave={handleSaveField} isEditing />,
      fieldName: 'editFormField',
      size: ModalSizes.MEDIUM,
    });
  };

  const handleDeleteField = (clientId: number) => {
    setFields(fields.filter((f) => f.clientId !== clientId));
    showSuccess('Field removed');
  };

  /**
   * companyFormCreateTemplate's response reuses the request DTO and doesn't reliably echo back
   * the real generated id (the id a versioning update produces is the same kind of response) -
   * re-fetch and resolve the current, non-archived template by name instead of trusting a
   * response id directly. Matches the workaround the create flow always relied on.
   */
  const resolveCurrentTemplateId = async (name: string): Promise<number | null> => {
    const response = await formService.getAllTemplates();
    const list = Array.isArray(response.data) ? response.data : [];
    const match = list
      .filter((t) => t.name === name && !t.archived)
      .reduce<FormTemplateRequest | null>((latest, t) => ((t.id ?? -Infinity) > (latest?.id ?? -Infinity) ? t : latest), null);
    return match?.id ?? null;
  };

  const handleSaveTemplate = async () => {
    if (!template || !templateId) return;
    const fieldPayload = fields.map((f, index) => ({
      id: f.id,
      name: f.name,
      label: f.label,
      type: f.type,
      roleTarget: f.roleTarget,
      required: f.required,
      options: f.options,
      orderIndex: index,
    }));

    try {
      await withSaving(async () => {
        if (isNew) {
          await formService.createTemplate({ name: template.name, description: template.description, fields: fieldPayload });
        } else {
          const payload: FormTemplateRequest = {
            name: template.name,
            description: template.description,
            version: template.version,
            archived: template.archived,
            fields: fieldPayload,
          };
          await formService.updateTemplate(Number(templateId), payload);
        }
        showSuccess(isNew ? 'Template created successfully' : 'Template saved successfully');

        // Editing always versions the template server-side (old id archived, new id/version
        // created) - land the builder on the current version so the next save PUTs to a real,
        // non-archived template instead of the one that just got archived.
        const resolvedId = await resolveCurrentTemplateId(template.name || '');
        if (resolvedId != null) {
          navigate(`/company/forms/templates/${resolvedId}/builder`, { replace: true });
        } else {
          showError(`Template ${isNew ? 'created' : 'saved'}, but could not reopen it automatically. Find it from the Forms page.`);
          navigate('/company/forms', { replace: true });
        }
      });
    } catch (error) {
      showError(extractErrorMessage(error, `Failed to ${isNew ? 'create' : 'save'} template`));
    }
  };

  const getActiveField = (): BuilderField | null => {
    if (!activeId) return null;
    const clientId = Number(activeId.replace('order-', ''));
    return fields.find((f) => f.clientId === clientId) || null;
  };

  if (loading) return <Loader />;
  if (!template) return isNew ? null : <Typography>Template not found</Typography>;

  const activeField = getActiveField();
  const activeFieldIndex = activeField ? fields.findIndex((f) => f.clientId === activeField.clientId) : -1;

  return (
    <PageWrapper
      title={template.name}
      description={
        isNew
          ? 'Add the fields workers and company staff will fill in, then create the template.'
          : template.description || `Version ${template.version ?? 1} - saving creates a new version and archives this one.`
      }
      actions={[
        {
          label: 'Back to Forms',
          onClick: () => navigate('/company/forms'),
          variant: 'outlined',
          icon: <ArrowBackIcon />,
        },
        {
          label: saving ? (isNew ? 'Creating...' : 'Saving...') : isNew ? 'Create Template' : 'Save Template',
          onClick: handleSaveTemplate,
          variant: 'contained',
          color: 'primary',
          disabled: saving,
        },
      ]}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <S.FieldsCard>
          {/* Header — title, field count pill, drag hint */}
          <S.FieldsCardHeader>
            <S.FieldsCardTitleRow>
              <S.FieldsCardTitle>Fields</S.FieldsCardTitle>
              <S.FieldsCountBadge>
                {fields.length} {fields.length === 1 ? 'field' : 'fields'}
              </S.FieldsCountBadge>
            </S.FieldsCardTitleRow>
            <S.FieldsCardSubtitle>
              <InfoOutlinedIcon />
              Drag the handle to reorder — fields appear on the form top to bottom
            </S.FieldsCardSubtitle>
          </S.FieldsCardHeader>

          {/* Rail + ordered field list */}
          <S.FieldsRailWrapper>
            <S.FieldsRail />

            <SortableContext items={fields.map((f) => `order-${f.clientId}`)} strategy={verticalListSortingStrategy}>
              <S.FieldsList>
                {fields.map((field, index) => (
                  <SortableFieldItem key={field.clientId} field={field} index={index} onEdit={handleEditField} onDelete={handleDeleteField} />
                ))}
              </S.FieldsList>
            </SortableContext>

            {fields.length === 0 && <S.EmptyFieldsHint>No fields yet — click below to add your first field</S.EmptyFieldsHint>}

            {/* Single add control — dashed node at the end of the rail */}
            <S.AddNodeWrapper onClick={handleAddField}>
              <span />
              <S.AddNodeCircle className="add-node-circle">
                <AddIcon fontSize="small" />
              </S.AddNodeCircle>
              <S.AddNodeLabel className="add-node-label">Add field</S.AddNodeLabel>
            </S.AddNodeWrapper>
          </S.FieldsRailWrapper>
        </S.FieldsCard>

        {/* Drag overlay — floating ghost of the dragged row */}
        <DragOverlay>
          {activeField && (
            <S.DragOverlayRow>
              <S.FieldDragGrip>
                <DragIndicatorIcon fontSize="small" />
              </S.FieldDragGrip>
              <S.FieldNumberColumn>
                <S.FieldNumberBadge accentcolor={S.STEP_COLORS[activeFieldIndex % S.STEP_COLORS.length]}>
                  {activeFieldIndex + 1}
                </S.FieldNumberBadge>
              </S.FieldNumberColumn>
              <S.FieldCardBody accentcolor={S.STEP_COLORS[activeFieldIndex % S.STEP_COLORS.length]}>
                <S.FieldTitleRow>
                  <S.FieldLabel>{activeField.label}</S.FieldLabel>
                </S.FieldTitleRow>
                <S.FieldMetaRow>
                  {(() => {
                    const ActiveTypeIcon = TYPE_ICON[activeField.type || ''] || ShortTextIcon;
                    return (
                      <S.ColorTag tint={TYPE_COLOR[activeField.type || ''] || floowColors.slate.main}>
                        <ActiveTypeIcon />
                        {typeLabel(activeField.type)}
                      </S.ColorTag>
                    );
                  })()}
                  <S.ColorTag tint={ROLE_COLOR[activeField.roleTarget || FormFieldDtoRoleTargetEnum.Both] || floowColors.slate.main}>
                    {roleLabel(activeField.roleTarget)}
                  </S.ColorTag>
                  {activeField.required && (
                    <Badge variant="warning" size="small">
                      Required
                    </Badge>
                  )}
                </S.FieldMetaRow>
              </S.FieldCardBody>
            </S.DragOverlayRow>
          )}
        </DragOverlay>
      </DndContext>
    </PageWrapper>
  );
};

export default FormTemplateBuilderPage;
