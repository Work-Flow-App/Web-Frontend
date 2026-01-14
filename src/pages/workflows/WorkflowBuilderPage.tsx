import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, IconButton } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { workflowService } from '../../services/api';
import type { WorkflowStepResponse, WorkflowBulkUpdateRequest } from '../../services/api';
import { Loader } from '../../components/UI';
import { useGlobalModalOuterContext, ModalSizes } from '../../components/UI/GlobalModal';
import { StepForm, type StepFormStep } from './components/StepForm';
import * as S from './WorkflowBuilderPage.styles';

interface WorkflowStep extends WorkflowStepResponse {
  id: number;
  workflowId: number;
  name: string;
  description?: string;
  orderIndex: number;
  optional?: boolean;
}

// Source list item (draggable from source to target)
interface DraggableStepItemProps {
  step: WorkflowStep;
  onEdit: (step: WorkflowStep) => void;
  onDelete: (stepId: number) => void;
  isInOrder: boolean;
}

const DraggableStepItem: React.FC<DraggableStepItemProps> = ({ step, onEdit, onDelete, isInOrder }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `source-${step.id}`,
    data: { type: 'source', step },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(step);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(step.id);
  };

  return (
    <S.StepItem
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${isDragging ? 'dragging' : ''} ${isInOrder ? 'in-order' : ''}`}
    >
      <S.DragHandle>
        <DragIndicatorIcon fontSize="small" />
      </S.DragHandle>
      <S.StepItemName>{step.name}</S.StepItemName>
      {step.optional && <S.StepOptionalLabel>(Optional)</S.StepOptionalLabel>}
      <S.StepItemActions>
        <IconButton size="small" onClick={handleEditClick}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </S.StepItemActions>
    </S.StepItem>
  );
};

// Target list item (sortable within target list)
interface SortableStepItemProps {
  step: WorkflowStep;
  index: number;
  onRemove: (stepId: number) => void;
}

const SortableStepItem: React.FC<SortableStepItemProps> = ({ step, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `order-${step.id}`,
    data: { type: 'order', step },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <S.OrderedStepCard
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging' : ''}
    >
      <S.OrderedStepHeader>
        <S.DragHandle {...attributes} {...listeners}>
          <DragIndicatorIcon fontSize="small" />
        </S.DragHandle>
        <S.OrderedStepNumber>{index + 1}</S.OrderedStepNumber>
        <IconButton size="small" onClick={() => onRemove(step.id)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </S.OrderedStepHeader>
      <S.OrderedStepName>{step.name}</S.OrderedStepName>
      {step.description && (
        <S.OrderedStepDescription>{step.description}</S.OrderedStepDescription>
      )}
    </S.OrderedStepCard>
  );
};

// Droppable area for workflow order
interface DroppableOrderAreaProps {
  children: React.ReactNode;
  isEmpty: boolean;
}

const DroppableOrderArea: React.FC<DroppableOrderAreaProps> = ({ children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'order-area',
  });

  return (
    <S.WorkflowOrderBox ref={setNodeRef} className={isOver ? 'drag-over' : ''}>
      {isEmpty ? (
        <S.EmptyOrderState>Drag steps here to set the workflow order</S.EmptyOrderState>
      ) : (
        children
      )}
    </S.WorkflowOrderBox>
  );
};

export const WorkflowBuilderPage: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const [workflow, setWorkflow] = useState<{ id: number; name: string; description?: string } | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [orderedSteps, setOrderedSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!workflowId) return;

      try {
        setLoading(true);
        const response = await workflowService.getWorkflowWithSteps(Number(workflowId));
        const data = response.data;

        setWorkflow({
          id: data.id || 0,
          name: data.name || '',
          description: data.description,
        });

        const stepsData = (data.steps || []).map((step, index) => ({
          ...step,
          id: step.id || 0,
          workflowId: Number(workflowId),
          name: step.name || '',
          orderIndex: step.orderIndex ?? index,
        }));

        stepsData.sort((a, b) => a.orderIndex - b.orderIndex);
        setSteps(stepsData);
        setOrderedSteps(stepsData);
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

    const activeData = active.data.current;
    const overId = over.id as string;
    const activeIdStr = active.id as string;

    // Dragging from source list
    if (activeIdStr.startsWith('source-')) {
      const draggedStep = activeData?.step as WorkflowStep;
      if (!draggedStep) return;

      const isAlreadyInOrder = orderedSteps.some((s) => s.id === draggedStep.id);
      if (isAlreadyInOrder) return;

      // Dropped on the order area (empty or container)
      if (overId === 'order-area') {
        setOrderedSteps([...orderedSteps, draggedStep].map((s, i) => ({ ...s, orderIndex: i })));
        return;
      }

      // Dropped on an existing ordered step
      if (overId.startsWith('order-')) {
        const overIndex = orderedSteps.findIndex((s) => `order-${s.id}` === overId);
        if (overIndex !== -1) {
          const newOrderedSteps = [...orderedSteps];
          newOrderedSteps.splice(overIndex + 1, 0, draggedStep);
          setOrderedSteps(newOrderedSteps.map((s, i) => ({ ...s, orderIndex: i })));
        }
        return;
      }
    }

    // Reordering within order list
    if (activeIdStr.startsWith('order-') && overId.startsWith('order-')) {
      const oldIndex = orderedSteps.findIndex((s) => `order-${s.id}` === activeIdStr);
      const newIndex = orderedSteps.findIndex((s) => `order-${s.id}` === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrderedSteps = arrayMove(orderedSteps, oldIndex, newIndex);
        setOrderedSteps(newOrderedSteps.map((s, i) => ({ ...s, orderIndex: i })));
      }
    }
  };

  const handleRemoveFromOrder = (stepId: number) => {
    setOrderedSteps(orderedSteps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, orderIndex: i })));
  };

  const handleCloseModal = () => {
    resetGlobalModalOuterProps();
    setEditingStep(null);
  };

  const handleSaveStep = (stepData: StepFormStep) => {
    if (editingStep) {
      const updatedStep = { ...editingStep, name: stepData.name, description: stepData.description, optional: stepData.optional };
      setSteps(steps.map((s) => (s.id === editingStep.id ? updatedStep : s)));
      setOrderedSteps(orderedSteps.map((s) => (s.id === editingStep.id ? updatedStep : s)));
      showSuccess('Step updated');
    } else {
      const newStep: WorkflowStep = {
        id: stepData.id,
        workflowId: Number(workflowId),
        name: stepData.name,
        description: stepData.description,
        orderIndex: steps.length,
        optional: stepData.optional,
      };
      setSteps([...steps, newStep]);
      showSuccess('Step added');
    }
    handleCloseModal();
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setGlobalModalOuterProps({
      isOpen: true,
      children: <StepForm initialStep={null} onSave={handleSaveStep} isEditing={false} />,
      fieldName: 'addStep',
      size: ModalSizes.SMALL,
    });
  };

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep(step);
    setGlobalModalOuterProps({
      isOpen: true,
      children: <StepForm initialStep={step} onSave={handleSaveStep} isEditing={true} />,
      fieldName: 'editStep',
      size: ModalSizes.SMALL,
    });
  };

  const handleDeleteStep = (stepId: number) => {
    setSteps(steps.filter((s) => s.id !== stepId));
    setOrderedSteps(orderedSteps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, orderIndex: i })));
    showSuccess('Step removed');
  };

  const handleSaveWorkflow = async () => {
    if (!workflowId || !workflow) return;

    try {
      setSaving(true);

      const payload: WorkflowBulkUpdateRequest = {
        name: workflow.name,
        description: workflow.description,
        steps: orderedSteps.map((step) => ({
          id: step.id > 1000000000000 ? undefined : step.id,
          name: step.name,
          description: step.description,
          orderIndex: step.orderIndex,
          optional: step.optional,
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
      setOrderedSteps(stepsData);
    } catch (error) {
      console.error('Error saving workflow:', error);
      showError('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const getActiveStep = (): WorkflowStep | null => {
    if (!activeId) return null;
    const stepId = parseInt(activeId.replace('source-', '').replace('order-', ''));
    return steps.find((s) => s.id === stepId) || orderedSteps.find((s) => s.id === stepId) || null;
  };

  if (loading) {
    return <Loader />;
  }

  if (!workflow) {
    return <Typography>Workflow not found</Typography>;
  }

  const orderedStepIds = orderedSteps.map((s) => s.id);

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
          label: 'Add Step',
          onClick: handleAddStep,
          variant: 'outlined',
          icon: <AddIcon />,
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
        <S.BuilderContainer>
          {/* Source List - Available Steps */}
          <S.Section>
            <S.SectionTitle>Available Steps</S.SectionTitle>
            <S.SectionDescription>
              Drag steps from here to the workflow order below
            </S.SectionDescription>
            <S.AvailableStepsList>
              {steps.length === 0 ? (
                <S.EmptyOrderState>No steps created. Click "Add Step" to create one.</S.EmptyOrderState>
              ) : (
                steps.map((step) => (
                  <DraggableStepItem
                    key={step.id}
                    step={step}
                    onEdit={handleEditStep}
                    onDelete={handleDeleteStep}
                    isInOrder={orderedStepIds.includes(step.id)}
                  />
                ))
              )}
            </S.AvailableStepsList>
          </S.Section>

          {/* Target List - Workflow Order */}
          <S.Section>
            <S.SectionTitle>Workflow Order</S.SectionTitle>
            <S.SectionDescription>
              Drag and drop to reorder steps. This is the order steps will be executed.
            </S.SectionDescription>
            <SortableContext items={orderedSteps.map((s) => `order-${s.id}`)} strategy={horizontalListSortingStrategy}>
              <DroppableOrderArea isEmpty={orderedSteps.length === 0}>
                {orderedSteps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <SortableStepItem step={step} index={index} onRemove={handleRemoveFromOrder} />
                    {index < orderedSteps.length - 1 && (
                      <S.StepConnector>
                        <ArrowForwardIcon fontSize="inherit" />
                      </S.StepConnector>
                    )}
                  </React.Fragment>
                ))}
              </DroppableOrderArea>
            </SortableContext>
          </S.Section>
        </S.BuilderContainer>

        <DragOverlay>
          {activeId && getActiveStep() && (
            <S.StepItem style={{ opacity: 0.9, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <DragIndicatorIcon fontSize="small" />
              <S.StepItemName>{getActiveStep()?.name}</S.StepItemName>
            </S.StepItem>
          )}
        </DragOverlay>
      </DndContext>
    </PageWrapper>
  );
};
