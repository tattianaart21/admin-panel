import { useQuery } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import {
  IGetUserQueriesRequest,
  IGetUserQueriesResponse,
  IUserQueryAgentListResponse,
  IUserQueryAgentDetailSchema,
} from "./types";

const baseUrl = `${config.tracesUrl}/user_query`;

export function useUserQueries(params: IGetUserQueriesRequest = {}) {
  return useQuery<IGetUserQueriesResponse>({
    queryKey: ["userQueries", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useUserQueryAgents(
  queryId: string,
  params: {
    limit?: number;
    offset?: number;
    agent_name?: string;
    model_name?: string;
    status?: string;
  } = {},
) {
  return useQuery<IUserQueryAgentListResponse>({
    queryKey: ["userQueryAgents", queryId, JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/${queryId}?${decodeURIComponent(cleanParams(params).toString())}`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!queryId,
  });
}

const agentBaseUrl = `${config.tracesUrl}/user_query_agent`;

export function useUserQueryAgent(agentId: string) {
  return useQuery<IUserQueryAgentDetailSchema>({
    queryKey: ["userQueryAgent", agentId],
    queryFn: async () => {
      const res = await fetch(`${agentBaseUrl}/${agentId}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!agentId,
  });
}
