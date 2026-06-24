import styled from "styled-components";
import {
  surfaceNegative,
  surfacePositive,
  surfaceTransparentPositive,
  surfaceTransparentNegative,
} from "@salutejs/sdds-themes/tokens";
import { backgroundSecondary } from "@salutejs/sdds-themes/tokens/sdds_platform_ai";

export const IconContainer = styled.div<{ isError: boolean }>`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ isError }) => (isError ? surfaceNegative : surfacePositive)};
  border: 2px solid
    ${({ isError }) => (isError ? surfaceTransparentNegative : surfaceTransparentPositive)};
  color: white;
`;

export const ExpandChevron = styled.button<{ isExpanded: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 8px;
  transition: transform 0.2s ease;
  transform: ${({ isExpanded }) => (isExpanded ? "rotate(180deg)" : "rotate(0deg)")};
  color: inherit;
`;

export const StickyHead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 2;
  background: ${backgroundSecondary};
`;
