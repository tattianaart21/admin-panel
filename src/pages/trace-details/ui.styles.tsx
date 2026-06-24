import styled from "styled-components";
import { backgroundPrimary } from "@salutejs/sdds-themes/tokens";
import { addScrollbar, Flow } from "@salutejs/sdds-platform-ai";

export const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;

  /* &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none; */
  ${addScrollbar("s")}
`;

export const Section = styled.div`
  border-radius: 40px;
  background: ${backgroundPrimary};
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 30px;
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const TitleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  place-items: baseline start;
`;

export const CellGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 30px;
`;

export const CellContainer = styled.div`
  min-width: 20%;
`;

export const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 80px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const BreadcrumbsContainer = styled(Flow)`
  margin: 0 auto 30px 0;
`;
