import { SearchHeader, SearchFormData } from "@/widgets/search-header";

type Props = {
  value: {
    search?: string;
    date: { dateFrom?: string; dateTo?: string };
    includeDeleted?: boolean;
  };
  onSearch: (formData: Required<SearchFormData>) => void;
  extra: React.ReactNode;
};

export function Header(props: Props) {
  return (
    <SearchHeader
      value={props.value}
      onSearch={props.onSearch}
      extra={props.extra}
      showDeletedSwitch
    />
  );
}
