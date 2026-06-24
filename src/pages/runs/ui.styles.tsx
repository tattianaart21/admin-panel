import styled from "styled-components";
import {
  surfaceNegative,
  surfacePositive,
  surfaceWarning,
  surfaceInfo,
  surfaceSolidSecondary,
  surfaceTransparentPositive,
  surfaceTransparentNegative,
  surfaceTransparentWarning,
  surfaceTransparentInfo,
  surfaceTransparentSecondary,
} from "@salutejs/sdds-themes/tokens";
import { RunStatus } from "@/entities/runs";

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto max-content;
  align-items: center;
  gap: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;

const colorsByType: Record<RunStatus, { color: string; background: string }> = {
  running: {
    color: surfaceTransparentInfo,
    background: surfaceInfo,
  },
  failed: {
    color: surfaceTransparentNegative,
    background: surfaceNegative,
  },
  succeeded: {
    color: surfaceTransparentPositive,
    background: surfacePositive,
  },
  pending: {
    color: surfaceTransparentWarning,
    background: surfaceWarning,
  },
  cancelled: {
    color: surfaceTransparentSecondary,
    background: surfaceSolidSecondary,
  },
  submitted: {
    color: surfaceTransparentSecondary,
    background: surfaceSolidSecondary,
  },
};

export const IconContainer = styled.div<{ status: RunStatus }>`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ status }) => colorsByType[status].background};
  border: 2px solid ${({ status }) => colorsByType[status].color};
  color: white;
`;
