import { BenchmarkComparePage } from "@/pages/benchmark-compare";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/benchmark/compare")({
  component: BenchmarkComparePage,
});
