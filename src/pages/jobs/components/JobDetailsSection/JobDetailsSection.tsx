import React, { useState } from 'react';
import { IconButton, Collapse, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import type { JobResponse, ClientResponse, JobTemplateResponse, JobTemplateFieldResponse } from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';

interface JobDetailsSectionProps {
  job: JobResponse;
  client: ClientResponse | null;
  template: JobTemplateResponse | null;
  templateFields: JobTemplateFieldResponse[];
  title: string;
  defaultExpanded?: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  job,
  client,
  template,
  templateFields,
  title,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  // Get field value from job.fieldValues
  const getFieldValue = (fieldId: number) => {
    if (!job.fieldValues) return null;
    const fieldValue = job.fieldValues[String(fieldId)];
    if (fieldValue && typeof fieldValue === 'object' && 'value' in fieldValue) {
      return fieldValue.value;
    }
    return fieldValue;
  };

  // Sort fields by orderIndex
  const sortedFields = [...templateFields].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <S.CollapsibleSection>
      <S.CollapsibleSectionHeader onClick={toggleExpanded}>
        <S.CollapsibleSectionTitle>{title}</S.CollapsibleSectionTitle>
        <S.CollapsibleSectionActions>
          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </S.CollapsibleSectionActions>
      </S.CollapsibleSectionHeader>

      <Collapse in={isExpanded}>
        <S.CollapsibleSectionContent>
          {title === 'Job Details' ? (
            // Job Details - Show client info, job info, and custom fields
            <S.FieldGrid>
              <S.FieldColumn>
                {/* Client Information */}
                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <BusinessIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Client Name
                    </Box>
                  </div>
                  <div className="field-value">{client?.name || '-'}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Email
                    </Box>
                  </div>
                  <div className="field-value">{client?.email || '-'}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Telephone
                    </Box>
                  </div>
                  <div className="field-value">{client?.telephone || '-'}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneAndroidIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Mobile
                    </Box>
                  </div>
                  <div className="field-value">{client?.mobile || '-'}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Address
                    </Box>
                  </div>
                  <div className="field-value">{client?.address || '-'}</div>
                </S.FieldItem>
              </S.FieldColumn>

              <S.FieldColumn>
                {/* Job Information */}
                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <CategoryIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Job Status
                    </Box>
                  </div>
                  <div className="field-value">
                    <S.StatusBadge statusType={job.status} style={{ fontSize: 12, padding: '4px 10px' }}>
                      <S.StatusIcon />
                      {job.status || 'N/A'}
                    </S.StatusBadge>
                  </div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <DescriptionIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Template
                    </Box>
                  </div>
                  <div className="field-value">{template?.name || '-'}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Created
                    </Box>
                  </div>
                  <div className="field-value">{formatDate(job.createdAt)}</div>
                </S.FieldItem>

                <S.FieldItem>
                  <div className="field-label">
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" sx={{ opacity: 0.6 }} />
                      Updated
                    </Box>
                  </div>
                  <div className="field-value">{formatDate(job.updatedAt)}</div>
                </S.FieldItem>

                {/* Template Description */}
                {template?.description && (
                  <S.FieldItem>
                    <div className="field-label">Description</div>
                    <div className="field-value" style={{ whiteSpace: 'pre-wrap' }}>
                      {template.description}
                    </div>
                  </S.FieldItem>
                )}
              </S.FieldColumn>
            </S.FieldGrid>
          ) : (
            // Policy Details or other sections - Show custom fields from template
            <S.FieldGrid>
              <S.FieldColumn>
                {sortedFields
                  .filter((_, index) => index % 2 === 0)
                  .map((field) => (
                    <S.FieldItem key={field.id}>
                      <div className="field-label">{field.label || field.name}</div>
                      <div className="field-value">
                        {getFieldValue(field.id!) || '-'}
                      </div>
                    </S.FieldItem>
                  ))}
              </S.FieldColumn>
              <S.FieldColumn>
                {sortedFields
                  .filter((_, index) => index % 2 === 1)
                  .map((field) => (
                    <S.FieldItem key={field.id}>
                      <div className="field-label">{field.label || field.name}</div>
                      <div className="field-value">
                        {getFieldValue(field.id!) || '-'}
                      </div>
                    </S.FieldItem>
                  ))}
              </S.FieldColumn>
            </S.FieldGrid>
          )}
        </S.CollapsibleSectionContent>
      </Collapse>
    </S.CollapsibleSection>
  );
};
