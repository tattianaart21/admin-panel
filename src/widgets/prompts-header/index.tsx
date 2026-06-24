import { SearchHeader, SearchFormData } from "@/widgets/search-header";

type Props = {
  value: {
    search?: string;
    date: { dateFrom?: string; dateTo?: string };
    includeDeleted?: boolean;
  };
  extra?: React.ReactNode;
  onSearch: (formData: Required<SearchFormData>) => void;
};

export function PromptsHeader(props: Props) {
  return (
    <SearchHeader
      value={props.value}
      onSearch={props.onSearch}
      extra={props.extra}
      showDeletedSwitch
    />
  );
}
