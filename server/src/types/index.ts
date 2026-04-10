export * from './auth';
export * from './application';

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}
