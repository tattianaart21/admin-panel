import { ConfigDetailsPage } from "@/pages/config-details";
import { createFileRoute } from "@tanstack/react-router";

type SearchProps = {
  limit?: number;
  offset?: number;
  version?: number;
};

export const Route = createFileRoute("/configs/$configId")({
  component: ConfigDetailsPage,
  validateSearch(search: SearchProps) {
    return search;
  },
});
