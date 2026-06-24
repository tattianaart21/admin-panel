type CommonFields = {
  author?: string;
};

export interface IGetBlacklistRequest extends CommonFields {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
  created_at_from?: string;
  created_at_to?: string;
  include_deleted?: boolean;
  search?: string;
}

type Pagination = {
  total: number;
  limit: number;
  offset: number;
};

export interface IGetBlacklistResponse {
  data: IBlacklistOut[];
  pagination: Pagination;
}

export interface IBlacklistOut {
  [key: string]: unknown;
  id: number;
  name: string;
  url: string;
  description: string;
  author: string;
  created_at: string;
  deleted_at?: string;
}

export interface IBlacklistCreate {
  name: string;
  url: string;
  description: string;
  author: string;
}

export interface IBlacklistUpdate {
  name?: string;
  url?: string;
  description?: string;
  author?: string;
}

export interface IBlacklistCheckResponse {
  url: string;
  is_blacklisted: boolean;
}

export interface IBlackListHistory extends IBlacklistOut {
  update_author: string;
  updated_at: string;
  history_id: number;
}

export interface IBlacklistHistoryRequest {
  blacklist_id: number;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface IBlacklistHistoryResponse {
  data: IBlackListHistory[];
  pagination: Pagination;
}
