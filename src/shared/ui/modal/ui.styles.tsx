import styled from "styled-components";
import { surfaceTransparentDeep } from "@salutejs/sdds-themes/tokens";

export const Dialog = styled.dialog`
  border: none;
  background: transparent;
  outline: none;
  overflow: visible;

  &::backdrop {
    background-color: ${surfaceTransparentDeep};
  }
`;
