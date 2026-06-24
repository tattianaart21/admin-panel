import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import type {
  IBenchRunSummary,
  IBenchTaskRunListResponse,
  IRunCreate,
  IRunListRequest,
  IRunListResponse,
  IRunOut,
} from "./types";

const baseUrl = `${config.benchUrl}/runs`;

export function useRunList(params: IRunListRequest = {}) {
  return useQuery<IRunListResponse>({
    queryKey: ["runs", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

const INFINITE_LIMIT = 10;

export function useInfiniteRunList() {
  return useInfiniteQuery<IRunListResponse>({
    queryKey: ["runs", "infinite"],
    queryFn: async ({ pageParam }) => {
      const params = {
        limit: INFINITE_LIMIT,
        offset: pageParam as number,
        sort: "created_at" as const,
        order: "desc" as const,
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

export function useRun(runId: string) {
  return useQuery<IRunOut>({
    queryKey: ["run", runId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${runId}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!runId,
  });
}

export function useRunBenchTasks(
  traceRunId: string,
  params: { limit?: number; offset?: number } = {},
) {
  return useQuery<IBenchTaskRunListResponse>({
    queryKey: ["runBenchTasks", traceRunId, JSON.stringify(params)],
    queryFn: async () => {
      const url = new URL(`${config.tracesUrl}/bench_task/${traceRunId}`);
      if (params.limit != null) url.searchParams.set("limit", String(params.limit));
      if (params.offset != null) url.searchParams.set("offset", String(params.offset));
      const res = await fetch(url.toString());

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!traceRunId,
  });
}

export function useCreateRun() {
  const queryClient = useQueryClient();

  return useMutation<IRunOut, Error, IRunCreate>({
    mutationFn: async (data) => {
      const res = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}

export function useCancelRun() {
  const queryClient = useQueryClient();

  return useMutation<IRunOut, Error, string>({
    mutationFn: async (runId) => {
      const res = await fetch(`${baseUrl}/${runId}/cancel`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}

export function useRunSummary(traceRunId: string) {
  return useQuery<IBenchRunSummary>({
    queryKey: ["runSummary", traceRunId],
    queryFn: async () => {
      const res = await fetch(`${config.tracesUrl}/bench/${traceRunId}/summary`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!traceRunId,
  });
}
