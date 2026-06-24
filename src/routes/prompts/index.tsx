import { IGetPromptsRequest } from "@/entities/prompt";
import { PromptsPage } from "@/pages/prompts";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";

export const Route = createFileRoute("/prompts/")({
  component: PromptsPage,
  validateSearch(search: IGetPromptsRequest & SearchSchemaInput) {
    return search;
  },
});
