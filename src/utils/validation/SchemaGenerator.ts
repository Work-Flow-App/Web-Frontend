import { generateFormValidationSchema } from './inputSchema';

type FieldRule = any;
type DefaultValue = any;

export interface IField {
  /**
   * The title of the field
   */
  title: string;

  /**
   * The label of the field
   */
  label?: string;

  /**
   * The rule of the field
   */
  rule?: FieldRule;

  /**
   * The default value of the field
   */
  defaultValue?: any;

  /**
   * The initial Value of the field
   */
  initialValue?: any;

  /**
   * The placeholder of the field
   */
  placeHolder?: string;

  /**
   * The start icon of the field
   */
  startIcon?: string;

  /**
   * the end icon of the field
   */
  endIcon?: string;

  /**
   * Indicates whether the field is required or not
   */
  isRequired?: boolean;
}

export interface IFieldRules {
  [name: string]: any;
}

export interface IDefaultValues {
  [name: string]: DefaultValue;
}

export interface IFieldTitles {
  [name: string]: string;
}

export interface IFieldIcons {
  [name: string]: string;
}

export interface IFieldPlaceHolders {
  [name: string]: string;
}

export interface IFields {
  [name: string]: IField;
}

export interface IFieldIsRequired {
  [name: string]: boolean;
}

export class SchemaGenerator {
  schemaFields: IFields = {};
  rules: IFieldRules = {};
  defaultValues: IDefaultValues = {};
  fieldTitles: IFieldTitles = {};
  fieldLabels: IFieldTitles = {};
  placeHolders: IFieldPlaceHolders = {};
  startIcons: IFieldIcons = {};
  isRequireds: IFieldIsRequired = {};

  constructor(_schemaFields: IFields) {
    this.schemaFields = _schemaFields;

    const keys = Object.keys(this.schemaFields);

    for (const key of keys) {
      const field = this.schemaFields[key];
      const keyTitle = field.title;
      this.fieldTitles[key] = keyTitle;
      if (field.rule) {
        this.rules[keyTitle] = field.rule;
      }
      if (field.defaultValue !== undefined) {
        this.defaultValues[keyTitle] = field.defaultValue;
      }

      if (field.placeHolder) {
        this.placeHolders[key] = field.placeHolder;
      }
      if (field.startIcon) {
        this.startIcons[key] = field.startIcon;
      }
      if (field.label) {
        this.fieldLabels[key] = field.label;
      }
      if (field.isRequired) {
        this.isRequireds[key] = field.isRequired;
      }
    }
  }

  getRules = () => {
    return generateFormValidationSchema(this.rules);
  };

  getDefaultValues = (): IDefaultValues => {
    return this.defaultValues;
  };

  getTitles = (): IFieldTitles => {
    return this.fieldTitles;
  };

  getPlaceHolders = (): IFieldPlaceHolders => {
    return this.placeHolders;
  };

  getStartIcons = (): IFieldPlaceHolders => {
    return this.startIcons;
  };

  getLabels = (): IFieldTitles => {
    return this.fieldLabels;
  };

  getIsRequireds = (): IFieldIsRequired => {
    return this.isRequireds;
  };
}
