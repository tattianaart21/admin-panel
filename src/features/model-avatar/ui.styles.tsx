import styled from "styled-components";
import { BodyS } from "@salutejs/sdds-platform-ai";

export const Row = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const ColorRing = styled.div<{ $color: string }>`
  display: inline-flex;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px ${({ $color }) => $color};
`;

export const Name = styled(BodyS)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
