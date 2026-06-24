export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export type ParamType = "string" | "boolean" | "number";

export interface IParamDefinitionOut {
  id: string;
  param_key: string;
  param_type: ParamType;
  param_value_dict_id: string | null;
  param_value_dict_name: string | null;
  default_value: string | number | boolean | null;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IParamDefinitionListResponse {
  data: IParamDefinitionOut[];
  pagination: PaginationMeta;
}

export interface IParamDefinitionListRequest {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string | null;
  include_deleted?: boolean;
}
