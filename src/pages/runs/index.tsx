import { createLink, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  IconClose,
  IconDone,
  IconDotsHorizontalOutline,
  IconHourglassOutline,
  IconLink,
} from "@salutejs/plasma-icons";
import { Breadcrumbs, Cell, Flow, Pagination } from "@salutejs/sdds-platform-ai/styled-components";
import { Route } from "@/routes/benchmark/runs";
import { Navbar } from "@/features/navbar";
import { SearchBar } from "@/shared/ui/search-bar";
import { Table, ColumnType } from "@/features/table";
import { useRunList, IRunOut, RunStatus } from "@/entities/runs";
import { usePagination } from "@/shared/lib/use-pagination";
import { Link } from "@/shared/ui/link";
import * as UI from "./ui.styles";

const CellLink = createLink(Cell);

type ComponentType = typeof IconClose;

const icons: Record<RunStatus, ComponentType> = {
  running: IconDotsHorizontalOutline,
  failed: IconClose,
  succeeded: IconDone,
  submitted: IconDotsHorizontalOutline,
  cancelled: IconClose,
  pending: IconHourglassOutline,
};

function SearchSection({
  searchStr,
  onSearch,
}: {
  searchStr: string;
  onSearch: (value: string | undefined) => void;
}) {
  const [value, setValue] = useState(searchStr);

  return (
    <SearchBar
      value={value}
      onChange={setValue}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          onSearch((e.target as HTMLInputElement).value || undefined);
        }
      }}
      onClear={() => {
        setValue("");
        onSearch(undefined);
      }}
    />
  );
}

export function RunsPage() {
  const search = useSearch({ from: Route.fullPath });
  const navigate = useNavigate({ from: Route.fullPath });
  const { limit = 10, offset = 0, order, search: searchStr = "" } = search;

  const { data, isLoading } = useRunList({
    limit,
    offset,
    sort: "created_at",
    order: order ?? "desc",
  });

  const rows = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total,
  });

  const breadcrumbItems = [
    { title: "Бенчмарки", href: "/benchmark" },
    { title: "Запуски", isCurrent: true },
  ];

  const columns: ColumnType<IRunOut>[] = [
    { key: "bench_name", title: "Название" },
    { key: "version", title: "Версия" },
    { key: "max_concurrent", title: "Кол-во потоков" },
    {
      key: "created_at",
      title: "Дата создания",
      isTimestamp: true,
    },
    {
      key: "submitted_at",
      title: "Дата отправки",
      isTimestamp: true,
    },
    {
      key: "finished_at",
      title: "Дата завершения",
      isTimestamp: true,
    },
    {
      key: "status",
      title: "Статус",
      isStatus: true,
      renderCell: (row) => {
        const Component = icons[row.status];

        return Component ? (
          <Cell
            contentLeft={
              <UI.IconContainer status={row.status}>
                <Component size="xs" />
              </UI.IconContainer>
            }
            title={row.status}
          />
        ) : null;
      },
    },
  ];

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
              <Cell title="Запуски" contentRight={<IconLink size="xs" />} />
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
        <UI.BreadcrumbsContainer>
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>
        <SearchSection
          searchStr={searchStr}
          onSearch={(value) =>
            navigate({
              search: (prev) => ({ ...prev, offset: 0, search: value }),
            })
          }
        />
        <Table<IRunOut>
          data={rows}
          columns={columns}
          template="21% 12% 12% 15% 15% 15% 10%"
          loading={isLoading}
          getRowId={(row) => row.id}
          onRowClick={(row) =>
            navigate({
              to: "/benchmark/runs/$runId",
              params: { runId: row.id },
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
    </>
  );
}
