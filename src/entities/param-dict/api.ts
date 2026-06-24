import { useQuery } from "@tanstack/react-query";
import { config } from "@/shared/lib/config";
import { IParamsDictionaryResponse } from "./types";

const baseUrl = `${config.benchUrl}/param-dictionaries`;

export function useParamDictionary(values: string[]) {
  return useQuery<IParamsDictionaryResponse>({
    queryKey: ["params-dict", JSON.stringify(values)],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: values }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      return res.json();
    },
    enabled: values.length > 0,
  });
}
