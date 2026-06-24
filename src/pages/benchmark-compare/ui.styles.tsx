import styled from "styled-components";

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto max-content;
  align-items: center;
  gap: 8px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const RunSelectors = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

export const SelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
