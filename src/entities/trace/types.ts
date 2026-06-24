export interface IUserQuerySchema {
  [key: string]: unknown;
  id: string;
  user_id: string | null;
  session_id: string | null;
  chat_id: string | null;
  user_agent: string | null;
  user_query: string | null;
  created_at: string;
  cycle_count: number;
}

export interface IUserQueryHeaderSchema {
  id: string;
  user_id: string | null;
  session_id: string | null;
  chat_id: string | null;
  user_agent: string | null;
  user_query: string | null;
  created_at: string;
}

export interface IUserQueryAgentRowSchema {
  [key: string]: unknown;
  id: string;
  agent_name: string;
  model_name: string;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  precached_prompt_tokens: number | null;
  duration_s: number | null;
  kafka_request_at: string;
  created_at: string;
  status: "success" | "fail" | "browser_fail";
}

export interface IUserQueryAgent {
  id: string;
  user_query_id: string | null;
  agent_name: string;
  model_name: string;
  request_to_model_url: string | null;
  messages_to_model_url: string | null;
  kafka_request_at: string;
  created_at: string;
}

export interface IUserQueryAgentResult {
  id: string;
  user_query_agent_id: string;
  agent_name: string | null;
  model_name: string | null;
  response_from_model_url: string | null;
  kafka_response_at: string | null;
  duration_s: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  precached_prompt_tokens: number | null;
  created_at: string;
}

export interface IMultiact {
  id: string;
  user_query_agent_result_id: string;
  kafka_published_at: string;
  created_at: string;
}

export interface IMultiactActionResult {
  id: string;
  multiact_id: string;
  action_index: number;
  action_name: string;
  long_term_memory: string | null;
  status: string;
  error: string | null;
  website_url: string | null;
  screenshot_uri: string | null;
  source: string;
  kafka_published_at: string;
  created_at: string;
}

export interface IUserQueryAgentDetailSchema {
  user_query_agent: IUserQueryAgent;
  user_query_agent_result: IUserQueryAgentResult | null;
  multiact: IMultiact | null;
  action_results: IMultiactActionResult[];
}

export interface IUserQueryAgentListResponse {
  user_query: IUserQueryHeaderSchema;
  data: IUserQueryAgentRowSchema[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface IGetUserQueriesRequest {
  user_query?: string;
  user_agent?: string;
  from_date?: string;
  end_date?: string;
  session_id?: string;
  chat_id?: string;
  user_id?: string;
  multiact_status?: string;
  source?: string;
  sort_column?: string;
  sort_order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface IGetUserQueriesResponse {
  data: IUserQuerySchema[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
