import { IGetBlacklistRequest } from "@/entities/blacklist";
import { BlacklistsPage } from "@/pages/blacklists";
import { TCommonSearchParams } from "@/pages/types";
import { createFileRoute, SearchSchemaInput } from "@tanstack/react-router";

export const Route = createFileRoute("/blacklist/")({
  component: BlacklistsPage,
  validateSearch(
    search: Omit<IGetBlacklistRequest, "created_at_to" | "created_at_from"> &
      TCommonSearchParams &
      SearchSchemaInput,
  ) {
    return search;
  },
});
