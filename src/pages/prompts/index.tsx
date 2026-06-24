import {
  IconCallIncomingFill,
  IconChartDistributionFill,
  IconClockCircleFill,
  IconDocumentFill,
  IconDownload,
  IconLineLinkFromto,
  IconPhone,
  IconPlus,
  IconSwapHorizCircFill,
  IconSwapVert,
} from "@salutejs/plasma-icons";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { EmbedIconButton, Flow, IconButton, Pagination } from "@salutejs/sdds-platform-ai";
import { Table, ColumnType } from "@/features/table";
import { IPromptOut, useCreatePrompt, usePrompts } from "@/entities/prompt";
import { PromptsHeader } from "@/widgets/prompts-header";
import { Modal, useModal } from "@/shared/ui/modal";
import { AddPromptKeyForm } from "@/widgets/add-prompt-key-form";
import { Route } from "@/routes/prompts";
import { usePagination } from "@/shared/lib/use-pagination";
import { useConfiguredToast } from "@/shared/lib/use-toast";
import { config } from "@/shared/lib/config";
import { downloadFile } from "@/shared/lib/download-file";
import { cleanParams } from "@/shared/lib/http-utils";

import * as UI from "./ui.styles";

export function PromptsPage() {
  const searchParams = useSearch({
    from: Route.fullPath,
  });
  const {
    search,
    limit = 13,
    offset = 0,
    include_deleted = false,
    order,
    dateFrom,
    dateTo,
  } = searchParams;
  const { data, isLoading, refetch } = usePrompts({
    limit,
    offset,
    order,
    sort: "id",
    include_deleted: Boolean(include_deleted),
    created_at_from: dateFrom,
    created_at_to: dateTo,
    search,
  });
  const addPrompt = useCreatePrompt();
  const prompts = data?.data ?? [];
  const flatData = prompts.map(({ current, ...rest }) => ({
    ...rest,
    current: current?.version ?? null,
  }));

  const navigate = useNavigate({ from: Route.fullPath });

  const { modalRef, show, hide } = useModal();
  const { showToast } = useConfiguredToast();

  const onSubmit = (form: IPromptOut) => {
    addPrompt.mutate(
      { ...form },
      {
        onSuccess: () => {
          showToast("Ключ создан");
          hide();
          refetch();
        },
      },
    );
  };

  const { hasPagination, page, pagesCount } = usePagination({
    limit,
    offset,
    total: data?.pagination.total ?? 0,
  });

  const changeSort = () =>
    navigate({
      search: (prev) => ({
        ...prev,
        order: prev.order === "asc" ? "desc" : "asc",
      }),
    });

  const onClickExport = () => {
    downloadFile(
      `${config.basUrl}/transfer_data/prompts/export?${cleanParams({ include_deleted, search, created_at_from: dateFrom, created_at_to: dateTo })}`,
      "",
    );
  };

  const columns: ColumnType<(typeof flatData)[number]>[] = [
    {
      key: "id",
      title: "Идентификатор",
      icon: <IconCallIncomingFill />,
    },
    {
      key: "key",
      title: "Ключ промпта",
      icon: <IconDocumentFill />,
    },
    {
      key: "description",
      title: "Описание",
      icon: <IconChartDistributionFill />,
    },
    {
      key: "system",
      title: "Системный",
      icon: <IconPhone />,
    },
    {
      key: "negative",
      title: "Негативный",
      icon: <IconSwapHorizCircFill />,
    },
    {
      key: "current",
      title: "Текущая версия",
      icon: <IconLineLinkFromto />,
    },
    {
      key: "deleted_at",
      title: "Дата удаления",
      icon: <IconClockCircleFill />,
      action: (
        <EmbedIconButton onClick={changeSort} view="default" style={{ color: "white" }}>
          <IconSwapVert color="inherit" />
        </EmbedIconButton>
      ),
    },
  ];

  return (
    <>
      <PromptsHeader
        value={{
          search,
          date: {
            dateFrom,
            dateTo,
          },
          includeDeleted: Boolean(include_deleted),
        }}
        onSearch={({ includeDeleted, search }) =>
          navigate({
            search: () => ({
              offset: 0,
              limit: 13,
              include_deleted: includeDeleted,
              search,
            }),
          })
        }
        extra={
          <Flow mainAxisGap={8} arrangement="start">
            <IconButton view="secondary" onClick={onClickExport}>
              <IconDownload />
            </IconButton>
            <IconButton view="accent" onClick={show}>
              <IconPlus />
            </IconButton>
          </Flow>
        }
      />
      <UI.Content>
        <Table<(typeof flatData)[number]>
          data={flatData}
          columns={columns}
          template="11% 13% 25% 11% 11% 11% 18%"
          loading={isLoading}
          onRowClick={(r) =>
            navigate({
              to: "/prompts/$promptId",
              params: { promptId: r.key.toString() },
            })
          }
        />
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
                    limit: limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
      </UI.Content>
      <Modal ref={modalRef} id="addPrompt">
        <AddPromptKeyForm onClose={hide} onSubmit={onSubmit} loading={addPrompt.isPending} />
      </Modal>
    </>
  );
}
