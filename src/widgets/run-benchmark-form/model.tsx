import { Combobox, Switch, TextField } from "@salutejs/sdds-platform-ai/styled-components";

type Props = {
  type: "string" | "number" | "combo" | "boolean";
  value: string | number | boolean | null | undefined;
  data: string[];
  label?: string;
  onChange: (value: string | number | boolean) => void;
};

export function FormInputFactory({ type, value, data, label, onChange }: Props) {
  const isNumber = type === "number";
  const isString = type === "string";
  const isBoolean = type === "boolean";

  if (isBoolean) {
    return (
      <Switch
        checked={value as boolean}
        onChange={(e) => onChange(e.target.checked)}
        label={label}
      />
    );
  }

  if (isNumber || isString) {
    return (
      <TextField
        value={value as string | number}
        onChange={(e) => onChange(isNumber ? Number(e.target.value) : e.target.value)}
        placeholder={label}
        type={isNumber ? "number" : "text"}
        label={label}
      />
    );
  }

  if (type) {
    return (
      <Combobox
        items={data.map((item) => ({ label: item, value: item }))}
        value={value as string}
        onChange={(value: string) => onChange(value)}
        placeholder={label}
        label={label}
      />
    );
  }

  return <TextField />;
}
