import { useMemo } from 'react';
import { SchemaGenerator } from './SchemaGenerator';
import type {
  IFields,
  IFieldTitles,
  IFieldPlaceHolders,
  IDefaultValues,
  IFieldIsRequired,
} from './SchemaGenerator';

export interface ISchema {
  fieldTitles: IFieldTitles;
  fieldRules: any;
  defaultValues: IDefaultValues;
  placeHolders: IFieldPlaceHolders;
  fieldLabels: IFieldTitles;
  isRequireds: IFieldIsRequired;
}

export const useSchema = (fields: IFields, dynamicDefaultValues?: IDefaultValues): ISchema => {
  const methods = useMemo(() => {
    const schema = new SchemaGenerator(fields);
    const fieldTitles = schema.getTitles();
    const fieldRules = schema.getRules();
    const defaultValues = dynamicDefaultValues || schema.getDefaultValues();
    const placeHolders = schema.getPlaceHolders();
    const fieldLabels = schema.getLabels();
    const isRequireds = schema.getIsRequireds();

    return {
      fieldTitles,
      fieldRules,
      defaultValues,
      placeHolders,
      fieldLabels,
      isRequireds,
    };
  }, [fields, dynamicDefaultValues]);

  return methods;
};
