import { useMutation, useQuery } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { cleanParams } from "@/shared/lib/http-utils";
import {
  IBlacklistCheckResponse,
  IBlacklistCreate,
  IBlacklistHistoryRequest,
  IBlacklistHistoryResponse,
  IBlacklistOut,
  IBlacklistUpdate,
  IGetBlacklistRequest,
  IGetBlacklistResponse,
} from "./types";

const baseUrl = `${config.basUrl}/blacklist`;

export function useBlacklists(params: IGetBlacklistRequest = {}) {
  return useQuery<IGetBlacklistResponse>({
    queryKey: ["blacklist", JSON.stringify(params)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/?${decodeURIComponent(cleanParams(params).toString())}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      return data;
    },
  });
}

export function useBlacklist(blacklistId: number, includeDeleted = false) {
  return useQuery<IBlacklistOut>({
    queryKey: ["blacklist", blacklistId, includeDeleted],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (includeDeleted) {
        searchParams.set("include_deleted", "true");
      }

      const queryString = searchParams.toString();
      const res = await fetch(`${baseUrl}/${blacklistId}${queryString ? `?${queryString}` : ""}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!blacklistId,
  });
}

export function useCreateBlacklist() {
  return useMutation<IBlacklistOut, Error, IBlacklistCreate>({
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

export function useUpdateBlacklist() {
  return useMutation<IBlacklistOut, Error, { blacklistId: number } & Partial<IBlacklistUpdate>>({
    mutationFn: async ({ blacklistId, ...data }) => {
      const res = await fetch(`${baseUrl}/${blacklistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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

export function useDeleteBlacklist() {
  return useMutation<void, Error, number>({
    mutationFn: async (blacklistId) => {
      const res = await fetch(`${baseUrl}/${blacklistId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
    },
  });
}

export function useCheckBlacklist(url: string) {
  return useQuery<IBlacklistCheckResponse>({
    queryKey: ["blacklist-check", url],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/check?${new URLSearchParams({ url })}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: !!url,
  });
}

export function useRestoreBlacklist() {
  return useMutation<void, Error, number>({
    mutationFn: async (blacklistId) => {
      const res = await fetch(`${baseUrl}/${blacklistId}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blacklist_id: blacklistId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useBlacklistHistory(params: IBlacklistHistoryRequest) {
  return useQuery<IBlacklistHistoryResponse>({
    queryKey: ["blacklist-history", JSON.stringify(params)],
    queryFn: async () => {
      const { blacklist_id, ...rest } = params;
      const res = await fetch(`${baseUrl}/${blacklist_id}/history?${cleanParams(rest)}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}
