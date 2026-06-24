import { IConfigOut } from "@/entities/config";
import { IconClose } from "@salutejs/plasma-icons";
import { Combobox, IconButton } from "@salutejs/sdds-platform-ai";

type Props = {
  value: string;
  defaultValue?: string;
  configs?: IConfigOut[];
  onChange: (value: IConfigOut) => void;
  onSearch: (value: string) => void;
  onClear?: () => void;
};

export function BenchmarkSelect(props: Props) {
  const configs = props.configs ?? [];
  const items = configs.map((item) => ({ label: item.name, value: item.id }));
  const onChange = (value: string) => {
    const config = configs.find((item) => item.id === value);

    if (config) {
      props.onChange(config);
    }
  };

  return (
    <Combobox
      value={props.value === "" ? props.defaultValue : props.value}
      items={items}
      onChange={onChange}
      placeholder="Выберите конфиг из списка"
      onChangeValue={props.onSearch}
      contentRight={
        <IconButton size="xs" view="clear" onClick={props.onClear}>
          <IconClose />
        </IconButton>
      }
    />
  );
}
