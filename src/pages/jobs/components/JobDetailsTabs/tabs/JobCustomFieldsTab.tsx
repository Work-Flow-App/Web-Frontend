import React from 'react';
import type { JobResponse, JobTemplateFieldResponse } from '../../../../../services/api';
import * as S from '../../../JobDetailsPage.styles';

interface JobCustomFieldsTabProps {
  job: JobResponse;
  templateFields: JobTemplateFieldResponse[];
}

export const JobCustomFieldsTab: React.FC<JobCustomFieldsTabProps> = ({ job, templateFields }) => {
  return (
    <>
      <S.DetailsSectionTitle>Custom field values</S.DetailsSectionTitle>
      <S.DetailsContent>
        {job.fieldValues && Object.keys(job.fieldValues).length > 0 ? (
          <>
            {/* Use template fields to determine required vs optional */}
            {(() => {
              // Create a map of field IDs to template field definitions
              const fieldDefinitionMap = new Map<string, JobTemplateFieldResponse>();
              templateFields.forEach((field) => {
                if (field.id) {
                  fieldDefinitionMap.set(String(field.id), field);
                }
              });

              const requiredFields = Object.entries(job.fieldValues).filter(([key, _]) => {
                const fieldDef = fieldDefinitionMap.get(key);
                return fieldDef && fieldDef.required === true;
              });

              const optionalFields = Object.entries(job.fieldValues).filter(([key, _]) => {
                const fieldDef = fieldDefinitionMap.get(key);
                return !fieldDef || fieldDef.required !== true;
              });

              return (
                <>
                  {/* Required Fields Section */}
                  {requiredFields.length > 0 && (
                    <>
                      <S.FieldsGroupTitle>Required Fields</S.FieldsGroupTitle>
                      {requiredFields.map(([key, fieldValueResponse]) => {
                        const fieldDef = fieldDefinitionMap.get(key);
                        const value =
                          fieldValueResponse &&
                          typeof fieldValueResponse === 'object' &&
                          'value' in fieldValueResponse
                            ? String(fieldValueResponse.value || '-')
                            : String(fieldValueResponse || '-');

                        const label = fieldDef?.label || key;
                        const fieldType = fieldDef?.jobFieldType || 'TEXT';

                        return (
                          <S.DetailRow key={key}>
                            <S.DetailLabel>
                              <S.RequiredIndicator>*</S.RequiredIndicator>
                              {label}
                              <S.FieldTypeLabel>({fieldType})</S.FieldTypeLabel>
                            </S.DetailLabel>
                            <S.DetailValue>{value}</S.DetailValue>
                          </S.DetailRow>
                        );
                      })}
                    </>
                  )}

                  {/* Optional Fields Section */}
                  {optionalFields.length > 0 && (
                    <>
                      {requiredFields.length > 0 && (
                        <S.FieldsGroupTitle style={{ marginTop: '24px' }}>Optional Fields</S.FieldsGroupTitle>
                      )}
                      {optionalFields.map(([key, fieldValueResponse]) => {
                        const fieldDef = fieldDefinitionMap.get(key);
                        const value =
                          fieldValueResponse &&
                          typeof fieldValueResponse === 'object' &&
                          'value' in fieldValueResponse
                            ? String(fieldValueResponse.value || '-')
                            : String(fieldValueResponse || '-');

                        const label = fieldDef?.label || key;
                        const fieldType = fieldDef?.jobFieldType || 'TEXT';

                        return (
                          <S.DetailRow key={key}>
                            <S.DetailLabel>
                              {label}
                              <S.FieldTypeLabel>({fieldType})</S.FieldTypeLabel>
                            </S.DetailLabel>
                            <S.DetailValue>{value}</S.DetailValue>
                          </S.DetailRow>
                        );
                      })}
                    </>
                  )}
                </>
              );
            })()}
          </>
        ) : (
          <S.PlaceholderText>No custom fields defined for this job</S.PlaceholderText>
        )}
      </S.DetailsContent>
    </>
  );
};
