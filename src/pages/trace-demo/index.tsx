import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Breadcrumbs,
  Cell,
  H2,
  Note,
  TabItem,
  Tabs,
} from "@salutejs/sdds-platform-ai";
import {
  IconCallIncomingFill,
  IconChartDistributionFill,
  IconClockCircleFill,
  IconDocumentFill,
  IconPhone,
  IconSwapHorizCircFill,
} from "@salutejs/plasma-icons";
import { Navbar } from "@/features/navbar";
import { Table, ColumnType } from "@/features/table";
import { PerformanceGantt, PerformanceGanttZoom } from "@/features/performance-gantt";
import { ModelNameWithAvatar } from "@/features/model-avatar";
import { TRACE_DEMO_MOCK, type IMockCycleRow, type ITimelineSegment } from "@/entities/trace-performance";
import { formatDate } from "@/shared/lib/format-date";
import { Route } from "@/routes/traces/demo";
import * as UI from "./ui.styles";

type TabId = "overview" | "performance";

export function TraceDemoPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.fullPath });
  const tab: TabId = search.tab ?? "overview";
  const [zoom, setZoom] = useState(1);

  const demo = TRACE_DEMO_MOCK;

  const setTab = (next: TabId) => {
    navigate({ search: (prev) => ({ ...prev, tab: next }) });
  };

  const goToCycle = (cycleId: string, segmentId?: string) => {
    navigate({
      to: "/traces/demo/cycles/$cycleId",
      params: { cycleId },
      search: segmentId ? { segment: segmentId } : {},
    });
  };

  const handleSegmentClick = (segment: ITimelineSegment) => {
    goToCycle(segment.cycleId, segment.id);
  };

  const columns: ColumnType<IMockCycleRow>[] = [
    { key: "id", title: "ID запроса к агенту", icon: <IconCallIncomingFill /> },
    { key: "agent_name", title: "Имя агента", icon: <IconDocumentFill /> },
    {
      key: "model_name",
      title: "Имя модели",
      icon: <IconChartDistributionFill />,
      renderCell: (row) => <ModelNameWithAvatar modelName={row.model_name} />,
    },
    { key: "total_tokens", title: "Общее кол-во токенов", icon: <IconPhone /> },
    {
      key: "duration_s",
      title: "Длительность (Kafka)",
      icon: <IconClockCircleFill />,
      renderCell: (row) => `${row.duration_s} сек.`,
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
    { title: "Демо прототип Performance", isCurrent: true },
  ];

  return (
    <>
      <UI.Header>
        <Navbar />
      </UI.Header>
      <UI.Content>
        <Note
          view="info"
          title="Прототип без API"
          text="Демо-страница с mock-данными. Клик по строке таблицы или полоске Gantt открывает карточку цикла."
          style={{ width: "100%", marginBottom: 16 }}
        />

        <UI.BreadcrumbsContainer alignment="start" arrangement="center">
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>

        <UI.Section>
          <H2 bold style={{ margin: "0 0 24px 0" }}>
            Информация о запросе
          </H2>
          <UI.CellGrid>
            <Cell label="User Query" title={demo.user_query} stretching="auto" />
            <Cell label="Session ID" title={demo.session_id} stretching="auto" />
            <Cell label="Chat ID" title={demo.chat_id} stretching="auto" />
            <Cell label="User Agent" title={demo.user_agent} stretching="auto" />
            <Cell label="Created At" title={formatDate(demo.created_at)} stretching="auto" />
          </UI.CellGrid>
        </UI.Section>

        <UI.TabsWrap>
          <Tabs view="divider" size="m">
            <TabItem
              view="divider"
              size="m"
              selected={tab === "overview"}
              onClick={() => setTab("overview")}
            >
              Обзор
            </TabItem>
            <TabItem
              view="divider"
              size="m"
              selected={tab === "performance"}
              onClick={() => setTab("performance")}
            >
              Performance
            </TabItem>
          </Tabs>
        </UI.TabsWrap>

        {tab === "overview" && (
          <Table<IMockCycleRow>
            data={demo.cycles}
            columns={columns}
            template="18% 14% 22% 14% 16% 10%"
            getRowId={(row) => row.id}
            onRowClick={(row) => goToCycle(row.id)}
          />
        )}

        {tab === "performance" && (
          <UI.Section>
            <PerformanceGanttZoom
              zoom={zoom}
              onDecrease={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              onIncrease={() => setZoom((z) => Math.min(3, z + 0.25))}
              onReset={() => setZoom(1)}
            />
            <PerformanceGantt
              segments={demo.timeline.segments}
              totalDurationS={demo.timeline.totalDurationS}
              zoom={zoom}
              onSegmentClick={handleSegmentClick}
            />
          </UI.Section>
        )}
      </UI.Content>
    </>
  );
}
