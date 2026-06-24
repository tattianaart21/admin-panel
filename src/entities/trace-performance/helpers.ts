import { TRACE_DEMO_MOCK } from "./mock-data";
import type { IMockCycleRow, ITimelineSegment } from "./types";

export function getDemoCycleDetail(cycleId: string) {
  const cycle = TRACE_DEMO_MOCK.cycles.find((c) => c.id === cycleId);
  if (!cycle) return null;

  const segments = TRACE_DEMO_MOCK.timeline.segments.filter((s) => s.cycleId === cycleId);

  return {
    trace: TRACE_DEMO_MOCK,
    cycle,
    segments,
  };
}

export function segmentKafkaRange(
  originAt: string,
  segment: ITimelineSegment,
): { startAt: string; endAt: string } {
  const originMs = new Date(originAt).getTime();
  const startMs = originMs + segment.startOffsetS * 1000;
  const endMs = startMs + segment.durationS * 1000;
  return {
    startAt: new Date(startMs).toISOString(),
    endAt: new Date(endMs).toISOString(),
  };
}

export type { IMockCycleRow, ITimelineSegment };
