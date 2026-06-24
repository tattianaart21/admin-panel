import styled from "styled-components";

export const Container = styled.div`
  max-width: 1920px;
  width: 100%;
  height: 100vh;
  padding: 40px;
  margin: 0 auto;
  overflow: hidden;
  display: grid;
  grid-template-rows: 64px 1fr;
  grid-template-columns: auto;
  gap: 30px;
`;
