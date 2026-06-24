import { useMemo } from "react";
import { useRun, useRunSummary } from "@/entities/runs";
import { formatDate, getDuration } from "@/shared/lib/format-date";

type ComparisonRow = {
  key: string;
  label: string;
  runA: string;
  runB: string;
};

function useRunComparisonData(runId: string | null) {
  const runQuery = useRun(runId ?? "");
  const summaryQuery = useRunSummary(runQuery.data?.trace_run_id ?? "");

  return {
    run: runQuery.data ?? null,
    summary: summaryQuery.data ?? null,
    isLoading: runQuery.isLoading || summaryQuery.isLoading,
    error: runQuery.isError || summaryQuery.isError,
  };
}

export function useBenchmarkComparison(runAId: string | null, runBId: string | null) {
  const dataA = useRunComparisonData(runAId);
  const dataB = useRunComparisonData(runBId);

  const rows = useMemo<ComparisonRow[]>(() => {
    const labels: Record<string, { label: string; extract: (d: typeof dataA) => string }> = {
      runId: {
        label: "ID запуска",
        extract: (d) => d.run?.id ?? "-",
      },
      benchName: {
        label: "Наименование бенчмарка и версия",
        extract: (d) => (d.run ? `${d.run.bench_name} (v${d.run.version})` : "-"),
      },
      totalTasks: {
        label: "Всего задач",
        extract: (d) => (d.summary?.total ?? "-").toString(),
      },
      totalSuccess: {
        label: "Успешно",
        extract: (d) => (d.summary?.passed ?? "-").toString(),
      },
      totalFailed: {
        label: "Провалено",
        extract: (d) => (d.summary?.failed ?? "-").toString(),
      },
      startTime: {
        label: "Время начала",
        extract: (d) => (d.run?.created_at ? formatDate(d.run?.created_at) : "-"),
      },
      finishTime: {
        label: "Время завершения",
        extract: (d) => (d.run?.finished_at ? formatDate(d.run?.finished_at) : "-"),
      },
      duration: {
        label: "Длительность (с)",
        extract: (d) => {
          const dur = getDuration(d.run?.created_at, d.run?.finished_at);
          if (!dur || dur <= 0) return "-";
          return (dur / 1000).toFixed(1);
        },
      },
    };

    return Object.entries(labels).map(([key, { label, extract }]) => ({
      key,
      label,
      runA: extract(dataA),
      runB: extract(dataB),
    }));
  }, [dataA, dataB]);

  const isLoading = dataA.isLoading || dataB.isLoading;

  return {
    rows,
    isLoading,
  };
}
