import { useNavigate, useSearch } from "@tanstack/react-router";
import { EmbedIconButton, Pagination } from "@salutejs/sdds-platform-ai";
import {
  IconSwapVert,
  IconCallIncomingFill,
  IconDocumentFill,
  IconClockCircleFill,
  IconPhone,
} from "@salutejs/plasma-icons";
import { Route } from "@/routes/traces";
import { ColumnType, Table } from "@/features/table";
import { IGetUserQueriesResponse, useUserQueries } from "@/entities/trace";
import { TracesHeader } from "@/widgets/traces-header";
import { usePagination } from "@/shared/lib/use-pagination";

import * as UI from "./ui.styles";

type RowType = IGetUserQueriesResponse["data"][number];

export function TracesPage() {
  const search = useSearch({
    from: Route.fullPath,
  });

  const { user_query: searchQuery, dateFrom, dateTo, limit = 13, offset = 0, order } = search;

  const navbarValue = {
    search: searchQuery,
    date: {
      dateFrom,
      dateTo,
    },
  };

  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isLoading } = useUserQueries({
    user_query: searchQuery,
    from_date: dateFrom,
    end_date: dateTo,
    sort_column: "created_at",
    sort_order: (order as "asc" | "desc") ?? "desc",
    limit,
    offset,
  });

  const rows = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total,
  });

  const changeSort = () =>
    navigate({
      search: (prev) => ({
        ...prev,
        order: prev.order === "asc" ? "desc" : "asc",
      }),
    });

  const columns: ColumnType<RowType>[] = [
    {
      key: "id",
      title: "Идентификатор запроса",
      icon: <IconCallIncomingFill />,
    },
    {
      key: "user_query",
      title: "Запрос",
      icon: <IconDocumentFill />,
    },
    {
      key: "session_id",
      title: "Session ID",
      icon: <IconPhone />,
    },
    {
      key: "chat_id",
      title: "Chat ID",
      icon: <IconPhone />,
    },
    {
      key: "created_at",
      title: "Дата создания",
      icon: <IconClockCircleFill />,
      isTimestamp: true,
      action: (
        <EmbedIconButton onClick={changeSort} view="default" style={{ color: "white" }}>
          <IconSwapVert color="inherit" />
        </EmbedIconButton>
      ),
    },
  ];

  return (
    <>
      <TracesHeader
        value={navbarValue}
        onSearch={({ search, date }) =>
          navigate({
            search: (prev) => ({
              ...prev,
              offset: 0,
              user_query: search,
              dateFrom: date.dateFrom,
              dateTo: date.dateTo,
            }),
          })
        }
      />
      <UI.Content>
        <Table<RowType>
          data={rows}
          columns={columns}
          template="21% 21% 19% 19% 20%"
          loading={isLoading}
          onRowClick={(row) =>
            navigate({
              to: "/traces/$traceId",
              params: { traceId: row.id },
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
                    limit: limit,
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
