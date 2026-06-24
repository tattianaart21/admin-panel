import styled from "styled-components";
import { backgroundPrimary } from "@salutejs/sdds-themes/tokens";
import { addScrollbar, CellTextboxTitle } from "@salutejs/sdds-platform-ai";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
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

export const Section = styled.div`
  border-radius: 40px;
  background: ${backgroundPrimary};
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
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

export const CellGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 80px;
`;

export const CellContainer = styled.div`
  min-width: 20%;
`;

export const ScrollableTextboxTitle = styled(CellTextboxTitle)`
  height: 180px;
  width: 100%;
  overflow: auto;
  white-space: pre-wrap;
  ${addScrollbar("s")};
`;
