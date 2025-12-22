import { InputValidationRules, type IFields } from '../../../utils/validation';

export const AssetFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter asset name',
    label: 'Asset Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter description (optional)',
    label: 'Description',
    isRequired: false,
  },
  serialNumber: {
    title: 'serialNumber',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter serial number (optional)',
    label: 'Serial Number',
    isRequired: false,
  },
  assetTag: {
    title: 'assetTag',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter asset tag (e.g., TOOL-042)',
    label: 'Asset Tag',
    isRequired: false,
  },
  purchasePrice: {
    title: 'purchasePrice',
    rule: InputValidationRules.NumberValidationWithRange(0),
    defaultValue: '',
    placeHolder: 'Enter purchase price',
    label: 'Purchase Price',
    isRequired: true,
  },
  purchaseDate: {
    title: 'purchaseDate',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'YYYY-MM-DD',
    label: 'Purchase Date',
    isRequired: true,
  },
  depreciationRate: {
    title: 'depreciationRate',
    rule: InputValidationRules.NumberValidationWithRange(0, 100),
    defaultValue: '',
    placeHolder: 'Enter depreciation rate (0-100)',
    label: 'Depreciation Rate (%)',
    isRequired: false,
  },
  salvageValue: {
    title: 'salvageValue',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: '',
    placeHolder: 'Enter salvage value (optional)',
    label: 'Salvage Value',
    isRequired: false,
  },
  currentLocation: {
    title: 'currentLocation',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter current location (optional)',
    label: 'Current Location',
    isRequired: false,
  },
  latitude: {
    title: 'latitude',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: '',
    placeHolder: 'Enter latitude (optional)',
    label: 'Latitude',
    isRequired: false,
  },
  longitude: {
    title: 'longitude',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: '',
    placeHolder: 'Enter longitude (optional)',
    label: 'Longitude',
    isRequired: false,
  },
};

export interface AssetFormData {
  name: string;
  description?: string;
  serialNumber?: string;
  assetTag?: string;
  purchasePrice: number;
  purchaseDate: string;
  depreciationRate?: number;
  salvageValue?: number;
  currentLocation?: string;
  latitude?: number;
  longitude?: number;
}
