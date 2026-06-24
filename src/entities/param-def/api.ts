import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import type {
  IParamDefinitionListRequest,
  IParamDefinitionListResponse,
  IParamDefinitionOut,
} from "./types";

const baseUrl = `${config.benchUrl}/param-definitions`;

const INFINITE_LIMIT = 20;

export function useParamDefinitionList(params: IParamDefinitionListRequest = {}) {
  return useQuery<IParamDefinitionListResponse>({
    queryKey: ["param-definitions", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useInfiniteParamDefinitionList(search?: string) {
  return useInfiniteQuery<IParamDefinitionListResponse>({
    queryKey: ["param-definitions", "infinite", search],
    queryFn: async ({ pageParam }) => {
      const params: IParamDefinitionListRequest = {
        limit: INFINITE_LIMIT,
        offset: pageParam as number,
        sort: "param_key",
        order: "asc",
        ...(search ? { search } : {}),
      };
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { offset, limit, total } = lastPage.pagination;
      const next = offset + limit;
      return next < total ? next : undefined;
    },
  });
}

export function useParamDefinition(paramId?: string) {
  return useQuery<IParamDefinitionOut>({
    queryKey: ["param-definition", paramId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${paramId}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!paramId,
  });
}
