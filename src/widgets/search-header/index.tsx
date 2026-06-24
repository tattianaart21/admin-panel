import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flow, Switch } from "@salutejs/sdds-platform-ai/styled-components";

import { Navbar } from "@/features/navbar";
import { SearchBar } from "@/shared/ui/search-bar";

import * as UI from "./ui.styles";

export type SearchFormData = {
  search: string;
  includeDeleted: boolean;
  date: { dateFrom?: string; dateTo?: string };
};

type Props = {
  value: {
    search?: string;
    includeDeleted?: boolean;
    date?: { dateFrom?: string; dateTo?: string };
  };
  onSearch: (formData: Required<SearchFormData>) => void;
  extra?: React.ReactNode;
  showDeletedSwitch?: boolean;
};

export function SearchHeader(props: Props) {
  const { search = "", includeDeleted = false, date } = props.value;

  const formRef = useRef<HTMLFormElement>(null);
  const formApi = useForm<Required<SearchFormData>>({
    defaultValues: {
      search,
      includeDeleted,
      date: date ?? { dateFrom: undefined, dateTo: undefined },
    },
    mode: "onChange",
  });

  const onSubmit = (data: SearchFormData) => {
    props.onSearch({ ...data, date: data.date ?? date ?? { dateFrom: undefined, dateTo: undefined } });
  };

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitManually();
    }
  };

  return (
    <UI.Header>
      <Navbar />
      <form ref={formRef} onSubmit={formApi.handleSubmit(onSubmit)}>
        <Flow mainAxisGap={8} alignment="center" arrangement="end">
          {props.showDeletedSwitch && (
            <Controller
              name="includeDeleted"
              control={formApi.control}
              render={({ field }) => (
                <Switch
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    submitManually();
                  }}
                  checked={field.value}
                  label="Удаленные"
                  labelPosition="after"
                />
              )}
            />
          )}

          <Controller
            name="search"
            control={formApi.control}
            render={({ field }) => (
              <SearchBar {...field} onKeyUp={handleEnter} onClear={submitManually} />
            )}
          />
        </Flow>
      </form>
      {props.extra}
    </UI.Header>
  );
}
