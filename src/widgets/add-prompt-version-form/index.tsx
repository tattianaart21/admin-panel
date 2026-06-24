import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import {
  Button,
  H2,
  IconButton,
  TextArea,
  TextField,
} from "@salutejs/sdds-platform-ai/styled-components";
import { ICreatePromptVersionRequest } from "@/entities/prompt";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

export type FormProps = Required<Omit<ICreatePromptVersionRequest, "meta" | "parent_version_id">>;
type Props = {
  onClose(): void;
  onSubmit(data: FormProps): void;
  loading: boolean;
  value?: FormProps;
};

export function AddPromptVersionForm(props: Props) {
  const form = useForm<FormProps>({
    values: {
      author: props.value?.author ? props.value.author : "",
      content: props.value?.content ?? "",
    },
  });

  const onSubmit = (data: FormProps) => {
    props.onSubmit(data);
    form.reset();
  };

  return (
    <FormBase>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <UI.Container>
          <UI.FullwidthFlow orientation="vertical" alignment="center">
            <UI.FullwidthFlow arrangement="end" alignment="center">
              <IconButton view="clear" onClick={props.onClose}>
                <IconClose />
              </IconButton>
            </UI.FullwidthFlow>
            <UI.FullwidthFlow orientation="vertical" mainAxisGap={24} arrangement="center">
              <H2 style={{ alignSelf: "center" }}>Создание промпта</H2>

              <Controller
                name="author"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Автор"
                    enumerationType="plain"
                    value={field.value ?? ""}
                    required
                    hasRequiredIndicator
                    placeholder="Имя, Фамилия"
                  />
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <TextArea
                    label="Описание"
                    required
                    hasRequiredIndicator
                    placeholder="Опишите подробно"
                    labelPlacement="outer"
                    height="224px"
                    {...field}
                  />
                )}
              />
            </UI.FullwidthFlow>
            <Button
              view="accent"
              size="xl"
              style={{ marginTop: 30 }}
              type="submit"
              isLoading={props.loading}
            >
              Создать
            </Button>
          </UI.FullwidthFlow>
        </UI.Container>
      </form>
    </FormBase>
  );
}
