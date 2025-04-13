// common.interface.ts

export interface ICategory {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICategoryCreate {
  name: string;
}

export interface ICategoryUpdate {
  name?: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface IFileUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

export interface ISearchQuery {
  query: string;
  searchFields: string[];
}
