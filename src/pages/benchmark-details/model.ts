import {
  useBench,
  useBenchVersions,
  useBenchVersionTasks,
  useCreateBenchVersionTask,
  useUnlinkTask,
} from "@/entities/bench";
import { useCreateRun } from "@/entities/runs";

type Props = {
  limit: number;
  offset: number;
  search: string | null;
  version: number | null;
  benchmarkId: string;
};

export function useBenchmarkDetailsData({ benchmarkId, version, limit, offset, search }: Props) {
  const bench = useBench(benchmarkId);
  const benchVersions = useBenchVersions(benchmarkId);
  const tasks = useBenchVersionTasks({
    benchId: benchmarkId,
    version: version ?? bench.data?.current_version?.version,
    limit,
    offset,
    search,
  });
  const runBenchApi = useCreateRun();
  const unlinkTaskApi = useUnlinkTask();
  const taskCreateApi = useCreateBenchVersionTask();

  return {
    bench: {
      api: bench,
      //   data: bench.data,
      crud: {
        run: runBenchApi,
      },
      notEmpty: !bench.isLoading && !!bench.data,
    },
    versions: {
      api: benchVersions,
      //   data: benchVersions.data?.data ?? [],
      total: benchVersions.data?.pagination.total ?? 0,
      notEmpty:
        !benchVersions.isLoading && !!benchVersions.data && benchVersions.data.pagination.total > 1,
    },
    activeVersion: {},
    tasks: {
      api: tasks,
      //   data: tasks.data?.data ?? [],
      total: tasks.data?.pagination.total ?? 0,
      crud: {
        delete: unlinkTaskApi,
        create: taskCreateApi,
      },
    },
  };
}
