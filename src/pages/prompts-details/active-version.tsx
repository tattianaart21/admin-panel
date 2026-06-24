import { IPromptOut, IPromptVersionOut } from "@/entities/prompt";
import * as UI from "./ui.styles";
import { formatDate } from "@/shared/lib/format-date";
import { Flow, Cell, CellTextbox, CellTextboxLabel } from "@salutejs/sdds-platform-ai";

const empty = "-----";

export function ActiveVersion({
  data,
  versions = [],
}: {
  data?: IPromptOut;
  versions?: IPromptVersionOut[];
}) {
  if (!data) return null;

  const version = versions[0] ?? data.current;

  return (
    <UI.Tab>
      <Flow
        orientation="horizontal"
        alignment="start"
        arrangement="spaceBetween"
        mainAxisGap={20}
        crossAxisGap={30}
        itemsPerLine={6}
        style={{ width: "100%" }}
      >
        <Cell
          label="Идентификатор промпта"
          title={version?.id.toString() ?? empty}
          stretching="auto"
        />
        <Cell
          label="Версия промпта"
          title={version?.version?.toString() ?? empty}
          stretching="auto"
        />
        <Cell
          label="Автор записи/Author"
          title={version?.author?.toString() ?? empty}
          stretching="auto"
        />
        <Cell
          label="Mетаданные/Meta"
          title={version?.meta ? JSON.stringify(version.meta, null, 2) : empty}
          stretching="auto"
        />
        <Cell
          label="Дата и время создания промпта/Created_at"
          title={version?.created_at ? formatDate(version.created_at) : empty}
          stretching="auto"
        />
        <Cell
          label="Мягкое удаление промпта/deleted_at"
          title={version?.deleted_at ? formatDate(version.deleted_at) : empty}
          stretching="auto"
        />
        <UI.CellContainer>
          <Cell stretching="filled" style={{ width: "100%" }}>
            <CellTextbox style={{ alignItems: "flex-start", flex: 1, width: "100%" }}>
              <CellTextboxLabel>{"Текст промпта/Content"}</CellTextboxLabel>
              <UI.ScrollableTextboxTitle>
                {data?.current?.content ?? empty}
              </UI.ScrollableTextboxTitle>
            </CellTextbox>
          </Cell>
        </UI.CellContainer>
      </Flow>
    </UI.Tab>
  );
}
