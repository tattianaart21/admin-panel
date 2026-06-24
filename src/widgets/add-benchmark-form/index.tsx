import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import {
  BodyS,
  Button,
  H2,
  IconButton,
  TextField,
} from "@salutejs/sdds-platform-ai/styled-components";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

type FormProps = { name: string };
type Props = {
  onClose(): void;
  onSubmit(data: FormProps): void;
  loading: boolean;
};

export function AddBenchmarkForm(props: Props) {
  const form = useForm<FormProps>({
    defaultValues: {
      name: "",
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
              <H2 style={{ alignSelf: "center" }}>Новый бенчмарк</H2>

              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Название бенчмарка"
                    required
                    hasRequiredIndicator
                    placeholder="Например, E-commerce навигация"
                    {...field}
                  />
                )}
              />

              <BodyS>
                После создания откроется карточка: добавьте таски кнопкой «Добавить задачу», затем
                «Сохранить бенчмарк» — версия <b>v1.</b>
              </BodyS>
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
