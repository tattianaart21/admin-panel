import { useMutation, useQuery } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import {
  ICreatePromptRequest,
  ICreatePromptVersionRequest,
  IGetPromptsRequest,
  IUpdatePromptKeyRequest,
  IPromptOut,
  IPromptVersionOut,
  IPromptOutList,
  IPromptVersionsListResponse,
} from "./types";
import { cleanParams } from "@/shared/lib/http-utils";

const baseUrl = `${config.basUrl}/prompts`;

export function usePrompts(params: IGetPromptsRequest = {}) {
  return useQuery<IPromptOutList>({
    queryKey: ["prompts", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function usePromptKey(key: string) {
  return useQuery<IPromptOut>({
    queryKey: ["promptKey", key],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!key,
  });
}

export function useActivePrompt(key: string) {
  return useQuery<IPromptOut>({
    queryKey: ["activePrompt", key],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/active`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!key,
  });
}

export function usePromptVersions(key?: string) {
  return useQuery<IPromptVersionsListResponse>({
    queryKey: ["promptVersions", key],
    queryFn: async () => {
      if (!key) {
        return;
      }
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/versions`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!key,
  });
}

export function usePromptVersion(key: string, version: number) {
  return useQuery<IPromptVersionOut>({
    queryKey: ["promptVersion", key, version],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/versions/${version}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!key && version !== undefined,
  });
}

export function useCreatePrompt() {
  return useMutation<IPromptOut, Error, ICreatePromptRequest>({
    mutationFn: async (data) => {
      const res = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useCreatePromptVersion(key: string) {
  return useMutation<IPromptVersionOut, Error, ICreatePromptVersionRequest>({
    mutationFn: async (data) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}`, {
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

export function useUpdatePromptKey() {
  return useMutation<IPromptOut, Error, IUpdatePromptKeyRequest>({
    mutationFn: async ({ key, ...data }) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}`, {
        method: "PATCH",
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

export function useDeletePromptKey() {
  return useMutation<Record<string, string>, Error, string>({
    mutationFn: async (key: string) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useDeletePromptVersion() {
  return useMutation<Record<string, string>, Error, { key: string; version: number }>({
    mutationFn: async ({ key, version }) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/versions/${version}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useRollbackVersion() {
  return useMutation<IPromptOut, Error, { key: string; version: number }>({
    mutationFn: async ({ key, version }) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/rollback/${version}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useUseLatestVersion(key: string) {
  return useMutation<IPromptOut, Error, void>({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/use-latest`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useRestoreKey() {
  return useMutation({
    mutationFn: async ({ key }: { key: string }) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/restore`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useRestoreVersion() {
  return useMutation({
    mutationFn: async ({ key, version }: { key: string; version: number }) => {
      const res = await fetch(`${baseUrl}/${encodeURIComponent(key)}/versions/${version}/restore`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}
