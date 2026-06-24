import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "@tanstack/react-router";
import {
  Badge,
  Cell,
  Flow,
  H4,
  IconButton,
  H2,
  Switch,
  Tabs,
  TabItem,
  Button,
} from "@salutejs/sdds-platform-ai";
import { Navbar } from "@/features/navbar";
import { IconMarkerOutline, IconPlus, IconTrashOutline, IconTree } from "@salutejs/plasma-icons";
import { Route } from "@/routes/prompts/$promptId";
import {
  IPromptVersionOut,
  IUpdatePromptKeyRequest,
  useCreatePromptVersion,
  useDeletePromptKey,
  useDeletePromptVersion,
  usePromptKey,
  usePromptVersions,
  useRestoreKey,
  useRestoreVersion,
  useRollbackVersion,
  useUpdatePromptKey,
} from "@/entities/prompt";
import { useModal, Modal } from "@/shared/ui/modal";
import {
  AddPromptVersionForm,
  FormProps as PromptVersionData,
} from "@/widgets/add-prompt-version-form";
import { useConfiguredToast } from "@/shared/lib/use-toast";
import { ActiveVersion } from "./active-version";
import { VersionsTree } from "./versions-tree";

import * as UI from "./ui.styles";

type PromptKeyData = Required<Omit<IUpdatePromptKeyRequest, "key">>;

const tabs = [
  {
    key: "active",
    label: "Версия промпта",
    icon: <IconMarkerOutline />,
    idx: 0,
  },
  { key: "list", label: "Дерево версий", icon: <IconTree />, idx: 1 },
];
const tabContents = [ActiveVersion, VersionsTree];

export function PromptsDetails() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDeletedVersion, setSelectedDeletedVersion] = useState<IPromptVersionOut | null>(
    null,
  );
  const { promptId } = useParams({ from: Route.fullPath });
  const { data, refetch } = usePromptKey(promptId);
  const formRef = useRef<HTMLFormElement>(null);
  const formApi = useForm<PromptKeyData>({
    defaultValues: {
      system: data?.system ?? false,
      negative: data?.negative ?? false,
    },
  });
  const updateKeyApi = useUpdatePromptKey();
  const createVersionApi = useCreatePromptVersion(promptId);
  const deleteVersionApi = useDeletePromptVersion();
  const deleteKeyApi = useDeletePromptKey();
  const restoreVersionApi = useRestoreVersion();
  const restoreKeyApi = useRestoreKey();
  const versionsApi = usePromptVersions(promptId);
  const rollbackAPi = useRollbackVersion();
  const { showToast } = useConfiguredToast();

  const { hide, show, modalRef } = useModal();
  const TabComponent = tabContents[activeTab];

  useEffect(() => {
    if (!data) {
      return;
    }

    formApi.setValue("system", data.system);
    formApi.setValue("negative", data.negative);
  }, [data, formApi]);

  if (!data) {
    return <H2>Нет данных</H2>;
  }
  const syncKeyAndVersions = (successText?: string) => {
    refetch();
    versionsApi.refetch();

    if (successText) {
      showToast(successText);
    }
  };

  const onSubmit = (values: PromptKeyData) => {
    updateKeyApi.mutate(
      {
        ...values,
        key: promptId,
      },
      {
        onSuccess: () => {
          syncKeyAndVersions("Значения ключа обновлены");
        },
      },
    );
  };

  const onCreateVersion = (values: PromptVersionData) => {
    createVersionApi.mutate(values, {
      onSuccess: () => {
        syncKeyAndVersions("Версия создана");
        hide();
      },
    });
  };

  const onDeleteVersion = () => {
    if (!data.current?.version) {
      return;
    }
    deleteVersionApi.mutate(
      { key: data.key, version: data.current?.version },
      {
        onSuccess: () => {
          syncKeyAndVersions(`Текущая версия (${data.current?.version}) удалена`);
        },
      },
    );
  };

  const submitManually = () => {
    formRef.current?.requestSubmit();
  };

  const onClickDelete = () => {
    deleteKeyApi.mutate(promptId, {
      onSuccess: () => {
        syncKeyAndVersions("Ключ успешно удален");
      },
    });
  };

  const onRestoreVersion = () => {
    if (!selectedDeletedVersion) {
      return;
    }

    restoreVersionApi.mutate(
      {
        key: promptId,
        version: selectedDeletedVersion.version,
      },
      {
        onSuccess: () => {
          setSelectedDeletedVersion(null);
          syncKeyAndVersions("Версия восстановлена");
        },
      },
    );
  };

  const onRestoreKey = () => {
    restoreKeyApi.mutate(
      {
        key: promptId,
      },
      {
        onSuccess: () => {
          syncKeyAndVersions("Ключ восстановлен");
        },
      },
    );
  };

  const onVersionChange = (version?: number) => {
    if (!version) {
      return;
    }

    const versionObj = versionsApi.data?.data.find((v) => v.version === version);

    if (!data) {
      return;
    }

    const isDeleted = Boolean(versionObj?.deleted_at);

    if (!isDeleted) {
      rollbackAPi.mutate(
        { version, key: data.key },
        {
          onSuccess: () => {
            syncKeyAndVersions(`Успешно переключились на версию ${version}`);
            setActiveTab(0);
          },
        },
      );

      return;
    }

    if (versionObj) {
      setSelectedDeletedVersion(versionObj);
      setActiveTab(0);
    }
  };

  return (
    <>
      <UI.Header>
        <Navbar />
        {data.deleted_at ? (
          <Button view="secondary" onClick={onRestoreKey} isLoading={restoreKeyApi.isPending}>
            Восстановить
          </Button>
        ) : (
          <IconButton view="secondary" onClick={onClickDelete} isLoading={deleteKeyApi.isPending}>
            <IconTrashOutline />
          </IconButton>
        )}
      </UI.Header>
      <div>
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
            <Flow orientation="vertical" alignment="start" arrangement="start" mainAxisGap={20}>
              <H4 style={{ textAlign: "center", width: "100%" }}>Ключ</H4>
              <Cell label="ID ключа" title={data.id.toString()} stretching="auto" />
              <Cell label="Ключ/Key" title={data.key} stretching="auto" />
              <Cell
                label="Полное описание ключа/Description"
                title={data.description}
                stretching="auto"
              />
              <form ref={formRef} onSubmit={formApi.handleSubmit(onSubmit)}>
                <Flow mainAxisGap={16}>
                  <Controller
                    name="system"
                    control={formApi.control}
                    render={({ field }) => (
                      <Switch
                        label="Системный промпт"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          submitManually();
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="negative"
                    control={formApi.control}
                    render={({ field }) => (
                      <Switch
                        label="Негативный запрос"
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          submitManually();
                        }}
                      />
                    )}
                  />
                </Flow>
              </form>
            </Flow>
          </UI.Section>

          <UI.Section isError={!!selectedDeletedVersion}>
            <UI.FlexRow>
              <Tabs view="clear">
                {tabs.map((tab) => (
                  <TabItem
                    view="divider"
                    key={tab.key}
                    size="m"
                    selected={activeTab === tab.idx}
                    tabIndex={tab.idx}
                    onClick={() => {
                      setSelectedDeletedVersion(null);
                      setActiveTab(tab.idx);
                    }}
                    contentLeft={tab.icon}
                  >
                    {tab.label}
                  </TabItem>
                ))}
              </Tabs>
              <H4 style={{ margin: "0 auto 0 28%" }}>Промпт</H4>
              <Flow mainAxisGap={8}>
                <IconButton view="accent" onClick={show}>
                  <IconPlus />
                </IconButton>

                {selectedDeletedVersion ? (
                  <Button
                    view="secondary"
                    onClick={onRestoreVersion}
                    isLoading={restoreVersionApi.isPending}
                  >
                    Восстановить
                  </Button>
                ) : (
                  <IconButton
                    view="secondary"
                    onClick={onDeleteVersion}
                    disabled={!data.current?.version}
                  >
                    <IconTrashOutline />
                  </IconButton>
                )}
              </Flow>
            </UI.FlexRow>
            {
              <TabComponent
                data={data}
                onChange={onVersionChange}
                versions={
                  selectedDeletedVersion ? [selectedDeletedVersion] : versionsApi.data?.data
                }
              />
            }
          </UI.Section>
        </Flow>
        <Modal ref={modalRef} id="addPrompt">
          <AddPromptVersionForm
            onClose={hide}
            onSubmit={onCreateVersion}
            loading={createVersionApi.isPending}
          />
        </Modal>
      </div>
    </>
  );
}
