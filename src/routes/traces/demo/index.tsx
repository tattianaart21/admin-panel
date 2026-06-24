import { TraceDemoPage } from "@/pages/trace-demo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traces/demo/")({
  component: TraceDemoPage,
  validateSearch: (search: { tab?: "overview" | "performance" }) => search,
});
