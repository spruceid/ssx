export interface ResourceError {
  type: string;
  message: string;
  data?: any;
}

export interface ResourceResult {
  success: boolean;
  data?: any;
  error?: ResourceError;
  message?: string;
}
