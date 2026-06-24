import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Breadcrumbs, Button, Cell, Flow, H2, Note } from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";
import { ModelAvatar } from "@/features/model-avatar";
import {
  getDemoCycleDetail,
  segmentKafkaRange,
} from "@/entities/trace-performance";
import { formatDate } from "@/shared/lib/format-date";
import { Route } from "@/routes/traces/demo/cycles/$cycleId";
import * as UI from "../trace-demo/ui.styles";

export function TraceDemoCyclePage() {
  const { cycleId } = useParams({ from: Route.fullPath });
  const search = useSearch({ from: Route.fullPath });
  const navigate = useNavigate();
  const data = getDemoCycleDetail(cycleId);

  if (!data) {
    return (
      <UI.Content>
        <H2>Цикл не найден</H2>
      </UI.Content>
    );
  }

  const { trace, cycle, segments } = data;
  const highlightedSegmentId = search.segment ?? null;

  const breadcrumbItems = [
    { title: "Трейсы", href: "/traces" },
    {
      title: "Демо прототип",
      href: "/traces/demo?tab=overview",
    },
    {
      title: "Performance",
      href: "/traces/demo?tab=performance",
    },
    { title: cycle.agent_name, isCurrent: true },
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
          text="Карточка цикла из mock-данных. Клик по строке таблицы или полоске Gantt открывает эту страницу."
          style={{ width: "100%", marginBottom: 16 }}
        />

        <UI.BreadcrumbsContainer alignment="start" arrangement="center">
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>

        <UI.Section>
          <H2 bold style={{ marginBottom: 24 }}>
            Цикл: {cycle.agent_name}
          </H2>
          <UI.CellGrid>
            <Cell label="ID цикла" title={cycle.id} stretching="auto" />
            <Cell label="Токены" title={String(cycle.total_tokens)} stretching="auto" />
            <Cell label="Длительность (Kafka)" title={`${cycle.duration_s} сек.`} stretching="auto" />
            <Cell label="Статус" title={cycle.status} stretching="auto" />
          </UI.CellGrid>
          <Flow mainAxisGap={8} alignment="center" style={{ marginTop: 16 }}>
            <ModelAvatar modelName={cycle.model_name} size="m" showName />
          </Flow>

          <H2 bold style={{ margin: "32px 0 16px" }}>
            Сегменты на timeline
          </H2>
          {segments.map((seg) => {
            const kafka = segmentKafkaRange(trace.timeline.originAt, seg);
            const highlighted = highlightedSegmentId === seg.id;

            return (
              <UI.SegmentRow key={seg.id} $highlighted={highlighted}>
                <Cell
                  label={seg.type === "model" ? "Модель" : "Плагин"}
                  title={seg.label}
                  stretching="auto"
                />
                <Cell label="Длительность" title={`${seg.durationS.toFixed(2)} с`} stretching="auto" />
                <Cell label="Старт (от T₀)" title={`+${seg.startOffsetS.toFixed(2)} с`} stretching="auto" />
                <Cell
                  label="Kafka"
                  title={`${formatDate(kafka.startAt)} → ${formatDate(kafka.endAt)}`}
                  stretching="auto"
                />
              </UI.SegmentRow>
            );
          })}

          <Button
            view="secondary"
            size="m"
            style={{ marginTop: 24, alignSelf: "flex-start" }}
            onClick={() =>
              navigate({
                to: "/traces/demo",
                search: { tab: "performance" },
              })
            }
          >
            ← Назад к Performance
          </Button>
        </UI.Section>
      </UI.Content>
    </>
  );
}
