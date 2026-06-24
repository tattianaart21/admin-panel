import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import { Button, H2, IconButton, TextArea, TextField } from "@salutejs/sdds-platform-ai/styled-components";
import { IConfigCreate } from "@/entities/config";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

type Props = {
  onClose(): void;
  onSubmit(data: IConfigCreate): void;
  loading: boolean;
};

export function AddConfigForm(props: Props) {
  const form = useForm<IConfigCreate>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <FormBase>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <UI.Container>
          <UI.FullwidthFlow orientation="vertical" alignment="center">
            <UI.FullwidthFlow arrangement="end" alignment="center">
              <IconButton view="clear" onClick={props.onClose}>
                <IconClose />
              </IconButton>
            </UI.FullwidthFlow>
            <UI.FullwidthFlow orientation="vertical" mainAxisGap={24} arrangement="center">
              <H2 style={{ alignSelf: "center" }}>Создание конфига</H2>

              <Controller
                name="name"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Название"
                    required
                    hasRequiredIndicator
                    placeholder="Введите название конфига"
                    {...field}
                  />
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <TextArea
                    label="Описание"
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
