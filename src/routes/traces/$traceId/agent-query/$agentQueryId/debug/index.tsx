import { createFileRoute } from "@tanstack/react-router";
import { TraceDebugPage } from "@/pages/trace-debug";

export const Route = createFileRoute(
  "/traces/$traceId/agent-query/$agentQueryId/debug/",
)({
  component: TraceDebugPage,
  validateSearch: (search: { messages_to_model_url?: string; model_name?: string }) => search,
});
