import { IConfigListRequest } from "@/entities/config";
import { ConfigsPage } from "@/pages/configs";
import { TCommonSearchParams } from "@/pages/types";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";

export const Route = createFileRoute("/configs/")({
  component: ConfigsPage,
  validateSearch(
    search: Omit<IConfigListRequest, "created_at_to" | "created_at_from"> &
      TCommonSearchParams &
      SearchSchemaInput,
  ) {
    return search;
  },
});
