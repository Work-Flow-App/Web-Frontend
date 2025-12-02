import {
  WorkerControllerApi,
  CompanyControllerApi,
  JobControllerApi,
  JobTemplateControllerApi,
  ClientControllerApi,
  AuthControllerApi,
  Configuration,
} from '../../../workflow-api';
import { getApiConfig } from './config';

/**
 * Generic factory function to create configured API service instances
 */
function createControllerService<T>(
  ControllerClass: new (config?: Configuration) => T
): T {
  return new ControllerClass(getApiConfig());
}

/**
 * Auth API factory
 */
export function createAuthApi(): AuthControllerApi {
  return createControllerService(AuthControllerApi);
}

/**
 * Worker API factory
 */
export function createWorkerApi(): WorkerControllerApi {
  return createControllerService(WorkerControllerApi);
}

/**
 * Company API factory
 */
export function createCompanyApi(): CompanyControllerApi {
  return createControllerService(CompanyControllerApi);
}

/**
 * Client API factory
 */
export function createClientApi(): ClientControllerApi {
  return createControllerService(ClientControllerApi);
}

/**
 * Job API factory
 */
export function createJobApi(): JobControllerApi {
  return createControllerService(JobControllerApi);
}

/**
 * Job Template API factory
 */
export function createJobTemplateApi(): JobTemplateControllerApi {
  return createControllerService(JobTemplateControllerApi);
}
