import {
  CellTextbox,
  Cell as CellLib,
  CellTextboxTitle,
  onDarkTextPrimary,
} from "@salutejs/sdds-platform-ai/styled-components";

export type OnDarkCellProps = {
  title: string;
  icon?: React.ReactNode;
  width?: number;
  contentRight?: React.ReactNode;
};

export function Cell({ title, icon, width, contentRight }: OnDarkCellProps) {
  return (
    <CellLib
      style={{ width: width ?? "initial" }}
      contentLeft={<div style={{ color: onDarkTextPrimary }}>{icon}</div>}
      contentRight={contentRight}
    >
      <CellTextbox style={{ alignItems: "flex-start", justifyContent: "center" }}>
        <CellTextboxTitle style={{ color: onDarkTextPrimary }}>{title}</CellTextboxTitle>
      </CellTextbox>
    </CellLib>
  );
}
