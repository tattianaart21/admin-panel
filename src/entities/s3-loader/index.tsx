import { config } from "@/shared/lib/config";
import { useQuery } from "@tanstack/react-query";
const baseUrl = `${config.tracesUrl}/s3/file`;

export function useS3Loader(filePath?: string | null) {
  return useQuery({
    queryKey: ["s3", filePath],
    queryFn: async () => {
      if (!filePath) {
        return;
      }
      const res = await fetch(`${baseUrl}/${filePath}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }

      const data = await res.text();

      return data;
    },
    enabled: !!filePath,
  });
}
