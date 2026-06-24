import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import type {
  IBenchCreate,
  IBenchListRequest,
  IBenchListResponse,
  IBenchOut,
  IBenchTaskCreateRequest,
  IBenchTaskListResponse,
  IBenchTaskUnlinkRequest,
  IBenchUpdate,
  IBenchVersionCreate,
  IBenchVersionDetail,
  IBenchVersionListResponse,
} from "./types";

const baseUrl = `${config.benchUrl}/benches`;
const tasksBaseUrl = `${config.benchUrl}/tasks/`;

export function useBenchList(params: IBenchListRequest = {}) {
  return useQuery<IBenchListResponse>({
    queryKey: ["benches", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useBench(benchId: string) {
  return useQuery<IBenchOut>({
    queryKey: ["bench", benchId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${benchId}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!benchId,
  });
}

export function useCreateBench() {
  const queryClient = useQueryClient();

  return useMutation<IBenchOut, Error, IBenchCreate>({
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
      queryClient.invalidateQueries({ queryKey: ["benches"] });
    },
  });
}

export function useUpdateBench() {
  const queryClient = useQueryClient();

  return useMutation<IBenchOut, Error, { benchId: string } & IBenchUpdate>({
    mutationFn: async ({ benchId, ...data }) => {
      const res = await fetch(`${baseUrl}/${benchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benches"] });
    },
  });
}

export function useDeleteBench() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (benchId) => {
      const res = await fetch(`${baseUrl}/${benchId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benches"] });
    },
  });
}

export function useBenchVersions(benchId: string, params?: { limit?: number; offset?: number }) {
  return useQuery<IBenchVersionListResponse>({
    queryKey: ["benchVersions", benchId, JSON.stringify(params)],
    queryFn: async () => {
      const query = params ? `?${decodeURIComponent(cleanParams(params).toString())}` : "";
      const res = await fetch(`${baseUrl}/${benchId}/versions${query}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!benchId,
  });
}

export function useBenchVersion(benchId: string, version?: number | null) {
  return useQuery<IBenchVersionDetail>({
    queryKey: ["benchVersion", benchId, version],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${benchId}/versions/${version}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!benchId && !!version,
  });
}

export function useCreateBenchVersion() {
  const queryClient = useQueryClient();

  return useMutation<IBenchVersionDetail, Error, { benchId: string } & IBenchVersionCreate>({
    mutationFn: async ({ benchId, ...data }) => {
      const res = await fetch(`${baseUrl}/${benchId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: (_data, { benchId }) => {
      queryClient.invalidateQueries({ queryKey: ["benchVersions", benchId] });
    },
  });
}

export function useActivateBenchVersion() {
  const queryClient = useQueryClient();

  return useMutation<IBenchOut, Error, { benchId: string; version: string }>({
    mutationFn: async ({ benchId, version }) => {
      const res = await fetch(`${baseUrl}/${benchId}/versions/${version}/activate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: (_data, { benchId }) => {
      queryClient.invalidateQueries({ queryKey: ["benches"] });
      queryClient.invalidateQueries({ queryKey: ["bench", benchId] });
    },
  });
}

export function useBenchVersionTasks(params: {
  benchId: string;
  version?: number;
  limit?: number;
  offset?: number;
  search?: string | null;
}) {
  const { benchId, version } = params;
  return useQuery<IBenchTaskListResponse>({
    queryKey: ["benchTasks", benchId, version, JSON.stringify(params)],
    queryFn: async () => {
      const query = params ? `?${decodeURIComponent(cleanParams(params).toString())}` : "";
      const res = await fetch(`${baseUrl}/${benchId}/versions/${version}/tasks${query}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!benchId && !!version,
  });
}

export function useCreateBenchVersionTask() {
  return useMutation({
    mutationFn: async (data: IBenchTaskCreateRequest) => {
      const res = await fetch(`${tasksBaseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useUnlinkTask() {
  return useMutation({
    mutationFn: async ({ bench_id, version, task_uuid }: IBenchTaskUnlinkRequest) => {
      const res = await fetch(`${baseUrl}/${bench_id}/versions/${version}/tasks/${task_uuid}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}
