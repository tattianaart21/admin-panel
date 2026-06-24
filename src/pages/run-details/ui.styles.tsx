import styled from "styled-components";
import { backgroundPrimary } from "@salutejs/sdds-themes/tokens";
import { addScrollbar, Flow } from "@salutejs/sdds-platform-ai";

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
  width: 100%;
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;
  width: 100%;
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

export const CellGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

export const GIFContainer = styled.div`
  width: min(90vw, 1280px);
  min-height: 400px;
  position: relative;
  aspect-ratio: 16 / 9;
  overflow-y: auto;
  ${addScrollbar("s")};
  display: grid;
  place-items: center;

  & > img {
    width: 100%;
    display: block;
  }
`;

export const LoaderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
