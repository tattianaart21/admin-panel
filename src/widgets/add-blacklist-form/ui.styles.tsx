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
