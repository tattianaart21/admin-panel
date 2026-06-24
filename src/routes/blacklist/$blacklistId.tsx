import { BlacklistDetailsPage } from "@/pages/blacklist-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blacklist/$blacklistId")({
  component: BlacklistDetailsPage,
  validateSearch: (search) => {
    return search;
  },
});
