import { BenchmarkDetailsPage } from "@/pages/benchmark-details";
import { createFileRoute } from "@tanstack/react-router";

type SearchProps = {
  limit?: number;
  offset?: number;
  version?: number;
};

export const Route = createFileRoute("/benchmark/$benchmarkId")({
  component: BenchmarkDetailsPage,
  validateSearch(search: SearchProps) {
    return search;
  },
});
