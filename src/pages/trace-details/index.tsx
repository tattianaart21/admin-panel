import { Outlet, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Breadcrumbs, Cell, H2, Pagination } from "@salutejs/sdds-platform-ai/styled-components";
import { Navbar } from "@/features/navbar";
import { useUserQueryAgents } from "@/entities/trace";
import { ColumnType, Table } from "@/features/table";
import { formatDate } from "@/shared/lib/format-date";
import { usePagination } from "@/shared/lib/use-pagination";

import * as UI from "./ui.styles";
import {
  IconCallIncomingFill,
  IconDocumentFill,
  IconChartDistributionFill,
  IconPhone,
  IconClockCircleFill,
  IconSwapHorizCircFill,
  IconLink,
} from "@salutejs/plasma-icons";
import { ExternalLink } from "@/shared/ui/link";

type AgentRow = import("@/entities/trace").IUserQueryAgentRowSchema;

export function TraceDetailsPage() {
  const { traceId } = useParams({ from: "/traces/$traceId/" });
  const navigate = useNavigate({ from: "/traces/$traceId/" });
  const search = useSearch({ from: "/traces/$traceId/" });
  const { limit = 10, offset = 0 } = search;

  const { data, isLoading } = useUserQueryAgents(traceId, { limit, offset });

  const total = data?.pagination.total ?? 0;
  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <UI.NotFound>
        <H2>Trace not found</H2>
      </UI.NotFound>
    );
  }

  const { user_query, data: agents } = data;

  const columns: ColumnType<AgentRow>[] = [
    { key: "id", title: "ID запроса к агенту", icon: <IconCallIncomingFill /> },
    { key: "agent_name", title: "Имя агента", icon: <IconDocumentFill /> },
    {
      key: "model_name",
      title: "Имя модели",
      icon: <IconChartDistributionFill />,
    },
    { key: "total_tokens", title: "Общее кол-во токенов", icon: <IconPhone /> },
    {
      key: "duration_s",
      title: "Длительность обработки запроса",
      icon: <IconClockCircleFill />,
    },
    {
      key: "status",
      title: "Статус",
      isStatus: true,
      icon: <IconSwapHorizCircFill />,
    },
  ];

  const breadcrumbItems = [
    { title: "Трейсы", href: "/traces" },
    { title: `Трейс ${user_query.id.slice(0, 8)}...`, isCurrent: true },
  ];

  return (
    <>
      <UI.Header>
        <Navbar />
      </UI.Header>
      <UI.Content>
        <UI.BreadcrumbsContainer alignment="start" arrangement="center">
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>
        <UI.Section>
          <UI.TitleGrid>
            <H2 bold style={{ gridColumn: "1/5", margin: "0 auto" }}>
              Информация о запросе
            </H2>
            <ExternalLink
              href={`https://kibana.dev.sberdevices.ru/s/gigabtc/app/discover#/?_a=(columns:!(message),filters:!(),index:'6b0612f0-5d90-11f1-b04a-e3bc02bbd147',interval:auto,query:(language:kuery,query:'kubernetes.labels.session_id:%20${user_query.session_id}'),sort:!(!('@timestamp',desc)))&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y%2Fd,to:now))`}
              style={{ display: "inline-flex", gap: 4, marginLeft: 12 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ссылка на Kibana
              <IconLink size="xs" />
            </ExternalLink>
          </UI.TitleGrid>
          <UI.CellGrid>
            <UI.CellContainer>
              <Cell label="User Query" title={user_query.user_query ?? "—"} stretching="auto" />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell label="Session ID" title={user_query.session_id ?? "—"} stretching="auto" />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell label="Chat ID" title={user_query.chat_id ?? "—"} stretching="auto" />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell label="User Agent" title={user_query.user_agent ?? "—"} stretching="auto" />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell
                label="Created At"
                title={formatDate(user_query.created_at)}
                stretching="auto"
              />
            </UI.CellContainer>
          </UI.CellGrid>
        </UI.Section>

        <Table<AgentRow>
          data={agents}
          columns={columns}
          template="18% 18% 18% 14% 20% 12%"
          loading={isLoading}
          onRowClick={(row) =>
            navigate({
              to: "/traces/$traceId/agent-query/$agentQueryId",
              params: { agentQueryId: row.id, traceId },
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
                    offset: page ? (page - 1) * Number(limit) : 0,
                    limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
      </UI.Content>
      <Outlet />
    </>
  );
}
