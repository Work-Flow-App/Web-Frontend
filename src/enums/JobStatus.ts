import { JobCreateRequestStatusEnum } from "../../workflow-api";


export const JOB_STATUS_OPTIONS = [
  { label: 'New', value: JobCreateRequestStatusEnum.New },
    { label: 'Pending', value: JobCreateRequestStatusEnum.Pending },
    { label: 'In Progress', value: JobCreateRequestStatusEnum.InProgress },
    { label: 'Completed', value: JobCreateRequestStatusEnum.Completed },
    { label: 'Cancelled', value: JobCreateRequestStatusEnum.Cancelled },
];
