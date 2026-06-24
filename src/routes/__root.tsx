import { createRootRoute, SearchSchemaInput } from "@tanstack/react-router";
import { RootLayout } from "@/pages/root-layout";
import { TCommonSearchParams } from "@/pages/types";

export const Route = createRootRoute({
  component: RootLayout,
  validateSearch(search: TCommonSearchParams & SearchSchemaInput) {
    return search;
  },
});
