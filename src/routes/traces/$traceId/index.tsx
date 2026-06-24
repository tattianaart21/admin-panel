import { TraceDetailsPage } from "@/pages/trace-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traces/$traceId/")({
  component: TraceDetailsPage,
  validateSearch: (search: { limit?: number; offset?: number }) => {
    return search;
  },
});
