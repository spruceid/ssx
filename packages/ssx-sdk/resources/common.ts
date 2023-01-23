export interface ResourceResult {
  success: boolean;
  data?: any;
  error?: any;
  message?: string;
}

export interface ResourceError {
  type: string;
  message: string;
  data?: any;
}
