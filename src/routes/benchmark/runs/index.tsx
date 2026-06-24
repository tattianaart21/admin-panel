import { RunsPage } from "@/pages/runs";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";
import { IRunListRequest } from "@/entities/runs";
import { TCommonSearchParams } from "@/pages/types";

export const Route = createFileRoute("/benchmark/runs/")({
  component: RunsPage,
  validateSearch(search: IRunListRequest & TCommonSearchParams & SearchSchemaInput) {
    return search;
  },
});
