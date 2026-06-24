import { useState } from "react";
import { Breadcrumbs, Cell, Flow, H2 } from "@salutejs/sdds-platform-ai/styled-components";
import { Navbar } from "@/features/navbar";
import { RunSelect } from "@/features/run-select";
import { Table as T, TableCell, HeaderCell } from "@/shared/ui/table";
import { useBenchmarkComparison } from "./model";
import * as UI from "./ui.styles";
import { IconLink } from "@salutejs/plasma-icons";
import { createLink } from "@tanstack/react-router";
import { Link } from "@/shared/ui/link";

const CellLink = createLink(Cell);
const breadcrumbItems = [
  { title: "Бенчмарки", href: "/benchmark" },
  { title: "Сравнение", isCurrent: true },
];

const template = "25% 37.5% 37.5%";

export function BenchmarkComparePage() {
  const [runAId, setRunAId] = useState<string | null>(null);
  const [runBId, setRunBId] = useState<string | null>(null);

  const { rows, isLoading } = useBenchmarkComparison(runAId, runBId);

  return (
    <>
      <UI.Header>
        <Navbar />
        <Flow mainAxisGap={16} arrangement="end">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content",
              gap: 16,
            }}
          >
            <Link to="/benchmark/runs">
              <Cell title="Запуски" contentRight={<IconLink size="xs" />} />
            </Link>
            <Link to="/benchmark/compare">
              <CellLink
                to="/benchmark/compare"
                title="Сравнение"
                contentRight={<IconLink size="xs" />}
              />
            </Link>
          </div>
        </Flow>
      </UI.Header>
      <UI.Content>
        <UI.BreadcrumbsContainer>
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>
        <H2>Выбор запусков для сравнения</H2>
        <UI.RunSelectors>
          <UI.SelectorGroup>
            <Cell title="Запуск A" />
            <RunSelect value={runAId ?? ""} onChange={setRunAId} />
          </UI.SelectorGroup>
          <UI.SelectorGroup>
            <Cell title="Запуск Б" />
            <RunSelect value={runBId ?? ""} onChange={setRunBId} />
          </UI.SelectorGroup>
        </UI.RunSelectors>
        <T.Table>
          <T.THeadRow template={template}>
            <T.THead>
              <HeaderCell title="Показатели" />
            </T.THead>
            <T.THead>
              <HeaderCell title="Запуск A" />
            </T.THead>
            <T.THead>
              <HeaderCell title="Запуск B" />
            </T.THead>
          </T.THeadRow>
          <T.TBody loading={isLoading}>
            {rows.map((row) => (
              <T.TRow key={row.key} template={template}>
                <T.Td>
                  <TableCell title={row.label} />
                </T.Td>
                <T.Td>
                  <TableCell title={row.runA} />
                </T.Td>
                <T.Td>
                  <TableCell title={row.runB} />
                </T.Td>
              </T.TRow>
            ))}
          </T.TBody>
        </T.Table>
      </UI.Content>
    </>
  );
}
