import { StepItemProps, Steps } from "@salutejs/sdds-platform-ai";
import { IBenchVersionOut } from "@/entities/bench";

type BenchmarkVersionsProps = {
  currentVersion: number | null;
  versions: IBenchVersionOut[];
  onChange?: (version: number) => void;
};

function getMaxWidth(steps: number) {
  return `${steps > 10 ? "100%" : steps * 10}%`;
}

export function BenchmarkVersions(props: BenchmarkVersionsProps) {
  if (!props.versions || !props.currentVersion) {
    return null;
  }

  const steps: StepItemProps[] = props.versions.map((version, idx) => ({
    key: version.id,
    indicator: idx === props.versions.length - 1 ? "+" : version.version,
    status: version.version === props.currentVersion ? "active" : "completed",
  }));

  return (
    <Steps
      items={steps}
      onChange={(_, idx) => props.onChange?.(props.versions[idx].version)}
      style={{ maxWidth: getMaxWidth(steps.length) }}
    />
  );
}
