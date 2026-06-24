import { AgentQueryDetailsPage } from "@/pages/agent-query-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traces/$traceId/agent-query/$agentQueryId/")({
  component: AgentQueryDetailsPage,
  validateSearch: (search: { traceId?: string }) => search,
});
