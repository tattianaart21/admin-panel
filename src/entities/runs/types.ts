export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export type RunSortField = "id" | "created_at" | "submitted_at" | "finished_at" | "status";

export type RunStatus = "pending" | "submitted" | "running" | "succeeded" | "failed" | "cancelled";

export interface IRunListRequest {
  limit?: number;
  offset?: number;
  sort?: RunSortField;
  order?: "asc" | "desc";
  status?: RunStatus | null;
  bench_id?: string | null;
  config_id?: string | null;
  created_from?: string | null;
  created_to?: string | null;
}

export interface IRunOut {
  [key: string]: unknown;
  id: string;
  bench_version_id: string;
  bench_id: string;
  bench_name: string;
  version: number;
  config_version_id: string;
  config_overrides: Record<string, unknown> | null;
  effective_config: {
    param_key: string;
    param_type: "boolean" | "number" | "string";
    param_value_dict: string | null;
    default_value: boolean | number | string | null;
    value: boolean | number | string | null | undefined;
  }[];
  max_concurrent: number | null;
  status: RunStatus;
  status_message: string | null;
  k8s_job_name: string | null;
  k8s_namespace: string | null;
  trace_run_id: string;
  trace_url: string | null;
  created_at: string;
  submitted_at: string | null;
  finished_at: string | null;
}

export interface IRunListResponse {
  data: IRunOut[];
  pagination: PaginationMeta;
}

export interface IRunCreate {
  bench_version_id: string;
  config_version_id: string;
  config_overrides?: Record<string, unknown> | null;
  max_concurrent?: number | null;
  task_uuids: null | string[];
}

export interface IBenchTaskRun {
  [key: string]: unknown;
  id: string;
  run_id: string;
  session_id: string;
  chat_id: string;
  task_id: string;
  task_web_name: string;
  task_ques: string;
  task_web: string;
  start_time: string;
  finish_time: string;
  duration_seconds: number;
  numb_steps: number;
  success: boolean;
  final_answer: string;
  judge_llm_result: string;
  created_at: string;
  gif_url: string;
  history_json_url: string;
}

export interface IBenchTaskRunListResponse {
  data: IBenchTaskRun[];
  pagination: PaginationMeta;
}

export interface IBenchRunSummary {
  bench_id: string;
  total: number;
  passed: number;
  failed: number;
  unknown: string;
  success_rate_percent: string;
}
