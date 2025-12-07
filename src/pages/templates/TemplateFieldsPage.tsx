import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { TemplateFields } from './components/TemplateFields/TemplateFields';
import type { TemplateFieldsRef } from './components/TemplateFields/TemplateFields';
import { jobTemplateService } from '../../services/api';
import { Loader } from '../../components/UI';

export const TemplateFieldsPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const templateFieldsRef = useRef<TemplateFieldsRef>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) {
        navigate('/company/jobs/templates');
        return;
      }

      try {
        setLoading(true);
        const response = await jobTemplateService.getTemplateById(Number(templateId));
        setTemplateName(response.data?.name || 'Unknown Template');
      } catch (error) {
        console.error('Error fetching template:', error);
        navigate('/company/jobs/templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, navigate]);

  const handleBack = () => {
    navigate('/company/jobs/templates');
  };

  const handleAddField = () => {
    templateFieldsRef.current?.handleAddField();
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <PageWrapper
      title={`Template Fields - ${templateName}`}
      description="Manage fields for this job template"
      actions={[
        {
          label: 'Add Field',
          onClick: handleAddField,
          variant: 'contained',
          color: 'primary',
        },
        {
          label: 'Back to Templates',
          onClick: handleBack,
          variant: 'outlined',
          color: 'secondary',
        },
      ]}
    >
      {templateId && (
        <TemplateFields
          ref={templateFieldsRef}
          templateId={Number(templateId)}
        />
      )}
    </PageWrapper>
  );
};
