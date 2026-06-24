import { addScrollbar } from "@salutejs/sdds-platform-ai";
import styled from "styled-components";

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto max-content;
  align-items: center;
  gap: 8px;
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  overflow: auto;
  ${addScrollbar("s")};
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px 0;
`;
