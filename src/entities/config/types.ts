export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export type ConfigSortField = "id" | "name" | "created_at" | "updated_at";

export interface IConfigListRequest {
  limit?: number;
  offset?: number;
  sort?: ConfigSortField;
  order?: "asc" | "desc";
  search?: string | null;
  include_deleted?: boolean;
  created_at_from?: string;
  created_at_to?: string;
}

export interface IConfigVersionSummary {
  id: string;
  version: number;
  description: string;
  created_at: string;
}

export interface IConfigOut {
  id: string;
  name: string;
  description: string;
  active_version: IConfigVersionOut | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IConfigListResponse {
  data: IConfigOut[];
  pagination: PaginationMeta;
}

export interface IConfigCreate {
  name: string;
  description?: string;
}

export interface IConfigUpdate {
  name?: string | null;
  description?: string | null;
}

export interface IConfigParams {
  param_key: string;
  param_type: "boolean" | "number" | "string";
  param_value_dict: string | null;
  default_value: boolean | number | string | null;
  value: boolean | number | string | null | undefined;
}

export interface IConfigVersionOut {
  id: string;
  config_id: string;
  version: number;
  description: string;
  created_at: string;
  params: IConfigParams[];
}

export interface IConfigVersionCreate {
  description?: string;
  payload: Record<string, unknown>;
}

export interface IConfigVersionListResponse {
  data: IConfigVersionOut[];
  pagination: PaginationMeta;
}
