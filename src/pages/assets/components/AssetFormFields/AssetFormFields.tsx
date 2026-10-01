import React, { useEffect, useState } from 'react';
import { AssetFormSchema } from '../../schema/AssetFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';
import LocationMapField from '../../../jobs/components/JobFormFields/LocationMapField';
import { assetGroupService } from '../../../../services/api';
import type { AssetGroupResponse } from '../../../../services/api';

export const AssetFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(AssetFormSchema);
  const [groups, setGroups] = useState<AssetGroupResponse[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const response = await assetGroupService.getAllAssetGroups();
        setGroups(response.data.content || []);
      } catch (error) {
        console.error('Error fetching asset groups:', error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const groupOptions = groups.map((group) => ({
    label: group.name || '',
    value: group.id || 0,
  }));

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

      <FormField label={fieldLabels.groupId} required={isRequireds.groupId}>
        <Dropdown
          name={fieldTitles.groupId}
          placeHolder={placeHolders.groupId}
          preFetchedOptions={groupOptions}
          isPreFetchLoading={loadingGroups}
          fullWidth
          disablePortal
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.purchasePrice} required={isRequireds.purchasePrice}>
          <Input
            name={fieldTitles.purchasePrice}
            placeholder={placeHolders.purchasePrice}
            type="number"
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.purchaseDate} required={isRequireds.purchaseDate}>
          <Input
            name={fieldTitles.purchaseDate}
            placeholder={placeHolders.purchaseDate}
            type="date"
            hideErrorMessage={false}
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

      <FormField label="Warehouse Address (optional)">
        <LocationMapField namePrefix="warehouseAddress" />
      </FormField>
    </>
  );
};
