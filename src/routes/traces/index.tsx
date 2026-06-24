import { IGetUserQueriesRequest } from "@/entities/trace";
import { TracesPage } from "@/pages/traces";
import { TCommonSearchParams } from "@/pages/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/traces/")({
  component: TracesPage,
  validateSearch(search: IGetUserQueriesRequest & TCommonSearchParams & { order?: string }) {
    return search;
  },
});
