import { useState } from "react";
import { createLink, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  BodyM,
  Breadcrumbs,
  Cell,
  Flow,
  H2,
  IconButton,
  Pagination,
  RectSkeleton,
} from "@salutejs/sdds-platform-ai/styled-components";
import {
  IconCallIncomingFill,
  IconDocumentFill,
  IconClockCircleFill,
  IconSwapHorizCircFill,
  IconChartDistributionFill,
  IconClose,
  IconDownload,
  IconLink,
} from "@salutejs/plasma-icons";
import { Navbar } from "@/features/navbar";
import { ColumnType, Table } from "@/features/table";
import { usePagination } from "@/shared/lib/use-pagination";
import { Route } from "@/routes/benchmark/runs/$runId";
import { useModal, Modal } from "@/shared/ui/modal";
import { config } from "@/shared/lib/config";
import { downloadFile } from "@/shared/lib/download-file";
import { Link } from "@/shared/ui/link";
import { useRunDetailsData } from "./model";
import * as UI from "./ui.styles";

type RowType = import("@/entities/runs").IBenchTaskRun;

const getS3Url = (path: string) => `${config.tracesUrl}/s3/file/${path}`;
const CellLink = createLink(Cell);

export function RunDetailsPage() {
  const { runId } = useParams({ from: Route.fullPath });
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.fullPath });
  const { limit = 20, offset = 0 } = search;
  const { modalRef, show, hide } = useModal();
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [gifLoading, setGifLoading] = useState(false);

  const { run, tasks } = useRunDetailsData({ runId, limit, offset });
  const runData = run.data;
  const rows = tasks.data;
  const total = tasks.total;

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total,
  });

  const breadcrumbItems = [
    { title: "Бенчмарки", href: "/benchmark" },
    { title: "Запуски", href: "/benchmark/runs" },
    { title: runData ? `Запуск ${runData.id.slice(0, 8)}...` : "...", isCurrent: true },
  ];

  const columns: ColumnType<RowType>[] = [
    { key: "task_id", title: "ID таски", icon: <IconCallIncomingFill /> },
    { key: "task_web_name", title: "Web имя", icon: <IconDocumentFill /> },
    {
      key: "duration_seconds",
      title: "Длительность (с)",
      icon: <IconClockCircleFill />,
    },
    {
      key: "numb_steps",
      title: "Шаги",
      icon: <IconChartDistributionFill />,
    },
    {
      key: "success",
      title: "Результат",
      isStatus: true,
      icon: <IconSwapHorizCircFill />,
    },
    {
      key: "history_json_url",
      title: "Скачать JSON",
      icon: <IconDownload />,
      renderCell: (row) => (
        <IconButton
          view="secondary"
          size="s"
          onClick={(e) => {
            e.stopPropagation();
            downloadFile(getS3Url(row.history_json_url), "");
          }}
        >
          <IconDownload />
        </IconButton>
      ),
    },
  ];

  if (run.isLoading) {
    return <div>Loading...</div>;
  }

  if (!runData) {
    return (
      <UI.NotFound>
        <H2>Запуск не найден</H2>
      </UI.NotFound>
    );
  }

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
        <UI.BreadcrumbsContainer alignment="start" arrangement="center">
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>
        <UI.Section>
          <H2 bold style={{ margin: "0 0 24px 0" }}>
            {runData.bench_name}
          </H2>
          <UI.CellGrid>
            {runData.effective_config.map((item) => (
              <UI.CellContainer key={item.param_key}>
                <Cell
                  label={item.param_key}
                  title={item.value !== undefined ? `${item.value}` : "-"}
                  stretching="auto"
                />
              </UI.CellContainer>
            ))}
          </UI.CellGrid>
        </UI.Section>
        <Table<RowType>
          data={rows}
          columns={columns}
          template="15% 20% 15% 25% 15% 10%"
          loading={tasks.api.isLoading}
          onRowClick={(row) => {
            setSelectedGif(row.gif_url);
            setGifLoading(true);
            show();
          }}
        />
        {!tasks.api.isLoading && tasks.total === 0 && <BodyM>Нет задач</BodyM>}
        {hasPagination && (
          <UI.PaginationContainer>
            <Pagination
              size="m"
              type="compact"
              singleLine
              hasPerPage={false}
              hasQuickJump={false}
              slots={9}
              count={pagesCount}
              value={page}
              onChange={(page) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    offset: page ? (page - 1) * Number(limit) : prev.offset,
                    limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
      </UI.Content>
      <Modal ref={modalRef} id="gifPlayer">
        <UI.Section>
          <IconButton
            style={{ margin: "0 0 10px auto" }}
            view="clear"
            onClick={() => {
              hide();
              setSelectedGif(null);
            }}
          >
            <IconClose />
          </IconButton>
          <UI.GIFContainer>
            {selectedGif === null && <H2 style={{ margin: "auto auto" }}>Нет записи</H2>}
            {selectedGif !== null && gifLoading && (
              <RectSkeleton width="100%" height="100%" style={{ aspectRatio: "16/9" }} />
            )}
            {selectedGif && (
              <img
                src={getS3Url(selectedGif)}
                alt="agent session gif"
                onLoad={() => setGifLoading(false)}
                onError={() => setGifLoading(false)}
                style={{ display: gifLoading ? "none" : "block" }}
              />
            )}
          </UI.GIFContainer>
        </UI.Section>
      </Modal>
    </>
  );
}
