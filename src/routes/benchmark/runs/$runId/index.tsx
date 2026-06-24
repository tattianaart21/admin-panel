import { RunDetailsPage } from "@/pages/run-details";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";

export const Route = createFileRoute("/benchmark/runs/$runId/")({
  component: RunDetailsPage,
  validateSearch(search: { limit?: number; offset?: number } & SearchSchemaInput) {
    return search;
  },
});
