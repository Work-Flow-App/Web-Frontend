import React from 'react';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ConstructionIcon from '@mui/icons-material/Construction';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import type { QuickActionConfig, QuickActionId } from '../types';
import * as S from './QuickActionsWidget.styles';

interface QuickActionsWidgetProps {
  configs: QuickActionConfig[];
  onCreateJob: () => void;
  onAddWorker: () => void;
  onAddClient: () => void;
  onAddAsset: () => void;
  onAddCustomer: () => void;
  onCreateFormTemplate: () => void;
  onCreateSubmission: () => void;
  onNewWorkflow: () => void;
  onCreateJobTemplate: () => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  configs,
  onCreateJob,
  onAddWorker,
  onAddClient,
  onAddAsset,
  onAddCustomer,
  onCreateFormTemplate,
  onCreateSubmission,
  onNewWorkflow,
  onCreateJobTemplate,
}) => {
  const isVisible = (id: QuickActionId) => {
    const config = configs.find((c) => c.id === id);
    return config ? config.visible : true;
  };

  // If none of the quick actions are visible, we don't render the container at all
  const hasVisibleActions = configs.some((c) => c.visible);
  if (!hasVisibleActions) return null;

  return (
    <S.Container>
      <S.TitleText variant="subtitle2">Quick Actions</S.TitleText>
      <S.ActionsGrid>
        {/* 1. New Job */}
        {isVisible('new_job') && (
          <S.ActionButton onClick={onCreateJob}>
            <S.IconWrapper colorType="success">
              <WorkOutlineIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">New Job</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Create a job</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 2. Add Worker */}
        {isVisible('add_worker') && (
          <S.ActionButton onClick={onAddWorker}>
            <S.IconWrapper colorType="info">
              <PeopleOutlineIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Add Worker</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Add a team member</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 3. Add Client */}
        {isVisible('add_client') && (
          <S.ActionButton onClick={onAddClient}>
            <S.IconWrapper colorType="primary">
              <BusinessIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Add Client</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Register a client</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 4. Add Asset */}
        {isVisible('add_asset') && (
          <S.ActionButton onClick={onAddAsset}>
            <S.IconWrapper colorType="warning">
              <ConstructionIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Add Asset</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Register an asset</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 5. Add Customer */}
        {isVisible('add_customer') && (
          <S.ActionButton onClick={onAddCustomer}>
            <S.IconWrapper colorType="success">
              <PersonOutlineIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Add Customer</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Add a customer</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 6. Create Form Template */}
        {isVisible('create_form') && (
          <S.ActionButton onClick={onCreateFormTemplate}>
            <S.IconWrapper colorType="primary">
              <DescriptionOutlinedIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Create Form</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Build form template</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 7. Create Submission */}
        {isVisible('create_submission') && (
          <S.ActionButton onClick={onCreateSubmission}>
            <S.IconWrapper colorType="info">
              <AssignmentTurnedInOutlinedIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Create Submission</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Submit form details</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 8. New Workflow */}
        {isVisible('new_workflow') && (
          <S.ActionButton onClick={onNewWorkflow}>
            <S.IconWrapper colorType="warning">
              <AccountTreeIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">New Workflow</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Build a workflow</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}

        {/* 9. Create Job Template */}
        {isVisible('create_template') && (
          <S.ActionButton onClick={onCreateJobTemplate}>
            <S.IconWrapper colorType="error">
              <AssignmentOutlinedIcon />
            </S.IconWrapper>
            <S.TextWrapper>
              <S.ActionLabel variant="body2">Create Template</S.ActionLabel>
              <S.ActionSubLabel variant="caption">Job template setup</S.ActionSubLabel>
            </S.TextWrapper>
          </S.ActionButton>
        )}
      </S.ActionsGrid>
    </S.Container>
  );
};
