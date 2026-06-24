import { useMemo } from "react";
import { BodyS, Button, Chip } from "@salutejs/sdds-platform-ai";
import type { ITimelineSegment } from "@/entities/trace-performance";
import { ModelAvatar } from "@/features/model-avatar";
import { Tooltip } from "@/shared/ui/tooltip";
import * as UI from "./ui.styles";

const MIN_BAR_PX = 4;
const ROW_HEIGHT = 40;
const LABEL_WIDTH = 200;

type Props = {
  segments: ITimelineSegment[];
  totalDurationS: number;
  zoom?: number;
  selectedSegmentId?: string | null;
  onSegmentClick?: (segment: ITimelineSegment) => void;
};

function formatTooltip(seg: ITimelineSegment) {
  const lines = [
    seg.type === "model" ? "Тип: Модель" : "Тип: Плагин",
    seg.type === "model"
      ? `Агент: ${seg.agentName ?? "—"}`
      : `Action: ${seg.actionName ?? seg.label}`,
  ];
  if (seg.modelName) lines.push(`Модель: ${seg.modelName}`);
  lines.push(
    `Длительность: ${seg.durationS.toFixed(2)} с`,
    `Старт: +${seg.startOffsetS.toFixed(2)} с`,
    `Статус: ${seg.status}`,
  );
  return lines.join("\n");
}

function isError(status: string) {
  return status === "fail" || status === "failed" || status === "browser_fail";
}

export function PerformanceGantt({
  segments,
  totalDurationS,
  zoom = 1,
  selectedSegmentId,
  onSegmentClick,
}: Props) {
  const chartWidthPx = Math.max(800, totalDurationS * 48 * zoom);

  const ticks = useMemo(() => {
    const step = totalDurationS > 20 ? 5 : totalDurationS > 10 ? 2 : 1;
    const result: number[] = [];
    for (let t = 0; t <= totalDurationS; t += step) {
      result.push(t);
    }
    return result;
  }, [totalDurationS]);

  return (
    <UI.Root>
      <UI.Legend>
        <Chip size="m" view="secondary" text="Модель" />
        <Chip size="m" view="warning" text="Плагин" />
        <Chip size="m" view="negative" text="Ошибка (обводка)" />
      </UI.Legend>

      <UI.Scroller>
        <UI.Chart $width={chartWidthPx + LABEL_WIDTH}>
          <UI.TimeAxis $left={LABEL_WIDTH} $width={chartWidthPx}>
            {ticks.map((t) => (
              <UI.Tick key={t} $left={(t / totalDurationS) * 100}>
                <BodyS>{t}s</BodyS>
              </UI.Tick>
            ))}
          </UI.TimeAxis>

          {segments.map((seg) => {
            const leftPct = (seg.startOffsetS / totalDurationS) * 100;
            const widthPct = Math.max((seg.durationS / totalDurationS) * 100, 0.15);
            const widthPx = Math.max((seg.durationS / totalDurationS) * chartWidthPx, MIN_BAR_PX);
            const selected = selectedSegmentId === seg.id;

            return (
              <UI.Row key={seg.id} $height={ROW_HEIGHT}>
                <UI.Label $width={LABEL_WIDTH}>
                  {seg.type === "model" && seg.modelName ? (
                    <ModelAvatar modelName={seg.modelName} size="xs" />
                  ) : null}
                  <BodyS>{seg.label}</BodyS>
                </UI.Label>
                <UI.Track $width={chartWidthPx}>
                  <Tooltip text={formatTooltip(seg)}>
                    <UI.Bar
                      type="button"
                      $type={seg.type}
                      $error={isError(seg.status)}
                      $selected={selected}
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        minWidth: widthPx < MIN_BAR_PX ? MIN_BAR_PX : undefined,
                      }}
                      onClick={() => onSegmentClick?.(seg)}
                    />
                  </Tooltip>
                </UI.Track>
              </UI.Row>
            );
          })}
        </UI.Chart>
      </UI.Scroller>
    </UI.Root>
  );
}

export function PerformanceGanttZoom({
  zoom,
  onDecrease,
  onIncrease,
  onReset,
}: {
  zoom: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onReset: () => void;
}) {
  return (
    <UI.ZoomRow>
      <BodyS>Масштаб:</BodyS>
      <Button size="xs" view="secondary" onClick={onDecrease}>
        −
      </Button>
      <BodyS>{Math.round(zoom * 100)}%</BodyS>
      <Button size="xs" view="secondary" onClick={onIncrease}>
        +
      </Button>
      <Button size="xs" view="clear" onClick={onReset}>
        Сброс
      </Button>
    </UI.ZoomRow>
  );
}
