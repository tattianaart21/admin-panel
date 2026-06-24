import { PromptsDetails } from "@/pages/prompts-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/prompts/$promptId")({
  component: PromptsDetails,
});
