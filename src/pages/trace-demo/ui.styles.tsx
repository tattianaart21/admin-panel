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
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
`;

export const BreadcrumbsContainer = styled(Flow)`
  margin: 0 auto 30px 0;
  width: 100%;
`;

export const TabsWrap = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const SegmentRow = styled.div<{ $highlighted?: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 8px;
  background: ${({ $highlighted }) =>
    $highlighted ? "rgba(41, 128, 255, 0.08)" : "transparent"};
  outline: ${({ $highlighted }) => ($highlighted ? "2px solid #2980FF" : "none")};
`;
