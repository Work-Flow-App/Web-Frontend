import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PageWrapper } from '../../components/PageWrapper';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useFormSubmit } from '../../hooks';
import { workflowService } from '../../services/api';
import type { WorkflowStepResponse, WorkflowBulkUpdateRequest } from '../../services/api';
import { Loader } from '../../components';
import { useGlobalModalOuterContext, ModalSizes } from '../../components/GlobalModal';
import { StepForm, type StepFormStep } from './components/StepForm';
import * as S from './WorkflowBuilderPage.styles';

interface WorkflowStep extends WorkflowStepResponse {
  id: number;
  workflowId: number;
  name: string;
  description?: string;
  orderIndex: number;
  optional?: boolean;
  expectedDurationMinutes?: number;
  maximumDurationMinutes?: number;
}

// ─── Sortable step row ────────────────────────────────────────────────────────

interface SortableStepItemProps {
  step: WorkflowStep;
  index: number;
  onEdit: (step: WorkflowStep) => void;
  onDelete: (stepId: number) => void;
}

const SortableStepItem: React.FC<SortableStepItemProps> = ({ step, index, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `order-${step.id}`,
    data: { type: 'order', step },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // dnd-kit requires inline style for the CSS transform — cannot be a styled-component
  const dndStyle = { transform: CSS.Transform.toString(transform), transition };

  const stepColor = S.STEP_COLORS[index % S.STEP_COLORS.length];

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(step);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(step.id);
  };

  return (
    <S.StepRow ref={setNodeRef} style={dndStyle} className={isDragging ? 'dragging' : ''}>
      {/* Col 1 — drag grip */}
      <S.StepDragGrip className="step-drag-grip" {...attributes} {...listeners}>
        <DragIndicatorIcon fontSize="small" />
      </S.StepDragGrip>

      {/* Col 2 — numbered circle on the rail */}
      <S.StepNumberColumn>
        <S.StepNumberBadge stepcolor={stepColor}>{index + 1}</S.StepNumberBadge>
      </S.StepNumberColumn>

      {/* Col 3 — step card with colored left border */}
      <S.StepCardBody className="step-card-body" stepcolor={stepColor}>
        <S.StepTitleRow>
          <S.StepTitle>{step.name}</S.StepTitle>
        </S.StepTitleRow>
        {step.description && <S.StepDescription>{step.description}</S.StepDescription>}
      </S.StepCardBody>

      {/* Col 4 — context menu trigger */}
      <S.StepKebabButton
        className="step-kebab"
        size="small"
        onClick={handleMenuOpen}
        aria-label="Step options"
      >
        <MoreVertIcon fontSize="small" />
      </S.StepKebabButton>

      <S.StepContextMenu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <S.StepEditMenuItem onClick={handleEdit}>
          <EditIcon />
          Edit
        </S.StepEditMenuItem>
        <S.StepDeleteMenuItem onClick={handleDelete}>
          <DeleteIcon />
          Delete
        </S.StepDeleteMenuItem>
      </S.StepContextMenu>
    </S.StepRow>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const WorkflowBuilderPage: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const [workflow, setWorkflow] = useState<{ id: number; name: string; description?: string } | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const { saving, withSaving } = useFormSubmit();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) return;
      try {
        setLoading(true);
        const response = await workflowService.getWorkflowWithSteps(Number(workflowId));
        const data = response.data;

        setWorkflow({ id: data.id || 0, name: data.name || '', description: data.description });

        const stepsData = (data.steps || []).map((step, index) => ({
          ...step,
          id: step.id || 0,
          workflowId: Number(workflowId),
          name: step.name || '',
          orderIndex: step.orderIndex ?? index,
        }));

        stepsData.sort((a, b) => a.orderIndex - b.orderIndex);
        setSteps(stepsData);
      } catch (error) {
        console.error('Error fetching workflow:', error);
        showError('Failed to load workflow');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId, showError]);

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
      const oldIndex = steps.findIndex((s) => `order-${s.id}` === activeIdStr);
      const newIndex = steps.findIndex((s) => `order-${s.id}` === overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setSteps(arrayMove(steps, oldIndex, newIndex).map((s, i) => ({ ...s, orderIndex: i })));
      }
    }
  };

  const handleCloseModal = () => {
    resetGlobalModalOuterProps();
  };

  const handleSaveStep = (stepData: StepFormStep) => {
    // ID-based lookup avoids stale-closure issues — StepForm passes initialStep.id
    // when editing, or Date.now() for new steps.
    const existing = steps.find((s) => s.id === stepData.id);

    if (existing) {
      const updatedStep: WorkflowStep = {
        ...existing,
        name: stepData.name,
        description: stepData.description,
        optional: stepData.optional,
        expectedDurationMinutes: stepData.expectedDurationMinutes,
        maximumDurationMinutes: stepData.maximumDurationMinutes,
      };
      setSteps(steps.map((s) => (s.id === stepData.id ? updatedStep : s)));
      showSuccess('Step updated');
    } else {
      const newStep: WorkflowStep = {
        id: stepData.id,
        workflowId: Number(workflowId),
        name: stepData.name,
        description: stepData.description,
        orderIndex: steps.length,
        optional: stepData.optional,
        expectedDurationMinutes: stepData.expectedDurationMinutes,
        maximumDurationMinutes: stepData.maximumDurationMinutes,
      };
      setSteps([...steps, newStep]);
      showSuccess('Step added');
    }
    handleCloseModal();
  };

  const handleAddStep = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <StepForm initialStep={null} onSave={handleSaveStep} isEditing={false} />,
      fieldName: 'addStep',
      size: ModalSizes.SMALL,
    });
  };

  const handleEditStep = (step: WorkflowStep) => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <StepForm initialStep={step} onSave={handleSaveStep} isEditing={true} />,
      fieldName: 'editStep',
      size: ModalSizes.SMALL,
    });
  };

  const handleDeleteStep = (stepId: number) => {
    setSteps(steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, orderIndex: i })));
    showSuccess('Step removed');
  };

  const handleSaveWorkflow = async () => {
    if (!workflowId || !workflow) return;

    try {
      await withSaving(async () => {
        const payload: WorkflowBulkUpdateRequest = {
          name: workflow.name,
          description: workflow.description,
          steps: steps.map((step) => ({
            id: step.id > 1000000000000 ? undefined : step.id,
            name: step.name,
            description: step.description,
            orderIndex: step.orderIndex,
            optional: step.optional,
            expectedDurationMinutes: step.expectedDurationMinutes,
            maximumDurationMinutes: step.maximumDurationMinutes,
          })),
        };

        await workflowService.bulkUpdateWorkflow(Number(workflowId), payload);
        showSuccess('Workflow saved successfully');

        const response = await workflowService.getWorkflowWithSteps(Number(workflowId));
        const data = response.data;
        const stepsData = (data.steps || []).map((step, index) => ({
          ...step,
          id: step.id || 0,
          workflowId: Number(workflowId),
          name: step.name || '',
          orderIndex: step.orderIndex ?? index,
        }));
        stepsData.sort((a, b) => a.orderIndex - b.orderIndex);
        setSteps(stepsData);
      });
    } catch (error) {
      console.error('Error saving workflow:', error);
      showError('Failed to save workflow');
    }
  };

  const getActiveStep = (): WorkflowStep | null => {
    if (!activeId) return null;
    const stepId = parseInt(activeId.replace('order-', ''));
    return steps.find((s) => s.id === stepId) || null;
  };

  if (loading) return <Loader />;
  if (!workflow) return <Typography>Workflow not found</Typography>;

  const activeStep = getActiveStep();
  const activeStepIndex = activeStep ? steps.findIndex((s) => s.id === activeStep.id) : -1;

  return (
    <PageWrapper
      title={workflow.name}
      description={workflow.description || 'Build your workflow by adding and arranging steps'}
      actions={[
        {
          label: 'Back to Workflows',
          onClick: () => navigate('/company/workflows'),
          variant: 'outlined',
          icon: <ArrowBackIcon />,
        },
        {
          label: saving ? 'Saving...' : 'Save Workflow',
          onClick: handleSaveWorkflow,
          variant: 'contained',
          color: 'primary',
          disabled: saving,
        },
      ]}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <S.StepsCard>
          {/* Header — title, step count pill, drag hint */}
          <S.StepsCardHeader>
            <S.StepsCardTitleRow>
              <S.StepsCardTitle>Workflow Steps</S.StepsCardTitle>
              <S.StepsCountBadge>
                {steps.length} {steps.length === 1 ? 'step' : 'steps'}
              </S.StepsCountBadge>
            </S.StepsCardTitleRow>
            <S.StepsCardSubtitle>
              <InfoOutlinedIcon />
              Drag the handle to reorder — the flow runs top to bottom
            </S.StepsCardSubtitle>
          </S.StepsCardHeader>

          {/* Rail + ordered step list */}
          <S.StepsRailWrapper>
            <S.StepsRail />

            <SortableContext
              items={steps.map((s) => `order-${s.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <S.StepsList>
                {steps.map((step, index) => (
                  <SortableStepItem
                    key={step.id}
                    step={step}
                    index={index}
                    onEdit={handleEditStep}
                    onDelete={handleDeleteStep}
                  />
                ))}
              </S.StepsList>
            </SortableContext>

            {steps.length === 0 && (
              <S.EmptyStepsHint>No steps yet — click below to add your first step</S.EmptyStepsHint>
            )}

            {/* Single add control — dashed node at the end of the rail */}
            <S.AddNodeWrapper onClick={handleAddStep}>
              <span />
              <S.AddNodeCircle className="add-node-circle">
                <AddIcon fontSize="small" />
              </S.AddNodeCircle>
              <S.AddNodeLabel className="add-node-label">Add step</S.AddNodeLabel>
            </S.AddNodeWrapper>
          </S.StepsRailWrapper>
        </S.StepsCard>

        {/* Drag overlay — floating ghost of the dragged row */}
        <DragOverlay>
          {activeStep && (
            <S.DragOverlayRow>
              <S.StepDragGrip>
                <DragIndicatorIcon fontSize="small" />
              </S.StepDragGrip>
              <S.StepNumberColumn>
                <S.StepNumberBadge stepcolor={S.STEP_COLORS[activeStepIndex % S.STEP_COLORS.length]}>
                  {activeStepIndex + 1}
                </S.StepNumberBadge>
              </S.StepNumberColumn>
              <S.StepCardBody
                stepcolor={S.STEP_COLORS[activeStepIndex % S.STEP_COLORS.length]}
              >
                <S.StepTitleRow>
                  <S.StepTitle>{activeStep.name}</S.StepTitle>
                </S.StepTitleRow>
                {activeStep.description && (
                  <S.StepDescription>{activeStep.description}</S.StepDescription>
                )}
              </S.StepCardBody>
            </S.DragOverlayRow>
          )}
        </DragOverlay>
      </DndContext>
    </PageWrapper>
  );
};
