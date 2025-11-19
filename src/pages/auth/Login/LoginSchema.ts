import {  InputValidationRules, type IFields } from '../../../utils/validation';

export const LoginFormSchema: IFields = {
  userName: {
    title: 'userName',
    rule: InputValidationRules.UserNameRequired,
    defaultValue: '',
    placeHolder: 'Enter your username',
    label: 'Username',
    isRequired: true,
  },
  password: {
    title: 'password',
    rule: InputValidationRules.LoginPasswordRequired,
    defaultValue: '',
    placeHolder: 'Enter your password',
    label: 'Password',
    isRequired: true,
  },
};
