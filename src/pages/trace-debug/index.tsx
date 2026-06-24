import { useMemo, useRef, useState, useCallback, memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useSearch } from "@tanstack/react-router";
import {
  H4,
  Spinner,
  Breadcrumbs,
  BodyS,
  TextArea,
  Button,
  Combobox,
  Cell,
  CellTextbox,
  CellTextboxLabel,
  CellTextboxTitle,
} from "@salutejs/sdds-platform-ai/styled-components";
import { IconArrowUp } from "@salutejs/plasma-icons";
import { Navbar } from "@/features/navbar";
import { ScrollToTop } from "@/features/scroll-to-top";
import { ImageWithCoordinates } from "@/features/image-with-coordinates";
import { useS3Loader } from "@/entities/s3-loader";
import { config } from "@/shared/lib/config";
import { useLLMList, useCallModel } from "@/entities/gigahf";
import type { IModel, ContentPart, Message } from "@/entities/gigahf";
import * as UI from "./ui.styles";

const MemoTextArea = memo(function MemoTextArea({
  value,
  onEdit,
  editKey,
}: {
  value: string;
  onEdit: (key: string, value: string) => void;
  editKey: string;
}) {
  return (
    <TextArea
      value={value}
      onChange={(e) => onEdit(editKey, e.target.value)}
      labelPlacement="outer"
      style={{ width: "100%" }}
      autoResize={true}
      maxAuto={30}
    />
  );
});

function renderContent(
  content: string | ContentPart[],
  msgIndex: number,
  edits: Record<string, string>,
  onEdit: (key: string, value: string) => void,
) {
  if (typeof content === "string") {
    if (content.startsWith("data:image")) {
      return <ImageWithCoordinates src={content} alt="image" />;
    }
    const key = `${msgIndex}`;
    return (
      <UI.ContentPartContainer>
        <MemoTextArea value={edits[key] ?? content} onEdit={onEdit} editKey={key} />
      </UI.ContentPartContainer>
    );
  }

  return content.map((part, j) => {
    if (part.type === "image_url") {
      const url = part.image_url?.url ?? "";
      const src = url.startsWith("data:image") ? url : `${config.tracesUrl}/s3/file/${url}`;
      return (
        <UI.ContentPartContainer key={j}>
          <ImageWithCoordinates src={src} alt={`image-${j}`} />
        </UI.ContentPartContainer>
      );
    }
    const key = `${msgIndex}-${j}`;
    return (
      <UI.ContentPartContainer key={j}>
        <MemoTextArea value={edits[key] ?? part.text} onEdit={onEdit} editKey={key} />
      </UI.ContentPartContainer>
    );
  });
}

const defaultConfigValues = { temperature: 0.9, max_tokens: 100, top_p: 0.9 };

export function TraceDebugPage() {
  const { agentQueryId, traceId } = useParams({
    from: "/traces/$traceId/agent-query/$agentQueryId/debug/",
  });
  const { messages_to_model_url, model_name } = useSearch({
    from: "/traces/$traceId/agent-query/$agentQueryId/debug/",
  });

  const { data, isLoading, error } = useS3Loader(messages_to_model_url);
  const gigaHFApi = useLLMList();
  const callModel = useCallModel();
  const modelNameWithoutPrefix = model_name?.replace("GigaHF-", "");
  const form = useForm<{ model: string }>({
    defaultValues: { model: modelNameWithoutPrefix ?? "" },
  });
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [messageEdits, setMessageEdits] = useState<Record<string, string>>({});
  const [selectedModel, setSelectedModel] = useState(modelNameWithoutPrefix ?? "");
  const [extraParamsText, setExtraParamsText] = useState(
    JSON.stringify(defaultConfigValues, null, 2),
  );
  const [paramsError, setParamsError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEdit = useCallback((key: string, value: string) => {
    setMessageEdits((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggle = (i: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const parsed = useMemo(() => {
    if (!data) return null;
    try {
      return JSON.parse(data) as Message[];
    } catch {
      return null;
    }
  }, [data]);

  const handleSend = useCallback(() => {
    if (!parsed) return;

    let extra: Record<string, unknown> = {};
    if (extraParamsText.trim()) {
      try {
        extra = JSON.parse(extraParamsText);
      } catch {
        setParamsError("Некорректный JSON");
        return;
      }
      setParamsError(null);
    }

    const model = form.getValues("model");
    const modelWithPrefix = model.toLowerCase().startsWith("gigachat") || model.toLowerCase().startsWith("gigahf") ? model : `GigaHF-${model}`;
    const messages = parsed.map((msg, i) => {
      if (typeof msg.content === "string") {
        return {
          role: msg.role,
          content: messageEdits[`${i}`] ?? msg.content,
        };
      }
      return {
        role: msg.role,
        content: msg.content.map((part, j) =>
          part.type === "text" ? { ...part, text: messageEdits[`${i}-${j}`] ?? part.text } : part,
        ),
      };
    });
    setResponse("");

    callModel.mutate(
      { model: modelWithPrefix, messages, ...extra },
      {
        onSuccess: (res) => {
          let parsed = "";
          if (typeof res === "object" && res !== null) {
            parsed = JSON.stringify(res, null, 2);
          } else {
            parsed = res;
          }
          setResponse(parsed);
        },
        onError: (err) => {
          setResponse(`${err}`);
        },
      },
    );
  }, [parsed, messageEdits, extraParamsText, form, callModel]);

  const items = useMemo(() => {
    const asyncItems =
      gigaHFApi.data?.models?.map((m: IModel) => ({
        label: m.name,
        value: `GigaHF-${m.name}`,
      })) ?? [];

    return [{ label: "GigaChat-3-Ultra", value: "GigaChat-3-Ultra" }, ...asyncItems];
  }, [gigaHFApi]);

  if (isLoading) {
    return (
      <UI.CenterContainer>
        <Spinner size="l" />
      </UI.CenterContainer>
    );
  }

  const breadcrumbItems = [
    { title: "Трейсы", href: "/traces" },
    { title: "Трейс", href: `/traces/${traceId}` },
    { title: "Запрос к агенту", href: `/traces/${traceId}/agent-query/${agentQueryId}` },
    { title: "Debug", isCurrent: true },
  ];

  return (
    <UI.Page>
      <UI.Header>
        <Navbar />
      </UI.Header>
      <ScrollToTop scrollRef={contentRef} />
      <UI.Content>
        <UI.BreadcrumbsContainer>
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>

        <UI.Section>
          <UI.ModelBar>
            <div style={{ flex: 1 }}>
              <Controller
                name="model"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Combobox
                    items={items}
                    value={field.value}
                    onChange={(val) => {
                      if (val) {
                        field.onChange(val);
                        setSelectedModel(val);
                      }
                    }}
                    placeholder="Выберите модель"
                    label="Модель"
                    listMaxHeight="400px"
                    labelPlacement="outer"
                  />
                )}
              />
            </div>
            <UI.FormActions>
              <Button
                view="default"
                size="m"
                type="button"
                onClick={handleSend}
                isLoading={callModel.isPending}
                disabled={!selectedModel || !parsed || !!paramsError}
              >
                Отправить
              </Button>
            </UI.FormActions>
          </UI.ModelBar>
          <UI.ExtraParamsSection>
            <TextArea
              value={extraParamsText}
              onChange={(e) => {
                setExtraParamsText(e.target.value);
                if (paramsError) setParamsError(null);
              }}
              label="Дополнительные параметры (JSON)"
              labelPlacement="outer"
              placeholder='{"temperature": 0.5, "max_tokens": 1000}'
              autoResize={true}
              style={{ width: "100%" }}
            />
            {paramsError && <BodyS style={{ color: "red", marginTop: 4 }}>{paramsError}</BodyS>}
          </UI.ExtraParamsSection>

          {response && (
            <Cell>
              <CellTextbox>
                <CellTextboxLabel>Ответ модели</CellTextboxLabel>
                <CellTextboxTitle style={{ whiteSpace: "pre-wrap" }}>{response}</CellTextboxTitle>
              </CellTextbox>
            </Cell>
          )}
        </UI.Section>

        <UI.Scrollable ref={contentRef}>
          {error && <BodyS>Ошибка загрузки: {error.message}</BodyS>}
          {!parsed && !error && <BodyS>Нет данных</BodyS>}
          {parsed && (
            <UI.MessageGrid>
              {parsed.map((msg, i) => (
                <UI.Section key={i}>
                  <UI.SectionHeader onClick={() => toggle(i)}>
                    <H4 bold style={{ textTransform: "capitalize" }}>
                      {msg.role === "system" ? "Системный промпт" : "Сообщение пользователя"}
                    </H4>
                    <IconArrowUp
                      size="xs"
                      style={{
                        transform: !expanded.has(i) ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </UI.SectionHeader>
                  {expanded.has(i) && renderContent(msg.content, i, messageEdits, handleEdit)}
                </UI.Section>
              ))}
            </UI.MessageGrid>
          )}
        </UI.Scrollable>
      </UI.Content>
    </UI.Page>
  );
}
