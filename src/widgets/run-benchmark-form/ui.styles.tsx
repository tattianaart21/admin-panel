import { Flow } from "@salutejs/sdds-platform-ai";
import styled from "styled-components";

export const Container = styled.div`
  width: 1080px;
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: max-content;
  min-height: 650px;
`;

export const FullwidthFlow = styled(Flow)`
  width: 100%;
`;

export const ParamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
`;
