import styled from "styled-components";
import { backgroundPrimary } from "@salutejs/sdds-themes/tokens";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  padding: 20px 0;
  gap: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  overflow: hidden;
`;

export const Scrollable = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  margin-top: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const BreadcrumbsContainer = styled.div`
  margin: 0 auto 30px 0;
`;

export const ModelBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 12px;
`;

export const ExtraParamsSection = styled.div`
  margin-bottom: 12px;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const MessageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
`;

export const Section = styled.div`
  border-radius: 40px;
  background: ${backgroundPrimary};
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
`;

export const ContentPartContainer = styled.div`
  margin-top: 12px;
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
