import { Cell } from "@salutejs/sdds-platform-ai";
import {
  surfaceSolidPrimary,
  surfaceSolidCard,
  onDarkTextPrimary,
  textPrimary,
  textAccent,
} from "@salutejs/sdds-themes/tokens";
import styled, { css } from "styled-components";

export const Table = styled.table`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-collapse: collapse;
  position: relative;
`;
export const THead = styled.th`
  padding: 16px;
  background: ${textPrimary};
  color: ${onDarkTextPrimary};

  &:first-of-type {
    border-top-left-radius: 1.75rem;
    border-bottom-left-radius: 1.75rem;
  }

  &:last-of-type {
    border-top-right-radius: 1.75rem;
    border-bottom-right-radius: 1.75rem;
  }
`;

export const TCell = styled(Cell)`
  &[data-hovered="true"] {
    cursor: copy;
  }
`;

export const TBody = styled.tbody<{ loading?: boolean }>`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: rgba(122, 122, 122, 0.3);
    border-radius: 1.75rem;
    pointer-events: initial;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  ${(props) =>
    props.loading &&
    css`
      &::after {
        opacity: 1;
        pointer-events: none;
      }
    `}
`;

export const Td = styled.td`
  padding: 16px;

  @media screen and (width <= 1920px) {
    padding: 8px;
  }
  display: grid;
  place-items: center;
`;
export const TRowBase = styled.tr<{ template?: string }>`
  display: grid;
  ${(props) =>
    props.template
      ? css`
          grid-template-columns: ${props.template};
        `
      : css`
          grid-auto-flow: column;
        `}
  grid-template-rows: auto;
`;

export const TRow = styled(TRowBase)<{ interactive?: boolean }>`
  &:nth-of-type(even) {
    background: ${surfaceSolidPrimary};
  }

  &:nth-of-type(odd) {
    background: ${surfaceSolidCard};
  }

  &:first-of-type {
    border-radius: 1.75rem 1.75rem 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 1.75rem 1.75rem;
  }

  &:hover {
    background: ${textAccent};
    cursor: ${(props) => (props.interactive ? "pointer" : "default")};
  }
`;

export const CellContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  position: relative;
`;

export const CopyAction = styled.div`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
`;

export const THeadRow = styled(TRowBase)``;
