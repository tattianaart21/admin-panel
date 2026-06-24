import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import type {
  IConfigCreate,
  IConfigListRequest,
  IConfigListResponse,
  IConfigOut,
  IConfigUpdate,
  IConfigVersionCreate,
  IConfigVersionListResponse,
  IConfigVersionOut,
} from "./types";

const baseUrl = `${config.benchUrl}/configs`;

export function useConfigList(params: IConfigListRequest = {}) {
  return useQuery<IConfigListResponse>({
    queryKey: ["configs", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useConfig(configId: string) {
  return useQuery<IConfigOut>({
    queryKey: ["config", configId],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${configId}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!configId,
  });
}

export function useCreateConfig() {
  const queryClient = useQueryClient();

  return useMutation<IConfigOut, Error, IConfigCreate>({
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
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
  });
}

export function useUpdateConfig() {
  const queryClient = useQueryClient();

  return useMutation<IConfigOut, Error, { configId: string } & IConfigUpdate>({
    mutationFn: async ({ configId, ...data }) => {
      const res = await fetch(`${baseUrl}/${configId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
  });
}

export function useDeleteConfig() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (configId) => {
      const res = await fetch(`${baseUrl}/${configId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configs"] });
    },
  });
}

export function useConfigVersions(configId: string, params?: { limit?: number; offset?: number }) {
  return useQuery<IConfigVersionListResponse>({
    queryKey: ["configVersions", configId, JSON.stringify(params)],
    queryFn: async () => {
      const query = params ? `?${decodeURIComponent(cleanParams(params).toString())}` : "";
      const res = await fetch(`${baseUrl}/${configId}/versions${query}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!configId,
  });
}

export function useConfigVersion(configId?: string, version?: number) {
  return useQuery<IConfigVersionOut>({
    queryKey: ["configVersion", configId, version],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${configId}/versions/${version}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!configId && !!version,
  });
}

export function useCreateConfigVersion() {
  const queryClient = useQueryClient();

  return useMutation<IConfigVersionOut, Error, { configId: string } & IConfigVersionCreate>({
    mutationFn: async ({ configId, ...data }) => {
      const res = await fetch(`${baseUrl}/${configId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: (_data, { configId }) => {
      queryClient.invalidateQueries({ queryKey: ["configVersions", configId] });
    },
  });
}

export function useActivateConfigVersion() {
  const queryClient = useQueryClient();

  return useMutation<IConfigOut, Error, { configId: string; version: number }>({
    mutationFn: async ({ configId, version }) => {
      const res = await fetch(`${baseUrl}/${configId}/versions/${version}/activate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    onSuccess: (_data, { configId }) => {
      queryClient.invalidateQueries({ queryKey: ["configs"] });
      queryClient.invalidateQueries({ queryKey: ["config", configId] });
    },
  });
}
