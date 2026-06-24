export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export type BenchSortField = "id" | "name" | "created_at" | "updated_at";

export interface IBenchListRequest {
  limit?: number;
  offset?: number;
  sort?: BenchSortField;
  order?: "asc" | "desc";
  search?: string | null;
  include_deleted?: boolean;
}

export interface IBenchVersionSummary {
  id: string;
  version: number;
  description: string;
  task_count: number;
  created_at: string;
}

export interface IBenchOut {
  id: string;
  name: string;
  description: string;
  current_version: IBenchVersionSummary | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IBenchListResponse {
  data: IBenchOut[];
  pagination: PaginationMeta;
}

export interface IBenchCreate {
  name: string;
  description?: string;
}

export interface IBenchUpdate {
  name?: string | null;
  description?: string | null;
}

export interface IBenchTaskIn {
  task_id: string;
  web_name: string;
  ques: string;
  web?: string;
}

export interface IBenchTaskOut {
  id: string;
  task_id: string;
  web_name: string;
  ques: string;
  web: string | null;
  disabled?: boolean;
  extras?: Record<string, unknown> | null;
  position?: number;
}

export interface IBenchTaskListResponse {
  data: IBenchTaskOut[];
  pagination: PaginationMeta;
}

export interface IBenchVersionCreate {
  description?: string;
  based_on_version?: number | null;
  tasks: IBenchTaskIn[];
}

export interface IBenchVersionOut {
  id: string;
  bench_id: string;
  version: number;
  description: string;
  task_count: number;
  created_at: string;
}

export interface IBenchVersionDetail {
  id: string;
  bench_id: string;
  version: number;
  description: string;
  task_count: number;
  created_at: string;
  tasks: IBenchTaskOut[];
}

export interface IBenchVersionListResponse {
  data: IBenchVersionOut[];
  pagination: PaginationMeta;
}

export interface IBenchTaskCreateRequest {
  web_name: string;
  ques: string;
  web: string;
  attach_to_version_id: string;
}

export interface IBenchTaskUnlinkRequest {
  bench_id: string;
  version: number;
  task_uuid: string;
}
