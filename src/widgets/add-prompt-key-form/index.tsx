import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import {
  Button,
  H2,
  IconButton,
  Switch,
  TextArea,
  TextField,
} from "@salutejs/sdds-platform-ai/styled-components";
import { IPromptOut } from "@/entities/prompt";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

type FormProps = Omit<IPromptOut, "id" | "deleted_at">;
type Props = {
  onClose(): void;
  onSubmit(data: FormProps): void;
  loading: boolean;
};

export function AddPromptKeyForm(props: Props) {
  const form = useForm<FormProps>({
    defaultValues: {
      description: "",
      key: "",
      negative: false,
      system: false,
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
              <H2 style={{ alignSelf: "center" }}>Создание ключа</H2>

              <Controller
                name="key"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    label="Ключ"
                    required
                    hasRequiredIndicator
                    placeholder="Например ozon"
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
                    required
                    hasRequiredIndicator
                    placeholder="Опишите подробно"
                    labelPlacement="outer"
                    height="224px"
                    {...field}
                  />
                )}
              />

              <UI.FullwidthFlow arrangement="start" alignment="center" mainAxisGap={16}>
                <Controller
                  name="system"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      label="Системный промт"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />

                <Controller
                  name="negative"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      label="Негативный запрос"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </UI.FullwidthFlow>
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
