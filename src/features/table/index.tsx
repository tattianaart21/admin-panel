import { useMemo, useRef, useState, Fragment } from "react";
import { formatDate } from "@/shared/lib/format-date";
import { HeaderCell, TableCell, Table as T } from "@/shared/ui/table";
import { Tooltip } from "@/shared/ui/tooltip";
import { IconClose, IconDone, IconChevronDown } from "@salutejs/plasma-icons";
import { Checkbox, LineSkeleton } from "@salutejs/sdds-platform-ai";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Empty } from "@/shared/ui/empty";
import { IconContainer, ExpandChevron, StickyHead } from "./ui.styles";

type TableProps<TData> = {
  data: TData[];
  columns: {
    key: keyof TData;
    title: string;
    url?: string;
    icon?: React.ReactNode;
    tooltip?: string;
    action?: React.ReactNode;
    width?: number;
    isTimestamp?: boolean;
    isStatus?: boolean;
    maxCharacters?: number;
    renderCell?: (row: TData) => React.ReactNode;
  }[];
  template?: string;
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  getRowId?: (row: TData) => string;
  renderRowChildren?: (row: TData) => React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
};

export type ColumnType<TData> = TableProps<TData>["columns"][number];

function renderCellContent(
  content: string | number | boolean | Record<string, string> | undefined,
) {
  if (content === undefined || content === null) {
    return "-";
  }

  if (typeof content === "boolean") {
    return content ? "Да" : "Нет";
  }

  if (typeof content === "object") {
    return JSON.stringify(content, null, 2);
  }

  return `${content}`;
}

export function renderStatusIcon(status: string) {
  const isError = status.startsWith("fail") || status === "browser_fail" || status === "unknown";
  return (
    <IconContainer isError={isError}>
      {isError ? <IconClose size="xs" /> : <IconDone size="xs" />}
    </IconContainer>
  );
}

export function Table<T extends Record<string | number, unknown>>(props: TableProps<T>) {
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const hasChildrenRenderer = !!props.renderRowChildren;

  const toggleRowExpand = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const allSelected =
    props.selectable && props.data.length > 0
      ? Object.keys(rowSelection).length === props.data.length
      : false;

  const someSelected = props.selectable
    ? Object.keys(rowSelection).length > 0 && !allSelected
    : false;

  const allSelectedRef = useRef(allSelected);
  const someSelectedRef = useRef(someSelected);
  const expandedRowIdsRef = useRef(expandedRowIds);
  const dataRef = useRef(props.data);
  const getRowIdRef = useRef(props.getRowId);
  allSelectedRef.current = allSelected;
  someSelectedRef.current = someSelected;
  expandedRowIdsRef.current = expandedRowIds;
  dataRef.current = props.data;
  getRowIdRef.current = props.getRowId;

  const columns: ColumnDef<T>[] = useMemo(
    () =>
      props.columns.map(
        (col, index): ColumnDef<T> => ({
          accessorKey: col.key as string,
          header: () => {
            if (index === 0 && props.selectable) {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Checkbox
                    checked={allSelectedRef.current}
                    indeterminate={someSelectedRef.current}
                    onChange={() => {
                      if (!allSelectedRef.current) {
                        const all: Record<string, boolean> = {};
                        dataRef.current.forEach((row, idx) => {
                          all[getRowIdRef.current?.(row) ?? String(idx)] = true;
                        });
                        setRowSelection(all);
                      } else {
                        setRowSelection({});
                      }
                    }}
                  />
                  <Tooltip text={col.tooltip}>
                    <HeaderCell title={col.title} icon={col.icon} contentRight={col.action} />
                  </Tooltip>
                </div>
              );
            }

            return (
              <Tooltip text={col.tooltip}>
                <HeaderCell title={col.title} icon={col.icon} contentRight={col.action} />
              </Tooltip>
            );
          },
          cell: ({ row }) => {
            if (col.renderCell) {
              return col.renderCell(row.original);
            }

            const isFirstColumn = index === 0;
            const isExpanded = expandedRowIdsRef.current.has(row.id);

            return (
              <TableCell
                title={
                  col.isTimestamp
                    ? formatDate(renderCellContent(row.original[col.key] as string))
                    : renderCellContent(row.original[col.key] as string)
                }
                maxCharacters={col.maxCharacters ?? 30}
                width={col.width}
                contentLeft={
                  <>
                    {isFirstColumn && props.selectable && (
                      <Checkbox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {isFirstColumn && hasChildrenRenderer && (
                      <ExpandChevron
                        isExpanded={isExpanded}
                        onClick={(e) => toggleRowExpand(row.id, e)}
                      >
                        <IconChevronDown />
                      </ExpandChevron>
                    )}
                    {col.isStatus
                      ? renderStatusIcon(row.original[col.key] as "fail" | "success")
                      : undefined}
                  </>
                }
              />
            );
          },
        }),
      ),
    [props.columns, props.selectable, hasChildrenRenderer],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    columns,
    data: props.data,
    getCoreRowModel: useMemo(() => getCoreRowModel(), []),
    ...(props.getRowId && { getRowId: props.getRowId }),
    ...(props.selectable && {
      enableRowSelection: true,
      state: { rowSelection },
      onRowSelectionChange: (updater) => {
        const next = typeof updater === "function" ? updater(rowSelection) : updater;
        setRowSelection(next);
        if (props.onSelectionChange) {
          const selectedRows = props.data.filter(
            (row, idx) => next[props.getRowId?.(row) ?? String(idx)] ?? false,
          );
          props.onSelectionChange(selectedRows);
        }
      },
    }),
  });

  return (
    <T.Table>
      <StickyHead>
        {table.getHeaderGroups().map((hg) => (
          <T.THeadRow key={hg.id} template={props.template}>
            {hg.headers.map((h) => {
              return (
                <T.THead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </T.THead>
              );
            })}
          </T.THeadRow>
        ))}
      </StickyHead>
      <tbody>
        {props.loading && (
          <>
            {Array(13)
              .fill(0)
              .map((_, idx) => (
                <T.TRow key={idx} template="1fr">
                  <T.Td>
                    <LineSkeleton size="bodyL" key={idx} />
                  </T.Td>
                </T.TRow>
              ))}
          </>
        )}
        {!props.loading && props.data.length === 0 && <Empty />}
        {table.getRowModel().rows.map((row) => {
          const isExpanded = expandedRowIds.has(row.id);
          return (
            <Fragment key={row.id}>
              <T.TRow
                key={row.id}
                onClick={() => props.onRowClick?.(row.original)}
                template={props.template}
                interactive={props.onRowClick !== undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <T.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </T.Td>
                  );
                })}
              </T.TRow>
              {hasChildrenRenderer && isExpanded && (
                <T.TRow key={`${row.id}-children`} template={props.template}>
                  <T.Td colSpan={props.columns.length}>
                    {props.renderRowChildren?.(row.original)}
                  </T.Td>
                </T.TRow>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </T.Table>
  );
}
