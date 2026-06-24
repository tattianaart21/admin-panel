import { config } from "@/shared/lib/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICallParams } from "./types";

const baseUrl = `${config.tracesUrl}/ai_models`;

export function useLLMList() {
  return useQuery({
    queryKey: ["llmList"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/hf/available_models`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
  });
}

export function useCallModel() {
  return useMutation({
    mutationFn: async (params: ICallParams) => {
      const res = await fetch(`${baseUrl}/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.text();
    },
  });
}
