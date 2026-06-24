import { SearchHeader, SearchFormData } from "@/widgets/search-header";

type Props = {
  value: {
    search?: string;
    date: { dateFrom?: string; dateTo?: string };
  };
  onSearch: (formData: Required<SearchFormData>) => void;
  extra?: React.ReactNode;
};

export function TracesHeader(props: Props) {
  return (
    <SearchHeader
      value={{ ...props.value, includeDeleted: false }}
      onSearch={props.onSearch}
      extra={props.extra}
    />
  );
}
