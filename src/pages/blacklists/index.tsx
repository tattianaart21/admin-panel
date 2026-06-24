import { useNavigate, useSearch } from "@tanstack/react-router";
import { EmbedIconButton, IconButton, Flow, Pagination } from "@salutejs/sdds-platform-ai";
import {
  IconDownload,
  IconRefresh,
  IconSwapVert,
  IconCallIncomingFill,
  IconPlus,
  IconChartDistributionFill,
  IconClockCircleFill,
  IconDocumentFill,
  IconPhone,
  IconSwapHorizCircFill,
} from "@salutejs/plasma-icons";
import { Route } from "@/routes/blacklist";
import { ColumnType, Table } from "@/features/table";
import {
  IBlacklistCreate,
  IGetBlacklistResponse,
  useBlacklists,
  useCreateBlacklist,
} from "@/entities/blacklist";
import { Header } from "@/widgets/blacklist-header";
import { usePagination } from "@/shared/lib/use-pagination";
import { Modal, useModal } from "@/shared/ui/modal";
import { AddBlacklistForm } from "@/widgets/add-blacklist-form";
import { useConfiguredToast } from "@/shared/lib/use-toast";
import { config } from "@/shared/lib/config";
import { downloadFile } from "@/shared/lib/download-file";
import { cleanParams } from "@/shared/lib/http-utils";

import * as UI from "./ui.styles";

export function BlacklistsPage() {
  const search = useSearch({
    from: Route.fullPath,
  });
  const { include_deleted, dateFrom, dateTo, sort, order, limit = 13, offset = 0 } = search;

  const navbarValue = {
    search: search.search,
    includeDeleted: Boolean(include_deleted),
    date: {
      dateFrom,
      dateTo,
    },
  };

  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isLoading, refetch } = useBlacklists({
    include_deleted: include_deleted,
    sort: sort ?? "id",
    order: order ?? "desc",
    limit,
    offset,
    created_at_from: dateFrom,
    created_at_to: dateTo,
    search: search.search,
  });

  const { modalRef, show, hide } = useModal();
  const createApi = useCreateBlacklist();
  const { showToast } = useConfiguredToast();

  const onSubmit = (form: IBlacklistCreate) => {
    createApi.mutate(
      { ...form },
      {
        onSuccess: () => {
          hide();
          refetch();
          showToast("Запись создана");
        },
      },
    );
  };

  const rows = data?.data ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
  };

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total: pagination.total,
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
      `${config.basUrl}/transfer_data/blacklist/export?${cleanParams({ include_deleted, search: search.search, created_at_from: dateFrom, created_at_to: dateTo })}`,
      "",
    );
  };

  const columns: ColumnType<IGetBlacklistResponse["data"][number]>[] = [
    {
      key: "id",
      title: "Идентификатор",
      icon: <IconCallIncomingFill />,
    },
    {
      key: "name",
      title: "Название",
      icon: <IconDocumentFill />,
    },
    {
      key: "url",
      title: "Ссылка",
      icon: <IconChartDistributionFill />,
    },
    {
      key: "description",
      title: "Описание/Причина",
      icon: <IconPhone />,
    },
    {
      key: "author",
      title: "Автор записи",
      icon: <IconSwapHorizCircFill />,
    },
    {
      key: "created_at",
      title: "Дата создания",
      icon: <IconClockCircleFill />,
      isTimestamp: true,
      action: (
        <EmbedIconButton onClick={changeSort} view="default" style={{ color: "white" }}>
          <IconSwapVert color="inherit" />
        </EmbedIconButton>
      ),
    },
  ];

  return (
    <>
      <Header
        value={navbarValue}
        onSearch={({ includeDeleted, date, search }) =>
          navigate({
            search: () => ({
              offset: 0,
              limit: 13,
              include_deleted: includeDeleted,
              dateFrom: date.dateFrom,
              dateTo: date.dateTo,
              search,
            }),
          })
        }
        extra={
          <Flow mainAxisGap={8} arrangement="start">
            <IconButton view="secondary" onClick={onClickExport}>
              <IconDownload />
            </IconButton>
            <IconButton view="black" disabled>
              <IconRefresh />
            </IconButton>
            <IconButton view="accent" onClick={show}>
              <IconPlus />
            </IconButton>
          </Flow>
        }
      />
      <UI.Content>
        <Table<IGetBlacklistResponse["data"][number]>
          data={rows}
          columns={columns}
          template="10.68% 11.76% 21.37% 27.78% 11.76% 16.67%"
          loading={isLoading}
          onRowClick={(row) =>
            navigate({
              to: "/blacklist/$blacklistId",
              params: { blacklistId: row.id.toString() },
              search: {
                include_deleted: Boolean(row.deleted_at),
              },
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
        <Modal ref={modalRef} id="addBlacklist">
          <AddBlacklistForm onClose={hide} onSubmit={onSubmit} loading={createApi.isPending} />
        </Modal>
      </UI.Content>
    </>
  );
}
