import { Flow } from "@salutejs/sdds-platform-ai";
import styled from "styled-components";

export const Container = styled.div`
  width: 720px;
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: max-content;
`;

export const FullwidthFlow = styled(Flow)`
  width: 100%;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  width: 100%;
`;
