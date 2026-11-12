export interface ApiMessageResponse {
  message: string;
}

export interface NestApiErrorBody {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
