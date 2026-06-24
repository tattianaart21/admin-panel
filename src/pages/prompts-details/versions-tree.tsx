import { IPromptOut, IPromptVersionOut } from "@/entities/prompt";
import { formatDate } from "@/shared/lib/format-date";
import { Steps, StepItemProps } from "@salutejs/sdds-platform-ai";
import { Tab } from "./ui.styles";

type Props = {
  data: IPromptOut;
  versions?: IPromptVersionOut[];
  onChange?: (version?: number) => void;
};

export function VersionsTree({ data, versions = [], onChange }: Props) {
  if (!data) {
    return null;
  }

  const steps: StepItemProps[] = versions.map((version) => ({
    key: version.id,
    indicator: version.version,
    title: `ID: ${version.id}${version.deleted_at ? " (Удалена)" : ""}`,
    content: formatDate(version.created_at),
    status: version.id === data.current?.id ? "active" : "completed",
  }));

  return (
    <Tab style={{ marginTop: 90, marginBottom: -30, height: 230 }}>
      <Steps items={steps} onChange={(_, idx) => onChange?.(versions[idx].version)} />
    </Tab>
  );
}
