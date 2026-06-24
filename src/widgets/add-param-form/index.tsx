import { useCallback, useMemo, useRef, useState } from "react";
import { IconClose } from "@salutejs/plasma-icons";
import {
  BodyS,
  Button,
  Cell,
  Combobox,
  H2,
  IconButton,
  Switch,
  TextField,
} from "@salutejs/sdds-platform-ai";
import { FormBase } from "@/shared/ui/form";
import { useConfigVersion, useCreateConfigVersion } from "@/entities/config";
import { useInfiniteParamDefinitionList, useParamDefinition } from "@/entities/param-def";
import { useParamDictionary } from "@/entities/param-dict";
import * as UI from "./ui.styles";

type Props = {
  configId: string;
  version: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddParamForm({ configId, version, onClose, onSuccess }: Props) {
  const [search, setSearch] = useState("");
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteParamDefinitionList(search || undefined);
  const defApi = useParamDefinition(selectedDefId ?? undefined);
  const currentVersionApi = useConfigVersion(configId, version ?? undefined);

  const createVersion = useCreateConfigVersion();

  const items = useMemo(
    () =>
      (data?.pages ?? []).flatMap((page) =>
        page.data.map((def) => ({
          label: def.param_key,
          value: def.id,
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

  const selectedDef = defApi.data;
  const dictNames = selectedDef?.param_value_dict_name ? [selectedDef.param_value_dict_name] : [];
  const paramDict = useParamDictionary(dictNames);
  const comboData = selectedDef?.param_value_dict_name
    ? (paramDict.data?.[selectedDef.param_value_dict_name] ?? [])
    : [];
  const [comboValue, setComboValue] = useState<string>("");
  const valueRef = useRef<string | number | boolean | null>(null);

  const onSubmit = () => {
    if (!selectedDef) return;

    const currentParams = currentVersionApi.data?.params ?? [];
    const payload: Record<string, unknown> = {};
    currentParams.forEach((p) => {
      payload[p.param_key] = p.value ?? p.default_value;
    });
    payload[selectedDef.param_key] = valueRef.current ?? selectedDef.default_value;

    createVersion.mutate(
      { configId, payload },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <FormBase>
      <UI.Container>
        <UI.FullwidthFlow orientation="vertical" alignment="center">
          <UI.FullwidthFlow arrangement="end" alignment="center">
            <IconButton view="clear" onClick={onClose}>
              <IconClose />
            </IconButton>
          </UI.FullwidthFlow>
          <UI.FullwidthFlow orientation="vertical" mainAxisGap={24} arrangement="center">
            <H2 style={{ alignSelf: "center" }}>Добавить параметр</H2>
            <BodyS>Выберите определение параметра и укажите значение.</BodyS>
            <div style={{ width: "100%" }}>
              <Combobox
                value={selectedDef?.id ?? ""}
                items={isLoading ? [] : items}
                onChange={(val) => {
                  if (val) setSelectedDefId(val);
                }}
                onChangeValue={setSearch}
                placeholder="Поиск параметра"
                listMaxHeight="400px"
                onScroll={handleScroll}
                afterList={
                  isFetchingNextPage ? (
                    <BodyS as="p" style={{ textAlign: "center" }}>
                      Загружаю...
                    </BodyS>
                  ) : undefined
                }
              />
            </div>
            {selectedDef && (
              <UI.DetailGrid>
                <Cell label="Ключ" title={selectedDef.param_key} stretching="auto" />
                <Cell label="Тип" title={selectedDef.param_type} stretching="auto" />
                <Cell
                  label="Значение по умолчанию"
                  title={selectedDef.default_value?.toString() ?? "—"}
                  stretching="auto"
                />
                <Cell label="Описание" title={selectedDef.description || "—"} stretching="auto" />
              </UI.DetailGrid>
            )}
            {selectedDef && (
              <div key={selectedDef.id}>
                {selectedDef.param_type === "boolean" ? (
                  <Switch
                    defaultChecked={!!selectedDef.default_value}
                    onChange={(e) => {
                      valueRef.current = e.target.checked;
                    }}
                    label="Значение"
                  />
                ) : comboData.length > 0 ? (
                  <Combobox
                    items={comboData.map((item) => ({ label: item, value: item }))}
                    value={comboValue || (selectedDef.default_value ?? "").toString()}
                    onChange={(val) => {
                      setComboValue(val);
                      valueRef.current = val;
                    }}
                    placeholder="Выберите значение"
                  />
                ) : (
                  <TextField
                    defaultValue={(selectedDef.default_value ?? "").toString()}
                    onChange={(e) => {
                      valueRef.current =
                        selectedDef.param_type === "number"
                          ? Number(e.target.value)
                          : e.target.value;
                    }}
                    placeholder="Значение"
                    type={selectedDef.param_type === "number" ? "number" : "text"}
                  />
                )}
              </div>
            )}
          </UI.FullwidthFlow>
          <Button
            view="accent"
            size="xl"
            style={{ marginTop: 30 }}
            disabled={!selectedDef}
            isLoading={createVersion.isPending}
            onClick={onSubmit}
          >
            Применить
          </Button>
        </UI.FullwidthFlow>
      </UI.Container>
    </FormBase>
  );
}
