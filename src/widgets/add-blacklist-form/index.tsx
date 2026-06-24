import { Controller, useForm } from "react-hook-form";
import { IconClose } from "@salutejs/plasma-icons";
import {
  Button,
  H2,
  IconButton,
  TextArea,
  TextField,
} from "@salutejs/sdds-platform-ai/styled-components";
import { IBlacklistCreate } from "@/entities/blacklist";
import { FormBase } from "@/shared/ui/form";

import * as UI from "./ui.styles";

type Props = {
  value?: IBlacklistCreate;
  onClose(): void;
  onSubmit(data: IBlacklistCreate): void;
  loading: boolean;
};

export function AddBlacklistForm(props: Props) {
  const form = useForm<IBlacklistCreate>({
    values: {
      name: props.value?.name ?? "",
      url: props.value?.url ?? "",
      description: props.value?.description ?? "",
      author: props.value?.author ?? "",
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
              <H2 style={{ alignSelf: "center" }}>Добавить в чёрный список</H2>

              <Controller
                name="name"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Название"
                    required
                    hasRequiredIndicator
                    placeholder="Например Example Domain"
                    {...field}
                  />
                )}
              />

              <Controller
                name="url"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="URL"
                    required
                    hasRequiredIndicator
                    placeholder="https://example.com"
                    {...field}
                  />
                )}
              />

              <Controller
                name="description"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextArea
                    label="Описание"
                    required
                    hasRequiredIndicator
                    placeholder="Опишите причину добавления"
                    labelPlacement="outer"
                    height="120px"
                    {...field}
                  />
                )}
              />

              <Controller
                name="author"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    label="Автор"
                    required
                    hasRequiredIndicator
                    placeholder="Имя пользователя"
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
              Добавить
            </Button>
          </UI.FullwidthFlow>
        </UI.Container>
      </form>
    </FormBase>
  );
}
