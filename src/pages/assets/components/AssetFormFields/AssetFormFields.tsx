import React from 'react';
import { AssetFormSchema } from '../../schema/AssetFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';

export interface AssetFormFieldsProps {
  isEditMode?: boolean;
}

export const AssetFormFields: React.FC<AssetFormFieldsProps> = ({ isEditMode }) => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(AssetFormSchema);

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.description} required={isRequireds.description}>
        <TextArea
          name={fieldTitles.description}
          placeholder={placeHolders.description}
          hideErrorMessage={false}
          rows={3}
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.serialNumber} required={isRequireds.serialNumber}>
          <Input
            name={fieldTitles.serialNumber}
            placeholder={placeHolders.serialNumber}
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.assetTag} required={isRequireds.assetTag}>
          <Input
            name={fieldTitles.assetTag}
            placeholder={placeHolders.assetTag}
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.purchasePrice} required={isRequireds.purchasePrice}>
          <Input
            name={fieldTitles.purchasePrice}
            placeholder={placeHolders.purchasePrice}
            type="number"
            hideErrorMessage={false}
            disabled={isEditMode}
          />
        </FormField>
        <FormField label={fieldLabels.purchaseDate} required={isRequireds.purchaseDate}>
          <Input
            name={fieldTitles.purchaseDate}
            placeholder={placeHolders.purchaseDate}
            type="date"
            hideErrorMessage={false}
            disabled={isEditMode}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.depreciationRate} required={isRequireds.depreciationRate}>
          <Input
            name={fieldTitles.depreciationRate}
            placeholder={placeHolders.depreciationRate}
            type="number"
            hideErrorMessage={false}
            disabled={isEditMode}
          />
        </FormField>
        <FormField label={fieldLabels.salvageValue} required={isRequireds.salvageValue}>
          <Input
            name={fieldTitles.salvageValue}
            placeholder={placeHolders.salvageValue}
            type="number"
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>

      <FormField label={fieldLabels.currentLocation} required={isRequireds.currentLocation}>
        <Input
          name={fieldTitles.currentLocation}
          placeholder={placeHolders.currentLocation}
          hideErrorMessage={false}
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.latitude} required={isRequireds.latitude}>
          <Input
            name={fieldTitles.latitude}
            placeholder={placeHolders.latitude}
            type="number"
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.longitude} required={isRequireds.longitude}>
          <Input
            name={fieldTitles.longitude}
            placeholder={placeHolders.longitude}
            type="number"
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>
    </>
  );
};
