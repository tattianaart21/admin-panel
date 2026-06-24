import { IconCross, IconSearch } from "@salutejs/plasma-icons";
import { EmbedIconButton } from "@salutejs/sdds-platform-ai";
import * as UI from "./ui.styles";

type SearchBarProps = {
  onChange: (value: string) => void;
  value: string;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?(): void;
};

export function SearchBar({ value, onChange, onKeyUp, onClear }: SearchBarProps) {
  const clear = () => {
    onChange("");
    onClear?.();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <UI.StyledTextField
      onKeyUp={onKeyUp}
      value={value}
      onChange={onInputChange}
      placeholder="Искать..."
      enumerationType="plain"
      contentLeft={<IconSearch />}
      contentRight={
        value?.length > 0 ? (
          <EmbedIconButton onClick={clear}>
            <IconCross />
          </EmbedIconButton>
        ) : undefined
      }
    />
  );
}
