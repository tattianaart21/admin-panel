import { useRun, useRunBenchTasks } from "@/entities/runs";
import { useMemo } from "react";

export function useRunDetailsData({
  runId,
  limit,
  offset,
}: {
  runId: string;
  limit: number;
  offset: number;
}) {
  const { data: run, isLoading: isRunLoading, isError } = useRun(runId);

  const traceRunId = useMemo(() => {
    if (!run) return "";
    return run.trace_run_id;
  }, [run]);

  const tasksQuery = useRunBenchTasks(traceRunId, { limit, offset });

  return {
    run: {
      data: run ?? undefined,
      isLoading: isRunLoading,
      isError,
    },
    tasks: {
      data: tasksQuery.data?.data ?? [],
      total: tasksQuery.data?.pagination.total ?? 0,
      api: tasksQuery,
    },
  };
}
