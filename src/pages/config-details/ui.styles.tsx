import styled, { css } from "styled-components";
import { backgroundPrimary, surfaceNegative } from "@salutejs/sdds-themes/tokens";

export const Section = styled.div<{ isError?: boolean }>`
  border-radius: 40px;
  background: ${backgroundPrimary};
  padding: 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  &::before {
    transition: opacity 0.3s ease;
    opacity: 0;
  }

  ${(props) =>
    props.isError &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid ${surfaceNegative};
        border-radius: inherit;
        opacity: 1;
      }
    `}
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto max-content;
  align-items: center;
  gap: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ConfigDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 15%) auto;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;
