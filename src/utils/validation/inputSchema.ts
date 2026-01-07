import { object, string, number, date, ref, mixed, boolean, array, ValidationError } from 'yup';

export const generateFormValidationSchema = (schema: any) => {
  return object(schema).required();
};

const checkUserEmail = (value?: string) => {
  if (value) {
    const emailValidateRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValid = value.match(emailValidateRegex);

    if (isValid) {
      return true;
    }
  }

  return false;
};

const checkUserName = (value: string, { createError }: any) => {
  if (value) {
    const emailValidateRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9._-]+$/; // Allow alphanumeric, dots, underscores, and hyphens

    const isValid = value.match(emailValidateRegex) || value.match(usernameRegex);

    if (isValid) {
      return true;
    }
    return createError({
      message: `Invalid Email or Username.`,
    });
  }
  return false;
};

const checkEmailList = (value: string, { createError }: any) => {
  if (value) {
    const emailValidateRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emails = value.split(',');
    let isValid: any = false;

    if (emails.length > 0) {
      for (let index = 0; index < emails.length; index++) {
        const isEmail = emails[index].match(emailValidateRegex);
        isValid = isEmail;
        if (!isEmail) {
          break;
        }
      }
    }

    if (isValid) {
      return true;
    }
    return createError({
      message: `Invalid Email List.`,
    });
  }
  return false;
};

const checkPassword = (value: string, { createError }: any) => {
  if (value) {
    const validRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+.\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+.\-=[\]{};':"\\|,.<>/?]{6,}$/;

    const isValid = value.match(validRegex);

    if (isValid) {
      return true;
    }
    return createError({
      message: `Password must contain at least 6 characters, one uppercase, one lowercase, one number, and one special character.`,
    });
  }
  return false;
};

const checkDropDownField = (fieldName?: string, fullText?: boolean) => {
  let errorMessage = 'Required!';
  if (fullText && fieldName) {
    errorMessage = fieldName;
  } else if (fieldName) {
    errorMessage = `${fieldName} is required.`;
  }
  return object().required(errorMessage);
};

const checkStringRequired = (fieldName: string) => {
  return string().required(`${fieldName} is required.`);
};

const stringValidationWithMessage = (fieldName: string) => {
  return string().required(`${fieldName}`);
};

const emailValidationWithMessage = (fieldName: string) => {
  return string().email(`${fieldName}`);
};

const dependencyValidation = (fieldName: string, defaultValue?: number) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0].value !== defaultValue?.toString()) {
      return InputValidationRules.DropDownRequired();
    }
    return object().notRequired();
  });
};

const dependencyTextFieldValidationWithArray = (fieldName: string, childSchema: any) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0].value !== '0') {
      return InputValidationRules.ObjectArrayValidation(childSchema);
    }
    return InputValidationRules.ObjectArrayValidation({});
  });
};

const dependencyValidationOfArrayWithIsSelectedFilter = (childSchema: any) => {
  return array()
    .of(
      object().shape({
        ...childSchema,
        isSelected: boolean().required('isSelected is required'),
      })
    )
    .test('at-least-one-selected', 'At least one item must be selected', (value) => {
      if (!Array.isArray(value)) return false;
      return value.some((item) => item.isSelected === true);
    })
    .test('validate-selected-items', function (value) {
      if (!Array.isArray(value)) return true;

      const errors: ValidationError[] = [];

      value.forEach((item, index) => {
        if (item.isSelected) {
          try {
            object().shape(childSchema).validateSync(item, { abortEarly: false });
          } catch (err) {
            if (err instanceof ValidationError) {
              // Convert each inner error to a new ValidationError with the correct path
              err.inner.forEach((validationError) => {
                const error = new ValidationError(
                  validationError.message,
                  item,
                  `${this.path}[${index}].${validationError.path}`,
                  'validation'
                );
                errors.push(error);
              });
            }
          }
        }
      });

      if (errors.length > 0) {
        // Create a new aggregate error containing all individual errors
        const combinedError = new ValidationError(errors);
        combinedError.value = value;
        throw combinedError;
      }

      return true;
    });
};

const dependencyObjectValidation = (childSchema: any) => {
  return object().shape(childSchema);
};

const optionalObjectValidation = (childSchema: any) => {
  return mixed().test('is-valid-object', 'Invalid object data', function (value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return true; // skip validation if not a valid object
    }
    // validate the object using the child schema
    try {
      const shapeSchema = object().shape(childSchema);
      shapeSchema.validateSync(value, { abortEarly: false });
      return true;
    } catch (e) {
      return this.createError({ message: 'Invalid object data' });
    }
  });
};

const objectArrayValidation = (childSchema: any) => {
  return array().of(object().shape(childSchema));
};

const objectArrayValidationWithAtLeastOneItem = (childSchema: any) => {
  return array().of(object().shape(childSchema)).min(1, 'At least one item is required');
};

const dependencyValidationWithSpecificValue = (fieldName: string, value: any) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0].value === value) {
      return InputValidationRules.StringRequired;
    }
    return string().notRequired();
  });
};

const checkStringRequiredWhenRadioIsTrue = (fieldName: string, value: any) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0] === value) {
      return InputValidationRules.StringRequired;
    }
    return string().notRequired();
  });
};

const checkEmailListWhenRadioIsTrue = (fieldName: string, value: string) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0] === value) {
      return InputValidationRules.EmailListRequired;
    }
    return string().notRequired();
  });
};

const dependencyValidationWithSpecificValueForDropdown = (fieldName: string, value: number) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0] && selectedValue[0].value === value) {
      return InputValidationRules.DropDownRequired();
    }
    return object().notRequired();
  });
};

const dependencyValidationWithSpecificValueForDynamicInput = (
  fieldName: string,
  conditionValues: any,
  requiredRule: any,
  notRequiredRule: any,
  labelChecked?: boolean
) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0]) {
      if (Array.isArray(conditionValues)) {
        const sValue = labelChecked ? selectedValue[0]?.label : selectedValue[0]?.value || selectedValue[0];
        const itemIndex = conditionValues.indexOf(sValue);
        if (itemIndex > -1) {
          if (Array.isArray(requiredRule)) {
            return requiredRule[itemIndex];
          }
          return requiredRule;
        }
      } else {
        if (conditionValues) {
          return requiredRule;
        }
      }
    }
    return notRequiredRule;
  });
};

const dependencyValidationWithAnyValueForDynamicInput = (
  fieldName: string,
  requiredRule: any,
  notRequiredRule: any
) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0]) {
      const sValue = selectedValue[0]?.value || selectedValue[0];
      if (sValue) {
        if (Array.isArray(requiredRule)) {
          return requiredRule;
        }
        return requiredRule;
      }
    }
    return notRequiredRule;
  });
};

const atLeastOneValidItem = (
  childSchema: any,
  errorMessage = 'At least one item must satisfy the validation rules.'
) => {
  return array().test('at-least-one-valid', errorMessage, (items) => {
    if (!Array.isArray(items) || items.length === 0) return false;
    return items.some((item) => {
      try {
        // Validate each item individually
        object().shape(childSchema).validateSync(item, { abortEarly: false });
        return true; // If validation succeeds, return true
      } catch (error) {
        return false; // If validation fails, return false
      }
    });
  });
};

const integerOnlyValidation = number()
  .transform((value, originalValue) => (originalValue === '' ? null : value))
  .nullable()
  .required('Required!')
  .integer('Must be an integer. Ex: 1, 2, 3...')
  .typeError('Must be a number');

const numberValidationWithMinMax = (min = 0, max = Infinity) => {
  let schema = number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .required('Required!')
    .typeError('Must be a number')
    .min(min, `Minimum value ${min}`);

  // Apply max validation **only if** max is a finite number
  if (Number.isFinite(max)) {
    schema = schema.max(max, `Maximum value ${max}`);
  }

  return schema;
};

const dependencyValidationForSingleFile = (
  fieldName: string,
  conditionValue: any,
  requiredRule: any,
  notRequiredRule: any
) => {
  return object().when(fieldName, (selectedValue) => {
    if (selectedValue[0]) {
      if (Array.isArray(selectedValue[0])) {
        const selectedFileValue = selectedValue[0];
        if (selectedFileValue[0]?.includes(conditionValue)) {
          return requiredRule;
        }
        return notRequiredRule;
      }
    }
    return notRequiredRule;
  });
};

export const InputValidationRules = {
  Object: object(),
  ObjectRequired: object().required('Required!'),
  StringRequired: string().required('Required!'),
  DynamicStringRequired: checkStringRequired,
  LoginPasswordRequired: string().required('Password is required.'),
  OldPasswordRequired: string().required('Old Password is required.'),
  NumberRequired: number().required('Required!'),
  NumberNotRequired: number()
    .notRequired()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value)),
  EmailRequired: string().required('Required!').email('Valid email required!'),
  AgeRequired: number().required().positive().integer(),
  Email: string().test('Email must be a valid email address', (value) => !value || checkUserEmail(value)),
  String: string(),
  Number: number(),
  Age: number().positive().integer(),
  Website: string().url().nullable(),
  Date: date().default(() => new Date()),
  UserNameRequired: string().required('Username or Email is required.').test(checkUserName),
  EmailListRequired: string().required('Required!').test(checkEmailList),
  PasswordRequired: string().required('Password is required.').test(checkPassword),
  NewPasswordRequired: string().required('Required').test(checkPassword),
  RetypePasswordMatched: string()
    .required(`Required`)
    .oneOf([ref('newPassword'), ref('password')], "Password didn't matched."),
  FileRequired: mixed().test('fileFormat', 'Invalid file format, only accept images.', (value: any) => {
    return value && value.length;
  }),
  DropDownRequired: checkDropDownField,
  ObjectNotRequired: object().notRequired(),
  StringNotRequired: string().notRequired(),
  StringRequiredWithMessage: stringValidationWithMessage,
  CheckBoxRequired: boolean().oneOf([true]),
  BooleanNotRequired: boolean().notRequired(),
  SelectOne: boolean().oneOf([true]),
  EmailWithMessage: emailValidationWithMessage,
  DependencyRequired: dependencyValidation,
  DependencyTextFieldRequiredWithArray: dependencyTextFieldValidationWithArray,
  ObjectArrayValidation: objectArrayValidation,
  ObjectArrayValidationWithAtLeastOneItem: objectArrayValidationWithAtLeastOneItem,
  ObjectValidation: dependencyObjectValidation,
  DependencyRequiredWithSpecificValue: dependencyValidationWithSpecificValue,
  StringRequiredWhenRadioOptionIsTrue: checkStringRequiredWhenRadioIsTrue,
  ArrayRequired: array().min(1, 'Required!'),
  ArrayNotRequired: array().notRequired(),
  DependencyValidationForDropdownWithSpecificValue: dependencyValidationWithSpecificValueForDropdown,
  DependencyValidationForDynamicInputWithSpecificValue: dependencyValidationWithSpecificValueForDynamicInput,
  DependencyValidationForSingleFile: dependencyValidationForSingleFile,
  OptionalObjectValidation: optionalObjectValidation,
  EmailListRequiredWhenRadioOptionIsTrue: checkEmailListWhenRadioIsTrue,
  DependencyValidationWithAnyValueForDynamicInput: dependencyValidationWithAnyValueForDynamicInput,
  DependencyValidationOfArrayWithIsSelectedFilter: dependencyValidationOfArrayWithIsSelectedFilter,
  AtLeastOneValidItem: atLeastOneValidItem,
  IntegerOnly: integerOnlyValidation,
  NumberValidationWithRange: numberValidationWithMinMax,
};
