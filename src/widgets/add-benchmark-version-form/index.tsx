import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import {
  BodyS,
  Button,
  H2,
  IconButton,
  TextArea,
  TextField,
} from "@salutejs/sdds-platform-ai/styled-components";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

export type FormProps = { web_name: string; ques: string; web: string };
type Props = {
  onClose(): void;
  onSubmit(data: FormProps): void;
  loading: boolean;
};

export function AddBenchmarkVersionForm(props: Props) {
  const form = useForm<FormProps>({
    defaultValues: {
      web_name: ``,
      ques: ``,
      web: ``,
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
              <H2 style={{ alignSelf: "center" }}>Новый задача</H2>
              <BodyS>
                Поле <b>task_id</b> формируется автоматически по web_name. Чтобы зафиксировать
                изменения в бенчмарке для других пользователей, нажмите &laquo;Сохранить&raquo;
              </BodyS>
              <Controller
                name="web_name"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="WEB_NAME"
                    required
                    hasRequiredIndicator
                    placeholder="Amazon"
                    {...field}
                  />
                )}
              />

              <Controller
                name="ques"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    label="TASK_QUES"
                    required
                    hasRequiredIndicator
                    placeholder="https://..."
                    {...field}
                  />
                )}
              />
              <Controller
                name="web"
                control={form.control}
                render={({ field }) => (
                  <TextField label="WEB_NAME" placeholder="https://..." {...field} />
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
