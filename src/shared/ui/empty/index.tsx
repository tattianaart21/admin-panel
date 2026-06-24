import { BodyM } from "@salutejs/sdds-platform-ai";
import { Container } from "./ui.styles";

export function Empty() {
  return (
    <Container>
      <td>
        <BodyM>Нет данных</BodyM>
      </td>
    </Container>
  );
}
