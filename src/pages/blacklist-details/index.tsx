import {
  Badge,
  Button,
  Cell,
  CellTextbox,
  CellTextboxLabel,
  Flow,
  H2,
  IconButton,
} from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";
import { IconEdit, IconTrashOutline } from "@salutejs/plasma-icons";
import { Route } from "@/routes/blacklist/$blacklistId";
import {
  IBlacklistCreate,
  useBlacklist,
  useBlacklistHistory,
  useDeleteBlacklist,
  useRestoreBlacklist,
  useUpdateBlacklist,
} from "@/entities/blacklist";
import { useParams, useSearch } from "@tanstack/react-router";
import { formatDate } from "@/shared/lib/format-date";
import { AddBlacklistForm } from "@/widgets/add-blacklist-form";
import { useModal, Modal } from "@/shared/ui/modal";
import { useConfiguredToast } from "@/shared/lib/use-toast";

import * as UI from "./ui.styles";

const empty = "-----";

export function BlacklistDetailsPage() {
  const { blacklistId } = useParams({ from: Route.fullPath });
  const { include_deleted } = useSearch({ from: Route.fullPath });
  const id = Number(blacklistId);
  const { data, isLoading, refetch } = useBlacklist(id, Boolean(include_deleted));
  const hasData = !isLoading && !!data;
  const deleteApi = useDeleteBlacklist();
  const updateApi = useUpdateBlacklist();
  const resoreApi = useRestoreBlacklist();
  const isDeleted = data?.deleted_at !== null;
  const { modalRef, show, hide } = useModal();
  const { showToast } = useConfiguredToast();
  const historyApi = useBlacklistHistory({ blacklist_id: id });

  const onSuccess = (successText: string = "") => {
    showToast(successText);
    refetch();
  };

  const onClickDelete = () => {
    deleteApi.mutate(id, {
      onSuccess: () => {
        onSuccess("Запись удалена");
      },
    });
  };

  const onSubmit = (values: IBlacklistCreate) => {
    updateApi.mutate(
      { blacklistId: id, ...values },
      {
        onSuccess: () => {
          hide();
          onSuccess("Запись сохранена");
          historyApi.refetch();
        },
      },
    );
  };

  const onRestore = () => {
    resoreApi.mutate(id, {
      onSuccess: () => {
        onSuccess("Запись восстановлена");
      },
    });
  };

  return (
    <>
      <UI.Header>
        <Navbar />
        <Flow mainAxisGap={8}>
          {isDeleted ? (
            <Button view="secondary" onClick={onRestore} isLoading={resoreApi.isPending}>
              Восстановить
            </Button>
          ) : (
            <>
              <IconButton view="secondary" disabled={!hasData} onClick={show}>
                <IconEdit />
              </IconButton>
              <IconButton
                view="secondary"
                disabled={!hasData}
                onClick={onClickDelete}
                isLoading={deleteApi.isPending}
              >
                <IconTrashOutline />
              </IconButton>
            </>
          )}
        </Flow>
      </UI.Header>
      <div>
        {!hasData ? (
          <UI.NotFound>
            <H2>Запись не найдена</H2>
          </UI.NotFound>
        ) : (
          <Flow
            orientation="vertical"
            alignment="start"
            arrangement="start"
            style={{ overflow: "auto" }}
            mainAxisGap={30}
          >
            <UI.Section>
              <UI.FlexRow>
                <H2 bold style={{ margin: "0 auto" }}>
                  Детальная информация
                </H2>
                {data.deleted_at && (
                  <Badge view={"negative"} transparent pilled contentLeft={<IconTrashOutline />}>
                    Удалено
                  </Badge>
                )}
              </UI.FlexRow>
              <Flow
                alignment="start"
                arrangement="start"
                mainAxisGap={20}
                crossAxisGap={30}
                itemsPerLine={4}
              >
                <UI.CellContainer>
                  <Cell label="ID" title={data.id.toString()} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="Наименование" title={data.name} />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="URL" title={data.url} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="Автор" title={data.author} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Дата создания"
                    title={data.created_at ? formatDate(data.created_at) : empty}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Дата удаления"
                    title={data.deleted_at ? formatDate(data.deleted_at) : empty}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell>
                    <CellTextbox style={{ alignItems: "flex-start", flex: 1 }}>
                      <CellTextboxLabel>{"Причина блокировки"}</CellTextboxLabel>
                      <UI.ScrollableTextboxTitle>
                        {data.description ?? empty}
                      </UI.ScrollableTextboxTitle>
                    </CellTextbox>
                  </Cell>
                </UI.CellContainer>
              </Flow>
            </UI.Section>

            <UI.Section>
              <UI.FlexRow>
                <H2 bold style={{ margin: "0 auto 30px" }}>
                  История
                </H2>
              </UI.FlexRow>

              <Flow
                mainAxisGap={20}
                arrangement="start"
                alignment="center"
                orientation="horizontal"
              >
                <UI.CellContainer>
                  <Cell title="" label="Действие" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell title="" label="Дата, время" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell title="" label="Автор изменений" />
                </UI.CellContainer>{" "}
              </Flow>
              {historyApi.data?.data.map((record) => (
                <Flow
                  key={record.history_id}
                  mainAxisGap={20}
                  arrangement="start"
                  alignment="center"
                  style={{ marginTop: 10 }}
                >
                  <UI.CellContainer>
                    <Cell title="редактирование" />
                  </UI.CellContainer>
                  <UI.CellContainer>
                    <Cell title={formatDate(record.updated_at)} />
                  </UI.CellContainer>
                  <UI.CellContainer>
                    <Cell title={record.update_author} />
                  </UI.CellContainer>
                </Flow>
              ))}
            </UI.Section>
          </Flow>
        )}
        <Modal ref={modalRef} id="addBlacklist">
          <AddBlacklistForm
            value={data}
            onClose={hide}
            onSubmit={onSubmit}
            loading={updateApi.isPending}
          />
        </Modal>
      </div>
    </>
  );
}
