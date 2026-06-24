import styled, { css } from "styled-components";
import { backgroundPrimary, surfaceNegative } from "@salutejs/sdds-themes/tokens";
import { addScrollbar, CellTextboxTitle } from "@salutejs/sdds-platform-ai";

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TabContent = styled.div`
  margin-top: 40px;
  height: 100%;
  padding: 0 0 20px 0;

  overflow: auto;
`;

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

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 50px;
`;

export const Tab = styled.div`
  margin: 20px 0 0 0;
`;

export const ScrollableTextboxTitle = styled(CellTextboxTitle)`
  height: 180px;
  width: 100%;
  overflow: auto;
  white-space: pre-wrap;
  ${addScrollbar("s")};
`;

export const CellContainer = styled.div`
  width: 100%;

  & > .cell-root > * > * {
    flex: 1 1 100%;
  }
`;
