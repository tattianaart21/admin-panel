import styled from "styled-components";
import { surfaceTransparentSecondary } from "@salutejs/sdds-themes/tokens";

export const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ZoomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Scroller = styled.div`
  width: 100%;
  overflow: auto;
  border-radius: 16px;
  background: ${surfaceTransparentSecondary};
  padding: 16px 8px 24px;
`;

export const Chart = styled.div<{ $width: number }>`
  position: relative;
  min-width: ${({ $width }) => $width}px;
`;

export const TimeAxis = styled.div<{ $left: number; $width: number }>`
  position: relative;
  margin-left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 8px;
`;

export const Tick = styled.div<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  transform: translateX(-50%);
  top: 0;
`;

export const Row = styled.div<{ $height: number }>`
  display: flex;
  align-items: center;
  height: ${({ $height }) => $height}px;
`;

export const Label = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  overflow: hidden;
`;

export const Track = styled.div<{ $width: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: 24px;
  flex-shrink: 0;
`;

export const Bar = styled.button<{ $type: "model" | "plugin"; $error: boolean; $selected?: boolean }>`
  position: absolute;
  top: 2px;
  height: 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  background: ${({ $type }) => ($type === "model" ? "#7B61FF" : "#FF8C42")};
  box-shadow: ${({ $error, $selected }) => {
    if ($error) return "inset 0 0 0 2px #FF293E";
    if ($selected) return "0 0 0 2px #2980FF";
    return "none";
  }};
  opacity: ${({ $selected }) => ($selected ? 1 : 0.92)};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;
