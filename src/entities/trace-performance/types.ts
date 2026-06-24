export type TimelineSegmentType = "model" | "plugin";

export type TimelineSegmentStatus = "success" | "fail" | "failed" | "browser_fail";

export interface ITimelineSegment {
  id: string;
  type: TimelineSegmentType;
  cycleId: string;
  label: string;
  agentName?: string;
  modelName?: string;
  actionName?: string;
  actionIndex?: number;
  startOffsetS: number;
  durationS: number;
  status: TimelineSegmentStatus;
}

export interface IPerformanceTimeline {
  traceId: string;
  originAt: string;
  totalDurationS: number;
  segments: ITimelineSegment[];
}

export interface IMockCycleRow {
  [key: string]: unknown;
  id: string;
  agent_name: string;
  model_name: string;
  total_tokens: number;
  duration_s: number;
  status: "success" | "fail" | "browser_fail";
}

export interface IMockTraceDemo {
  traceId: string;
  user_query: string;
  session_id: string;
  chat_id: string;
  user_agent: string;
  created_at: string;
  cycles: IMockCycleRow[];
  timeline: IPerformanceTimeline;
}
