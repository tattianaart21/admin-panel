export interface IGetPromptsRequest {
  limit?: number;
  offset?: number;
  order?: "asc" | "desc";
  sort?: keyof IPromptOut;
  search?: string;
  include_deleted?: boolean;
  created_at_from?: string;
  created_at_to?: string;
}

export interface ICreatePromptRequest {
  key: string;
  description: string;
  system?: boolean;
  negative?: boolean;
}

export interface ICreatePromptVersionRequest {
  content: string;
  author?: string | null;
  meta?: Record<string, unknown> | null;
  parent_version_id?: number | null;
}

export interface IUpdatePromptKeyRequest {
  system?: boolean;
  negative?: boolean;
  key: string;
}

export interface IPromptVersionOut {
  id: number;
  key_id: number;
  version: number;
  content: string;
  author: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  parent_version_id: number | null;
  deleted_at: string | null;
}

export interface IPromptOut {
  id: number;
  key: string;
  description: string;
  current: IPromptVersionOut | null;
  system: boolean;
  negative: boolean;
  deleted_at: string | null;
}

export interface IPromptOutList {
  data: IPromptOut[];
  pagination: Pagination;
}

export interface IPromptVersionsList {
  key: string;
  versions: IPromptVersionOut[];
}

export interface IPromptVersionsListResponse {
  data: IPromptVersionOut[];
  pagination: Pagination;
}

type Pagination = {
  total: number;
  limit: number;
  offset: number;
};
