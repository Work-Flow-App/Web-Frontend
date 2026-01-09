import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button as MuiButton, IconButton, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { workflowService } from '../../services/api';
import type { WorkflowStepResponse, WorkflowBulkUpdateRequest } from '../../services/api';
import { Loader } from '../../components/UI';
import styled from '@emotion/styled';
import { floowColors } from '../../theme/colors';

interface WorkflowStep extends WorkflowStepResponse {
  id: number;
  workflowId: number;
  name: string;
  description?: string;
  orderIndex: number;
  optional?: boolean;
}

interface SortableStepProps {
  step: WorkflowStep;
  index: number;
  onEdit: (step: WorkflowStep) => void;
  onDelete: (stepId: number) => void;
}

const StepCard = styled(Box)`
  background: white;
  border: 1px solid ${floowColors.grey[300]};
  border-radius: 8px;
  padding: 16px;
  min-width: 250px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: grab;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${floowColors.blue.main};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
`;

const StepContent = styled(Box)`
  flex: 1;
`;

const StepActions = styled(Box)`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const StepHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const SortableStep: React.FC<SortableStepProps> = ({ step, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <StepCard
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging' : ''}
    >
      <StepHeader>
        <Box
          {...attributes}
          {...listeners}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'grab' }}
        >
          <DragIndicatorIcon sx={{ color: floowColors.grey[400] }} />
        </Box>
        <Box sx={{
          minWidth: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: floowColors.blue.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}>
          {index + 1}
        </Box>
      </StepHeader>

      <StepContent>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
          {step.name}
        </Typography>
        {step.optional && (
          <Typography variant="caption" sx={{ color: floowColors.grey[500], display: 'block', mb: 1 }}>
            (Optional)
          </Typography>
        )}
        {step.description && (
          <Typography variant="body2" sx={{ color: floowColors.grey[600], mt: 1 }}>
            {step.description}
          </Typography>
        )}
      </StepContent>

      <StepActions>
        <IconButton size="small" onClick={() => onEdit(step)} sx={{ color: floowColors.blue.main }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onDelete(step.id)} sx={{ color: floowColors.error.main }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </StepActions>
    </StepCard>
  );
};

const EditorBox = styled(Box)`
  background: white;
  border: 1px solid ${floowColors.grey[300]};
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const WorkflowBuilderPage: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const [workflow, setWorkflow] = useState<{ id: number; name: string; description?: string } | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Step editor state
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [stepName, setStepName] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [stepOptional, setStepOptional] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch workflow and steps
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

        // Sort by orderIndex
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update orderIndex
        return newItems.map((item, index) => ({ ...item, orderIndex: index }));
      });
    }
  };

  const handleAddStep = () => {
    setIsAddingNew(true);
    setEditingStep(null);
    setStepName('');
    setStepDescription('');
    setStepOptional(false);
  };

  const handleEditStep = (step: WorkflowStep) => {
    setIsAddingNew(false);
    setEditingStep(step);
    setStepName(step.name);
    setStepDescription(step.description || '');
    setStepOptional(step.optional || false);
  };

  const handleSaveStep = () => {
    if (!stepName.trim()) {
      showError('Step name is required');
      return;
    }

    if (isAddingNew) {
      // Add new step
      const newStep: WorkflowStep = {
        id: Date.now(), // Temporary ID
        workflowId: Number(workflowId),
        name: stepName.trim(),
        description: stepDescription.trim() || undefined,
        orderIndex: steps.length,
        optional: stepOptional,
      };
      setSteps([...steps, newStep]);
      showSuccess('Step added');
    } else if (editingStep) {
      // Update existing step
      setSteps(steps.map(s =>
        s.id === editingStep.id
          ? { ...s, name: stepName.trim(), description: stepDescription.trim() || undefined, optional: stepOptional }
          : s
      ));
      showSuccess('Step updated');
    }

    // Reset editor
    setIsAddingNew(false);
    setEditingStep(null);
    setStepName('');
    setStepDescription('');
    setStepOptional(false);
  };

  const handleCancelEdit = () => {
    setIsAddingNew(false);
    setEditingStep(null);
    setStepName('');
    setStepDescription('');
    setStepOptional(false);
  };

  const handleDeleteStep = (stepId: number) => {
    setSteps(steps.filter(s => s.id !== stepId).map((s, index) => ({ ...s, orderIndex: index })));
    showSuccess('Step removed');
  };

  const handleSaveWorkflow = async () => {
    if (!workflowId || !workflow) return;

    try {
      setSaving(true);

      const payload: WorkflowBulkUpdateRequest = {
        name: workflow.name,
        description: workflow.description,
        steps: steps.map(step => ({
          id: step.id > 1000000000000 ? undefined : step.id, // Skip temporary IDs
          name: step.name,
          description: step.description,
          orderIndex: step.orderIndex,
          optional: step.optional,
        })),
      };

      await workflowService.bulkUpdateWorkflow(Number(workflowId), payload);
      showSuccess('Workflow saved successfully');

      // Refresh workflow data
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
    } catch (error) {
      console.error('Error saving workflow:', error);
      showError('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!workflow) {
    return <Typography>Workflow not found</Typography>;
  }

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
          disabled: isAddingNew || !!editingStep,
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
      <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Step Editor */}
        {(isAddingNew || editingStep) && (
          <EditorBox>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {isAddingNew ? 'Add New Step' : 'Edit Step'}
            </Typography>
            <TextField
              fullWidth
              label="Step Name"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description (optional)"
              value={stepDescription}
              onChange={(e) => setStepDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={stepOptional}
                  onChange={(e) => setStepOptional(e.target.checked)}
                />
              }
              label="Optional step (can be skipped)"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiButton variant="contained" onClick={handleSaveStep}>
                {isAddingNew ? 'Add Step' : 'Update Step'}
              </MuiButton>
              <MuiButton variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </MuiButton>
            </Box>
          </EditorBox>
        )}

        {/* Workflow Steps */}
        {steps.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: floowColors.grey[500] }}>
            <Typography variant="h6">No steps added yet</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Click "Add Step" to create your first workflow step
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={steps.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 'max-content',
                }}>
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <SortableStep
                        step={step}
                        index={index}
                        onEdit={handleEditStep}
                        onDelete={handleDeleteStep}
                      />
                      {index < steps.length - 1 && (
                        <ArrowForwardIcon
                          sx={{
                            color: floowColors.blue.main,
                            fontSize: '2rem',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          </Box>
        )}
      </Box>
    </PageWrapper>
  );
};
