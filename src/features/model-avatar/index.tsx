import { Avatar } from "@salutejs/sdds-platform-ai";
import { getModelAbbreviation, getModelFamilyColor } from "./utils";
import * as UI from "./ui.styles";

type Props = {
  modelName: string;
  size?: "xs" | "s" | "m";
  showName?: boolean;
};

const SIZE_MAP = { xs: "s" as const, s: "s" as const, m: "m" as const };

export function ModelAvatar({ modelName, size = "s", showName = false }: Props) {
  const abbr = getModelAbbreviation(modelName);
  const color = getModelFamilyColor(modelName);

  return (
    <UI.Row>
      <UI.ColorRing $color={color}>
        <Avatar size={SIZE_MAP[size]} name={abbr} />
      </UI.ColorRing>
      {showName && <UI.Name title={modelName}>{modelName}</UI.Name>}
    </UI.Row>
  );
}

/** Алиас для таблицы циклов */
export function ModelNameWithAvatar({ modelName }: { modelName: string }) {
  return <ModelAvatar modelName={modelName} showName />;
}
