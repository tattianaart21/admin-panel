import styled from "styled-components";
import { addScrollbar, CellTextboxTitle, Flow } from "@salutejs/sdds-platform-ai";
import { backgroundPrimary } from "@salutejs/sdds-themes/tokens";

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const BreadcrumbsContainer = styled(Flow)`
  margin: 0 auto 30px 0;
`;

export const Section = styled.section`
  border-radius: 40px;
  background: ${backgroundPrimary};
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const CellGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

export const UserQueryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto;
  gap: 10px;
`;

export const UserQueryResponseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto auto auto;
  gap: 10px;
`;

export const CellContainer = styled.div``;

export const ScrollingTextboxTitle = styled(CellTextboxTitle)`
  max-height: 250px;
  overflow: auto;
  ${addScrollbar("s")};
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ActionCard = styled.div`
  border-radius: 8px;
  padding: 1rem;
`;

export const ActionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const ActionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  pre {
    white-space: pre-wrap;
    padding: 0.5rem;
    border-radius: 4px;
    margin-top: 0.25rem;
  }
`;

export const ErrorContainer = styled.div``;

export const LinkContainer = styled.div`
  margin-top: 1rem;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

export const NotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
`;
