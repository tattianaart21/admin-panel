import { useCallback, useMemo } from "react";
import { Combobox } from "@salutejs/sdds-platform-ai";
import { useInfiniteRunList } from "@/entities/runs";

type Props = {
  value: string;
  onChange: (runId: string) => void;
};

export function RunSelect({ value, onChange }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteRunList();

  const items = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        page.data.map((run) => ({
          label: `${run.bench_name} (v${run.version}) — ${run.id}`,
          value: run.id,
        })),
      ),
    [data],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (isFetchingNextPage || !hasNextPage) return;

      const { scrollTop, offsetHeight, scrollHeight } = e.currentTarget;
      if (scrollTop + offsetHeight + 20 >= scrollHeight) {
        fetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <Combobox
      value={value}
      items={isLoading ? [] : items}
      onChange={(val) => {
        if (val) onChange(val);
      }}
      placeholder="Выберите запуск"
      listMaxHeight="400px"
      onScroll={handleScroll}
      afterList={isFetchingNextPage ? <center>Загружаю...</center> : undefined}
    />
  );
}
