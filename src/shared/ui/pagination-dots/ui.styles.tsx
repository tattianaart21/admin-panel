import styled from "styled-components";
import {
  surfaceTransparentTertiary,
  surfaceSolidDefaultActive,
} from "@salutejs/sdds-themes/tokens";

export const Dot = styled.div<{ active: boolean }>`
  width: ${(props) => (props.active ? 12 : 8)}px;
  height: ${(props) => (props.active ? 12 : 8)}px;
  transform-origin: 50%;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active ? surfaceSolidDefaultActive : surfaceTransparentTertiary};
  cursor: pointer;
  opacity: ${(props) => (props.active ? 0.8 : 1)};
  transition: all 0.3s linear;

  &:hover {
    background: surfaceSolidDefaultActive;
  }
`;
