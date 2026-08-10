import type { AxiosResponse } from 'axios';
import { CompanyFormsApi, WorkerFormsApi, Configuration, FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../workflow-api';
import type {
  FormTemplateRequest,
  FormFieldDto,
  FormFieldValueDto,
  FormFieldValueResponse,
  FormSubmissionCreateRequest,
  FormSubmissionResponse,
  FormAttachmentResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum };
export type {
  FormTemplateRequest,
  FormFieldDto,
  FormFieldValueDto,
  FormFieldValueResponse,
  FormSubmissionCreateRequest,
  FormSubmissionResponse,
  FormAttachmentResponse,
};

export const FORM_FIELD_TYPE_OPTIONS: { value: FormFieldDtoTypeEnum; label: string }[] = [
  { value: FormFieldDtoTypeEnum.Text, label: 'Text' },
  { value: FormFieldDtoTypeEnum.TextArea, label: 'Text Area' },
  { value: FormFieldDtoTypeEnum.Date, label: 'Date' },
  { value: FormFieldDtoTypeEnum.Checkbox, label: 'Checkbox' },
  { value: FormFieldDtoTypeEnum.Dropdown, label: 'Dropdown' },
  { value: FormFieldDtoTypeEnum.MultiSelect, label: 'Multi Select' },
  { value: FormFieldDtoTypeEnum.Boolean, label: 'Yes / No' },
  { value: FormFieldDtoTypeEnum.File, label: 'File Upload' },
];

export const FORM_FIELD_ROLE_TARGET_OPTIONS: { value: FormFieldDtoRoleTargetEnum; label: string }[] = [
  { value: FormFieldDtoRoleTargetEnum.Company, label: 'Filled by Company' },
  { value: FormFieldDtoRoleTargetEnum.Worker, label: 'Filled by Worker' },
  { value: FormFieldDtoRoleTargetEnum.Both, label: 'Filled by Either' },
];

// Field types whose options are a comma-separated list of choices
export const FORM_FIELD_TYPES_WITH_OPTIONS: FormFieldDtoTypeEnum[] = [
  FormFieldDtoTypeEnum.Dropdown,
  FormFieldDtoTypeEnum.MultiSelect,
];

function getCompanyFormApi(): CompanyFormsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new CompanyFormsApi(config, env.apiBaseUrl, axiosInstance);
}

function getWorkerFormApi(): WorkerFormsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerFormsApi(config, env.apiBaseUrl, axiosInstance);
}

/**
 * PDF export isn't a plain linkable URL - it needs the bearer auth header, so it has to be
 * fetched as a blob through axios rather than opened with a plain <a href>. This triggers the
 * browser's normal "Save As" flow for that blob.
 */
export const triggerBlobDownload = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const formService = {
  /**
   * Company: form templates
   */
  async getAllTemplates(): Promise<AxiosResponse<FormTemplateRequest[]>> {
    return await getCompanyFormApi().companyFormGetAllTemplates();
  },

  async createTemplate(data: FormTemplateRequest) {
    return await getCompanyFormApi().companyFormCreateTemplate(data);
  },

  async updateTemplate(id: number, data: FormTemplateRequest) {
    return await getCompanyFormApi().companyFormUpdateTemplate(id, data);
  },

  async deleteTemplate(id: number) {
    return await getCompanyFormApi().companyFormDeleteTemplate(id);
  },

  /**
   * Company: form submissions
   */
  async getAllSubmissions(): Promise<AxiosResponse<FormSubmissionResponse[]>> {
    return await getCompanyFormApi().companyFormGetAllSubmissions();
  },

  async createDraft(data: FormSubmissionCreateRequest) {
    return await getCompanyFormApi().companyFormCreateDraft(data);
  },

  async updateValues(id: number, values: FormFieldValueDto[]) {
    return await getCompanyFormApi().companyFormUpdateValues(id, values);
  },

  async uploadFile(id: number, fieldId: number, file: File) {
    return await getCompanyFormApi().companyFormUploadFile(id, fieldId, file);
  },

  async sendToWorker(id: number, workerId: number) {
    return await getCompanyFormApi().companyFormSendToWorker(id, workerId);
  },

  async deleteSubmission(id: number) {
    return await getCompanyFormApi().companyFormDeleteSubmission(id);
  },

  async getAttachments(id: number): Promise<AxiosResponse<FormAttachmentResponse[]>> {
    return await getCompanyFormApi().companyFormGetAttachments(id);
  },

  async downloadPdf(id: number, fileName = `form-${id}.pdf`) {
    const response = await getCompanyFormApi().companyFormDownloadPdf(id, { responseType: 'blob' });
    triggerBlobDownload(response.data as unknown as Blob, fileName);
  },

  /**
   * Worker self-service
   */
  async getMyForms(): Promise<AxiosResponse<FormSubmissionResponse[]>> {
    return await getWorkerFormApi().workerFormGetMyForms();
  },

  async fillValues(id: number, values: FormFieldValueDto[]) {
    return await getWorkerFormApi().workerFormFillValues(id, values);
  },

  async submitForm(id: number) {
    return await getWorkerFormApi().workerFormSubmitForm(id);
  },

  async uploadMyFile(id: number, fieldId: number, file: File) {
    return await getWorkerFormApi().workerFormUploadFile(id, fieldId, file);
  },

  async getMyAttachments(id: number): Promise<AxiosResponse<FormAttachmentResponse[]>> {
    return await getWorkerFormApi().workerFormGetAttachments(id);
  },

  async downloadMyPdf(id: number, fileName = `form-${id}.pdf`) {
    const response = await getWorkerFormApi().workerFormDownloadPdf(id, { responseType: 'blob' });
    triggerBlobDownload(response.data as unknown as Blob, fileName);
  },
};

export default formService;
