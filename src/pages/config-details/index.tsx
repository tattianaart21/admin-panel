import { useMemo } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { IconEdit } from "@salutejs/plasma-icons";
import { Button, Cell, Flow, H2, H4, Pagination } from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";

import { Route } from "@/routes/configs/$configId";
import { formatDate } from "@/shared/lib/format-date";
import { ColumnType, Table } from "@/features/table";
import { usePagination } from "@/shared/lib/use-pagination";
import { Modal, useModal } from "@/shared/ui/modal";
import { AddParamForm } from "@/widgets/add-param-form";
import { useConfigDetailsData } from "./model";
import { IConfigParams } from "@/entities/config/types";
import * as UI from "./ui.styles";

type ParamsRow = IConfigParams & Record<string, unknown>;

const empty = "-----";

export function ConfigDetailsPage() {
  const { configId } = useParams({ from: Route.fullPath });
  const navigate = useNavigate({ from: Route.fullPath });
  const search = useSearch({ from: Route.fullPath });

  const limit = search.limit ?? 13;
  const offset = search.offset ?? 0;
  const version = search.version ?? null;

  const { config, versions, configVersion } = useConfigDetailsData({
    configId,
    version,
  });

  const configData = config.api.data;
  const allParams = configVersion.params as ParamsRow[];
  const paramsData = allParams.slice(offset, offset + limit);

  const activeVersion = version ?? configData?.active_version?.version ?? null;

  const { page, pagesCount, hasPagination } = usePagination({
    limit,
    offset,
    total: allParams.length,
  });

  const { modalRef, show, hide } = useModal();

  const columns = useMemo<ColumnType<ParamsRow>[]>(
    () => [
      { key: "param_key", title: "Параметр" },
      { key: "param_type", title: "Тип" },
      { key: "default_value", title: "Значение по умолчанию" },
      { key: "value", title: "Значение" },
    ],
    [],
  );

  return (
    <>
      <UI.Header>
        <Navbar />
      </UI.Header>
      <UI.Content>
        {configData && (
          <UI.Section>
            <H2 bold style={{ margin: "0 0 24px 0" }}>
              {configData.name}
            </H2>
            <UI.ConfigDetailsGrid>
              <Cell label="Версия" title={activeVersion?.toString() ?? empty} stretching="auto" />
              <Cell
                label="Дата создания"
                title={configData.created_at ? formatDate(configData.created_at) : empty}
                stretching="auto"
              />
              <Cell label="Описание" title={configData.description || empty} stretching="auto" />
            </UI.ConfigDetailsGrid>
          </UI.Section>
        )}

        <Flow
          mainAxisGap={12}
          alignment="center"
          arrangement="spaceBetween"
          style={{ width: "100%" }}
        >
          <H4 bold>Параметры</H4>
          <Button size="s" view="secondary" contentLeft={<IconEdit />} onClick={show}>
            Редактировать
          </Button>
        </Flow>
        <Table<ParamsRow>
          data={paramsData}
          columns={columns}
          loading={configVersion.api.isLoading}
          template="30% 15% 27% 28%"
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
      </UI.Content>
      <Modal ref={modalRef} id="addParam">
        <AddParamForm
          configId={configId}
          version={activeVersion}
          onClose={hide}
          onSuccess={() => {
            config.api.refetch();
            versions.api.refetch();
          }}
        />
      </Modal>
    </>
  );
}
