import { SearchHeader, SearchFormData } from "@/widgets/search-header";

type Props = {
  value: {
    search?: string;
    includeDeleted?: boolean;
  };
  extra?: React.ReactNode;
  onSearch: (formData: Required<SearchFormData>) => void;
};

export function ConfigsHeader(props: Props) {
  return (
    <SearchHeader
      value={props.value}
      onSearch={props.onSearch}
      extra={props.extra}
      showDeletedSwitch
    />
  );
}
