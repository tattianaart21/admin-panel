import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import { BodyS, Button, H2, IconButton } from "@salutejs/sdds-platform-ai/styled-components";
import { FormBase } from "@/shared/ui/form";

import { BenchmarkSelect } from "@/features/benchmark-select";
import { IConfigOut, IConfigParams, useConfigList, useConfigVersion } from "@/entities/config";
import * as UI from "./ui.styles";
import { useParamDictionary } from "@/entities/param-dict";
import { FormInputFactory } from "./model";
import { optionalTooltips } from "./consts";

export type BenchmarkConfigParams = {
  [key: string]: string | number | boolean | null | undefined;
  max_concurrent?: number;
};

export type FormProps = { params: BenchmarkConfigParams; selectedConfig?: IConfigOut | null };
export type OnSubmitHandler = (data: FormProps) => void;
type Props = {
  onClose(): void;
  onSubmit: OnSubmitHandler;
  loading: boolean;
};

const toParams: (arr: IConfigParams[]) => BenchmarkConfigParams = (arr) =>
  arr.reduce((acc, cur) => {
    if (cur.param_key) acc[cur.param_key] = cur.value;

    return acc;
  }, {} as BenchmarkConfigParams);

export function RunBenchmarkVersionForm(props: Props) {
  const [configSearch, setConfigSearch] = useState("");
  const configListApi = useConfigList({ limit: 20, offset: 0, search: configSearch });
  const form = useForm<FormProps>({
    values: {
      selectedConfig: configListApi.data?.data[0] ?? null,
      params: {
        max_concurrent: 1,
      },
    },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedConfig = form.watch("selectedConfig");
  const params = selectedConfig?.active_version?.params ?? [];
  const paramDict = useParamDictionary(
    params.map((p) => p.param_value_dict).filter((value) => value != null),
  );

  const configApi = useConfigVersion(selectedConfig?.id, selectedConfig?.active_version?.version);
  const sortedConfig = useMemo(() => {
    if (!configApi.data) {
      return [] as IConfigParams[];
    }

    const bools: IConfigParams[] = [];
    const strs: IConfigParams[] = [];
    const nums: IConfigParams[] = [];

    configApi.data.params.forEach((param) => {
      if (param.param_type === "boolean") {
        bools.push(param);
        return;
      }

      if (param.param_type === "number") {
        nums.push(param);
        return;
      }

      strs.push(param);
    });

    return [...strs, ...nums, ...bools];
  }, [configApi.data]);

  const onClear = () => {
    form.reset();
    form.setValue("selectedConfig", null);
  };

  useEffect(() => {
    if (!sortedConfig) {
      return;
    }

    const prev = form.getValues().params;
    form.setValue("params", { ...prev, ...toParams(sortedConfig) });
  }, [sortedConfig, form]);

  return (
    <FormBase>
      <form onSubmit={form.handleSubmit((form) => props.onSubmit(form))}>
        <UI.Container>
          <UI.FullwidthFlow orientation="vertical" alignment="center">
            <UI.FullwidthFlow arrangement="end" alignment="center">
              <IconButton view="clear" onClick={props.onClose}>
                <IconClose />
              </IconButton>
            </UI.FullwidthFlow>
            <UI.FullwidthFlow orientation="vertical" mainAxisGap={24} arrangement="center">
              <H2 style={{ alignSelf: "center" }}>Запуск бенчмарка</H2>
              <BodyS>Запуск всего бенчмарка (все активные таски текущей версии).</BodyS>
              <div style={{ width: "100%" }}>
                <Controller
                  name="selectedConfig"
                  control={form.control}
                  render={({ field }) => (
                    <BenchmarkSelect
                      value={field.value?.name ?? ""}
                      onChange={field.onChange}
                      onSearch={setConfigSearch}
                      configs={configListApi.data?.data}
                      onClear={onClear}
                    />
                  )}
                />
              </div>
              <UI.ParamsGrid>
                {sortedConfig?.map((param) => {
                  const type = param.param_value_dict ? "combo" : param.param_type;
                  const comboData =
                    paramDict.data && param.param_value_dict
                      ? paramDict.data[param.param_value_dict]
                      : [];

                  return (
                    <Controller
                      key={param.param_key}
                      name={`params.${param.param_key}`}
                      control={form.control}
                      render={({ field }) => {
                        const onlyName = field.name.split(".")[1];
                        return (
                          <FormInputFactory
                            type={type}
                            value={field.value}
                            onChange={field.onChange}
                            data={comboData}
                            label={`${onlyName} ${optionalTooltips[onlyName] ?? ""}`}
                          />
                        );
                      }}
                    />
                  );
                })}
              </UI.ParamsGrid>
            </UI.FullwidthFlow>
            <Button
              view="accent"
              size="xl"
              style={{ marginTop: 30 }}
              type="submit"
              isLoading={props.loading}
            >
              Запустить
            </Button>
          </UI.FullwidthFlow>
        </UI.Container>
      </form>
    </FormBase>
  );
}
