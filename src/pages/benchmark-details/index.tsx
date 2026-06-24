import { useCallback, useMemo, useRef, useState } from "react";
import { createLink, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { IconLink, IconPlus } from "@salutejs/plasma-icons";
import { BodyM, Button, Cell, Counter, Flow, H2, H4, Pagination } from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";

import { Route } from "@/routes/benchmark/$benchmarkId";
import { formatDate } from "@/shared/lib/format-date";
import { BenchmarkVersions } from "@/features/benchmark-versions";
import { usePagination } from "@/shared/lib/use-pagination";
import { ColumnType, Table } from "@/features/table";
import { useModal, Modal } from "@/shared/ui/modal";
import { AddBenchmarkVersionForm, FormProps } from "@/widgets/add-benchmark-version-form";
import {
  RunBenchmarkModal,
  RunBenchmarkModalRef,
  RunBenchFormProps,
} from "@/widgets/run-benchmark-modal";
import { Link } from "@/shared/ui/link";
import { useBenchmarkDetailsData } from "./model";
import * as UI from "./ui.styles";

const CellLink = createLink(Cell);

const empty = "-----";

export function BenchmarkDetailsPage() {
  const { benchmarkId } = useParams({ from: Route.fullPath });
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.fullPath });

  const limit = search.limit ?? 13;
  const offset = search.offset ?? 0;
  const version = search.version ?? null;
  const searchStr = search.search ?? "";

  const { bench, versions, tasks } = useBenchmarkDetailsData({
    benchmarkId,
    version,
    limit,
    offset,
    search: searchStr,
  });
  const benchData = bench.api.data;
  const tasksData = useMemo(() => tasks.api.data?.data ?? [], [tasks.api.data]);
  const originalVersions = versions.api.data?.data ?? [];
  const versionsData = [...originalVersions].reverse();

  const [selectedTasks, setSelectedTasks] = useState<Rows[]>([]);
  const runModalRef = useRef<RunBenchmarkModalRef>(null);
  const { modalRef, show, hide } = useModal();

  const rows = useMemo(
    () =>
      tasksData.map(({ task_id, web_name, web, id, ques }) => ({
        checkbox: null,
        task_id,
        web_name,
        id,
        web,
        ques,
        action: null,
      })),
    [tasksData],
  );

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total: tasks.total,
  });
  type Rows = (typeof rows)[number] & { action: null };
  const lastVersion = versionsData[versionsData.length - 1];
  const isActiveVersion = version === lastVersion?.version;

  const onAddTask = (form: FormProps) => {
    if (!benchData?.current_version?.id) {
      return;
    }

    tasks.crud.create.mutate(
      {
        ...form,
        attach_to_version_id: benchData.current_version.id,
      },
      {
        onSuccess: () => {
          hide();
          versions.api.refetch();
        },
      },
    );
  };

  const onSelectTask = (rows: Rows[]) => {
    setSelectedTasks(rows);
  };

  const onUnlinkTask = useCallback(
    (task_uuid: string) => {
      tasks.crud.delete.mutate(
        {
          bench_id: benchmarkId,
          version: Number(version) ?? benchData?.current_version?.version,
          task_uuid,
        },
        {
          onSuccess: () => {
            tasks.api.refetch();
          },
        },
      );
    },
    [benchmarkId, version, tasks, benchData?.current_version],
  );

  const onRunBenchmark = ({ params, selectedConfig }: RunBenchFormProps) => {
    const { max_concurrent, ...overrides } = params;
    const activeVersion = version ?? benchData?.current_version?.version;
    const benchVersion = versionsData.find((rev) => rev.version === activeVersion);
    const isPartial = selectedTasks.length > 0;

    if (!benchVersion) {
      throw new Error("Version not found");
    }

    if (!selectedConfig || !selectedConfig.active_version?.id) {
      throw new Error("Config not selected");
    }

    const notNullOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([, value]) => value != null && value !== undefined),
    );

    bench.crud.run.mutate(
      {
        bench_version_id: benchVersion.id,
        config_version_id: selectedConfig.active_version?.id,
        config_overrides: { ...notNullOverrides },
        max_concurrent,
        task_uuids: isPartial ? selectedTasks.map(({ id }) => id) : null,
      },
      {
        onSuccess: () => {
          runModalRef.current?.hide();
        },
      },
    );
  };

  const columns = useMemo<ColumnType<Rows>[]>(
    () => [
      { key: "task_id", title: "ID таски" },
      {
        key: "web_name",
        title: "Web имя",
      },
      {
        key: "ques",
        title: "Запрос",
        maxCharacters: 50,
      },
      {
        key: "web",
        title: "URL",
      },
      {
        key: "action",
        title: "Действия",
        renderCell: (row) =>
          isActiveVersion ? (
            <Button
              style={{ margin: "0 auto 0 0" }}
              size="xs"
              view="negative"
              onClick={() => onUnlinkTask(row.id)}
              isLoading={tasks.crud.delete.isPending}
            >
              Удалить
            </Button>
          ) : null,
      },
    ],
    [onUnlinkTask, tasks.crud.delete.isPending, isActiveVersion],
  );

  return (
    <>
      <UI.Header>
        <Navbar />
        <Flow mainAxisGap={16} arrangement="end">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content",
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
          </div>
        </Flow>
      </UI.Header>
      <UI.Content>
        {benchData && (
          <UI.Section>
            <H2 bold style={{ margin: "0 0 24px 0" }}>
              {benchData?.name}
            </H2>
            <UI.BenchDetailsGrid>
              <Cell
                label="Версия"
                title={
                  version?.toString() ?? benchData?.current_version?.version?.toString() ?? empty
                }
                stretching="auto"
              />
              <Cell
                label="Количество тасок"
                title={benchData?.current_version?.task_count?.toString() ?? empty}
                stretching="auto"
              />
              <Cell
                label="Дата создания"
                title={benchData?.created_at ? formatDate(benchData.created_at) : empty}
                stretching="auto"
              />
              <Cell label="Описание" title={benchData?.description || empty} stretching="auto" />
            </UI.BenchDetailsGrid>
          </UI.Section>
        )}
        {benchData?.current_version && (
          <UI.Section>
            <H4 bold style={{ margin: "0 0 12px 0" }}>
              Версии
            </H4>
            <BenchmarkVersions
              versions={versionsData}
              currentVersion={version ?? benchData.current_version.version}
              onChange={(version) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    offset: 0,
                    limit,
                    version,
                  }),
                })
              }
            />
          </UI.Section>
        )}
        <Flow style={{ width: "100%" }} mainAxisGap={8} arrangement="end" alignment="end">
          {isActiveVersion && (
            <Button size="s" view="secondary" contentLeft={<IconPlus />} onClick={show}>
              Добавить задачу
            </Button>
          )}
          <Button size="s" view="secondary" onClick={() => runModalRef.current?.show()}>
            Полный запуск
          </Button>
          <Button
            size="s"
            view="secondary"
            contentRight={<Counter size="s" count={selectedTasks.length} />}
            disabled={selectedTasks.length === 0}
            onClick={() => runModalRef.current?.show()}
          >
            Частичный запуск
          </Button>
        </Flow>
        <Table<Rows>
          data={rows}
          selectable
          onSelectionChange={onSelectTask}
          columns={columns}
          loading={tasks.api.isLoading}
          template="20% 20% 30% 20% 10%"
          getRowId={(row) => row.id}
        />
        {!tasks.api.isLoading && tasks.total === 0 && <BodyM>Нет задач</BodyM>}
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
                    offset: page ? (page - 1) * limit : prev.offset,
                    limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
        <Modal ref={modalRef} id="addBenchmark">
          <AddBenchmarkVersionForm
            onClose={hide}
            onSubmit={onAddTask}
            loading={tasks.crud.create.isPending}
          />
        </Modal>
        <RunBenchmarkModal
          ref={runModalRef}
          onSubmit={onRunBenchmark}
          loading={bench.crud.run.isPending}
        />
      </UI.Content>
    </>
  );
}
