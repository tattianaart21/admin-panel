import { createLink, useNavigate, useSearch } from "@tanstack/react-router";
import { IconLink, IconPlus } from "@salutejs/plasma-icons";
import { Button, Cell, Flow, IconButton, Pagination } from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";
import { Table, ColumnType } from "@/features/table";
import { useBenchList, useCreateBench } from "@/entities/bench/api";
import { usePagination } from "@/shared/lib/use-pagination";
import { Route } from "@/routes/benchmark";
import { Modal, useModal } from "@/shared/ui/modal";
import { AddBenchmarkForm } from "@/widgets/add-benchmark-form";
import * as UI from "./ui.styles";
import { Link } from "@/shared/ui/link";
import {
  RunBenchFormProps,
  RunBenchmarkModal,
  RunBenchmarkModalRef,
} from "@/widgets/run-benchmark-modal";
import { useRef, useState } from "react";
import { useCreateRun } from "@/entities/runs";

const CellLink = createLink(Cell);

function getVersion(current: number | undefined) {
  if (!current) {
    return null;
  }

  return current;
}

export function BenchmarkPage() {
  const search = useSearch({ from: Route.fullPath });
  const navigate = useNavigate({ from: Route.fullPath });
  const limit = (search as Record<string, unknown>).limit ?? 13;
  const offset = (search as Record<string, unknown>).offset ?? 0;
  const createApi = useCreateBench();
  const { modalRef, show, hide } = useModal();
  const runModalRef = useRef<RunBenchmarkModalRef>(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState<(typeof flatData)[number] | null>(
    null,
  );
  const runBenchApi = useCreateRun();

  const { data, isLoading, refetch } = useBenchList({
    limit: Number(limit),
    offset: Number(offset),
    sort: "created_at",
    order: "desc",
  });

  const flatData = (data?.data ?? []).map(({ current_version, ...rest }) => ({
    ...rest,
    active_version: getVersion(current_version?.version),
    task_count: current_version?.task_count ?? 0,
    action: null,
    current_version,
  }));

  const { page, pagesCount, hasPagination } = usePagination({
    limit: Number(limit),
    offset: Number(offset),
    total: data?.pagination.total ?? 0,
  });

  const columns: ColumnType<(typeof flatData)[number]>[] = [
    { key: "name", title: "Название" },
    {
      key: "active_version",
      title: "Текущая версия",
    },
    {
      key: "task_count",
      title: "Количество тасок",
    },
    {
      key: "created_at",
      title: "Дата создания",
      isTimestamp: true,
    },
    {
      key: "action",
      title: "Действия",
      renderCell: (row) => (
        <Button
          style={{ margin: "0 auto 0 0" }}
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBenchmark(row);
            runModalRef.current?.show();
          }}
        >
          Запустить
        </Button>
      ),
    },
  ];

  const onSubmit = (values: { name: string }) => {
    createApi.mutate(
      { name: values.name },
      {
        onSuccess: (res) => {
          hide();
          refetch();
          navigate({
            to: "/benchmark/$benchmarkId",
            params: { benchmarkId: res.id },
          });
        },
      },
    );
  };

  const onRunBenchmark = ({ params, selectedConfig }: RunBenchFormProps) => {
    const { max_concurrent, ...overrides } = params;
    const benchVersion = selectedBenchmark?.current_version;

    if (!benchVersion) {
      throw new Error("Version not found");
    }

    if (!selectedConfig || !selectedConfig.active_version?.id) {
      throw new Error("Config not selected");
    }

    const notNullOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([, value]) => value != null && value !== undefined),
    );

    runBenchApi.mutate(
      {
        bench_version_id: benchVersion.id,
        config_version_id: selectedConfig.active_version?.id,
        config_overrides: { ...notNullOverrides },
        max_concurrent,
        task_uuids: null,
      },
      {
        onSuccess: () => {
          runModalRef.current?.hide();
          setSelectedBenchmark(null);
        },
      },
    );
  };

  return (
    <>
      <UI.Header>
        <Navbar />

        <Flow mainAxisGap={16} arrangement="end">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content max-content",
              gap: 16,
            }}
          >
            <Link to="/benchmark/runs">
              <CellLink
                to="/benchmark/runs"
                title="Запуски"
                contentRight={<IconLink size="xs" />}
              />
            </Link>
            <Link to="/benchmark/compare">
              <CellLink
                to="/benchmark/compare"
                title="Сравнение"
                contentRight={<IconLink size="xs" />}
              />
            </Link>

            <IconButton view="accent" onClick={show}>
              <IconPlus />
            </IconButton>
          </div>
        </Flow>
      </UI.Header>
      <UI.Content>
        <Table<(typeof flatData)[number]>
          data={flatData}
          columns={columns}
          loading={isLoading}
          template="35% 15% 15% 25% 10%"
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            navigate({
              to: "/benchmark/$benchmarkId",
              params: { benchmarkId: row.id.toString() },
              search: { version: row.active_version ? row.active_version : undefined },
            })
          }
        />
        {hasPagination && (
          <UI.PaginationContainer>
            <Pagination
              size="m"
              type="compact"
              singleLine
              hasPerPage={false}
              hasQuickJump={false}
              slots={9}
              count={pagesCount}
              value={page}
              onChange={(page) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    offset: page ? (page - 1) * Number(limit) : prev.offset,
                    limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
      </UI.Content>
      <Modal ref={modalRef} id="addBenchmark">
        <AddBenchmarkForm onClose={hide} onSubmit={onSubmit} loading={createApi.isPending} />
      </Modal>
      <RunBenchmarkModal
        ref={runModalRef}
        onSubmit={onRunBenchmark}
        loading={runBenchApi.isPending}
      />
    </>
  );
}
