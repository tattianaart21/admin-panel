import { TraceDemoCyclePage } from "@/pages/trace-demo-cycle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traces/demo/cycles/$cycleId/")({
  component: TraceDemoCyclePage,
  validateSearch: (search: { segment?: string }) => search,
});
