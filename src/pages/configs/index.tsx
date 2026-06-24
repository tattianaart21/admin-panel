import {
  IconChartDistributionFill,
  IconClockCircleFill,
  IconDocumentFill,
  IconLineLinkFromto,
  IconPlus,
  IconSwapVert,
} from "@salutejs/plasma-icons";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { EmbedIconButton, Flow, IconButton, Pagination } from "@salutejs/sdds-platform-ai";
import { ColumnType, Table } from "@/features/table";
import { IConfigCreate, useConfigList, useCreateConfig } from "@/entities/config";
import { ConfigsHeader } from "@/widgets/configs-header";
import { Modal, useModal } from "@/shared/ui/modal";
import { AddConfigForm } from "@/widgets/add-config-form";
import { Route } from "@/routes/configs";
import { usePagination } from "@/shared/lib/use-pagination";
import { useConfiguredToast } from "@/shared/lib/use-toast";

import * as UI from "./ui.styles";

export function ConfigsPage() {
  const searchParams = useSearch({ from: Route.fullPath });
  const { search, limit = 13, offset = 0, include_deleted = false, order } = searchParams;
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isLoading } = useConfigList({
    limit,
    offset,
    order,
    sort: "name",
    include_deleted: Boolean(include_deleted),
    search: search ?? "",
  });

  const { modalRef, show, hide } = useModal();
  const createApi = useCreateConfig();
  const { showToast } = useConfiguredToast();

  const onSubmit = (form: IConfigCreate) => {
    createApi.mutate(form, {
      onSuccess: () => {
        showToast("Конфиг создан");
        hide();
      },
    });
  };

  const configs = data?.data ?? [];
  const flatData = configs.map(({ active_version, ...rest }) => ({
    ...rest,
    active_version: active_version?.version ?? null,
    params_count: active_version?.params?.length ?? 0,
  }));

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

  const columns: ColumnType<(typeof flatData)[number]>[] = [
    {
      key: "name",
      title: "Название",
      icon: <IconDocumentFill />,
    },
    {
      key: "active_version",
      title: "Активная версия",
      icon: <IconLineLinkFromto />,
    },
    {
      key: "params_count",
      title: "Параметров",
      icon: <IconChartDistributionFill />,
    },
    {
      key: "created_at",
      title: "Дата создания",
      icon: <IconClockCircleFill />,
      isTimestamp: true,
    },
    {
      key: "updated_at",
      title: "Последнее изменение",
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
      <ConfigsHeader
        value={{
          search,
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
          template="25% 15% 12% 24% 24%"
          loading={isLoading}
          onRowClick={(row) =>
            navigate({
              to: "/configs/$configId",
              params: { configId: row.id },
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
                    limit,
                  }),
                })
              }
            />
          </UI.PaginationContainer>
        )}
        <Modal ref={modalRef} id="addConfig">
          <AddConfigForm onClose={hide} onSubmit={onSubmit} loading={createApi.isPending} />
        </Modal>
      </UI.Content>
    </>
  );
}
