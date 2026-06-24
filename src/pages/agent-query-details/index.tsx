import { useParams } from "@tanstack/react-router";
import { IconLink } from "@salutejs/plasma-icons";
import {
  H2,
  Cell,
  Spinner,
  Breadcrumbs,
  CellTextbox,
  CellTextboxLabel,
  Flow,
} from "@salutejs/sdds-platform-ai/styled-components";
import { useUserQueryAgent } from "@/entities/trace";
import { formatDate } from "@/shared/lib/format-date";

import * as UI from "./ui.styles";
import { useS3Loader } from "@/entities/s3-loader";
import { Navbar } from "@/features/navbar";
import { config } from "@/shared/lib/config";
import { Link } from "@/shared/ui/link";

const empty = "—";

export function AgentQueryDetailsPage() {
  const { traceId, agentQueryId } = useParams({
    from: "/traces/$traceId/agent-query/$agentQueryId/",
  });
  const { data, isLoading } = useUserQueryAgent(agentQueryId);
  const userModalRequest = useS3Loader(data?.user_query_agent.request_to_model_url);
  const userModalResponse = useS3Loader(data?.user_query_agent_result?.response_from_model_url);

  if (isLoading) {
    return (
      <UI.CenterContainer>
        <Spinner size="l" />
      </UI.CenterContainer>
    );
  }

  if (!data) {
    return (
      <UI.NotFound>
        <H2>Agent Query not found</H2>
      </UI.NotFound>
    );
  }

  const { user_query_agent, user_query_agent_result, multiact, action_results } = data;

  const breadcrumbItems = [
    { title: "Трейсы", href: "/traces" },
    { title: `Трейс ${traceId?.slice(0, 8)}...`, href: `/traces/${traceId}` },
    { title: "Детали запроса к агенту", isCurrent: true },
  ];

  return (
    <>
      <UI.Header>
        <Navbar />
        <Flow mainAxisGap={16} arrangement="end">
          <Link
            to="/traces/$traceId/agent-query/$agentQueryId/debug"
            params={{ traceId, agentQueryId }}
            search={{
              messages_to_model_url: data?.user_query_agent.messages_to_model_url ?? undefined,
              model_name: data?.user_query_agent.model_name ?? undefined,
            }}
          >
            <Cell title="Режим DEBUG" contentRight={<IconLink size="xs" />} />
          </Link>
        </Flow>
      </UI.Header>

      <UI.Content>
        <UI.BreadcrumbsContainer>
          <Breadcrumbs view="default" size="s" items={breadcrumbItems} />
        </UI.BreadcrumbsContainer>
        <UI.Section style={{ margin: 0 }}>
          <UI.FlexRow>
            <H2 bold style={{ margin: "0 auto" }}>
              Входные данные для агента
            </H2>
          </UI.FlexRow>
          <UI.UserQueryGrid>
            <UI.CellContainer>
              <Cell
                label="ID запроса к модели"
                title={user_query_agent.user_query_id ?? empty}
                stretching="auto"
              />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell label="ID запроса пользователя" title={user_query_agent.id} stretching="auto" />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell
                label="Наименование агента"
                title={user_query_agent.agent_name}
                stretching="auto"
              />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell
                label="Наименование модели"
                title={user_query_agent.model_name}
                stretching="auto"
              />
            </UI.CellContainer>

            <UI.CellContainer>
              <Cell
                label="Kafka Request At"
                title={formatDate(user_query_agent.kafka_request_at)}
                stretching="auto"
              />
            </UI.CellContainer>
            <UI.CellContainer>
              <Cell
                label="Created At"
                title={formatDate(user_query_agent.created_at)}
                stretching="auto"
              />
            </UI.CellContainer>
            <UI.CellContainer style={{ gridColumn: "1/5", whiteSpace: "pre-wrap" }}>
              <Cell stretching="auto">
                <CellTextbox>
                  <CellTextboxLabel>{"S3 файл запроса к модели"}</CellTextboxLabel>
                  <UI.ScrollingTextboxTitle>
                    {userModalRequest.data ?? empty}
                  </UI.ScrollingTextboxTitle>
                </CellTextbox>
              </Cell>
            </UI.CellContainer>
          </UI.UserQueryGrid>
        </UI.Section>

        {user_query_agent_result && (
          <UI.Section>
            <UI.FlexRow>
              <H2 bold style={{ margin: "0 auto" }}>
                Результат работы агента
              </H2>
            </UI.FlexRow>
            <UI.UserQueryResponseGrid>
              <UI.CellContainer>
                <Cell
                  label="ID ответа модели "
                  title={user_query_agent_result.id ?? empty}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="ID запроса к модели"
                  title={user_query_agent_result.user_query_agent_id ?? empty}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Наименование агента"
                  title={user_query_agent_result.agent_name ?? empty}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Наименование модели"
                  title={user_query_agent_result.model_name ?? empty}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Продолжительность выполнения задачи в секундах"
                  title={
                    user_query_agent_result.duration_s
                      ? `${user_query_agent_result.duration_s} сек.`
                      : empty
                  }
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Время отправки в Kafka"
                  title={
                    user_query_agent_result.kafka_response_at
                      ? formatDate(user_query_agent_result.kafka_response_at)
                      : empty
                  }
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Дата и время создания записи"
                  title={
                    user_query_agent_result.created_at
                      ? formatDate(user_query_agent_result.created_at)
                      : empty
                  }
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Токены запроса"
                  title={String(user_query_agent_result.prompt_tokens ?? empty)}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Кэшируемые токены"
                  title={String(user_query_agent_result.precached_prompt_tokens ?? empty)}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Токены ответа"
                  title={String(user_query_agent_result.completion_tokens ?? empty)}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Общее количество токенов"
                  title={String(user_query_agent_result.total_tokens ?? empty)}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer style={{ gridColumn: "1/6", whiteSpace: "pre-wrap" }}>
                <Cell stretching="auto">
                  <CellTextbox>
                    <CellTextboxLabel>{"S3 файл запроса к модели"}</CellTextboxLabel>
                    <UI.ScrollingTextboxTitle>
                      {userModalResponse.data ?? empty}
                    </UI.ScrollingTextboxTitle>
                  </CellTextbox>
                </Cell>
              </UI.CellContainer>
            </UI.UserQueryResponseGrid>
          </UI.Section>
        )}

        {multiact && (
          <UI.Section>
            <UI.FlexRow>
              <H2 bold style={{ margin: "0 auto" }}>
                Мультиакты
              </H2>
            </UI.FlexRow>
            <UI.UserQueryGrid>
              <UI.CellContainer>
                <Cell label="ID массива действий" title={multiact.id} stretching="auto" />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="ID ответа модели"
                  title={multiact.user_query_agent_result_id}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Время отправки в Kafka"
                  title={formatDate(multiact.kafka_published_at)}
                  stretching="auto"
                />
              </UI.CellContainer>
              <UI.CellContainer>
                <Cell
                  label="Дата и время создания запроса"
                  title={formatDate(multiact.created_at)}
                  stretching="auto"
                />
              </UI.CellContainer>
            </UI.UserQueryGrid>
          </UI.Section>
        )}

        {action_results && (
          <UI.Section>
            <UI.FlexRow>
              <H2 bold style={{ margin: "0 auto" }}>
                Результаты выполненных действий
              </H2>
            </UI.FlexRow>
            {action_results.map((result) => (
              <UI.UserQueryResponseGrid key={result.id}>
                <UI.CellContainer>
                  <Cell
                    label="Время отправки в Kafka"
                    title={formatDate(result.kafka_published_at)}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Дата и время создания запроса"
                    title={formatDate(result.created_at)}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="ID действия" title={result.id} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="ID массива действий" title={result.multiact_id} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="URL"
                    title={result.website_url ? new URL(result.website_url).hostname : empty}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Номер шага в массиве"
                    title={result.action_index.toString() ?? empty}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Наименование действия"
                    title={result.action_name}
                    stretching="auto"
                  />
                </UI.CellContainer>

                <UI.CellContainer>
                  <Cell label="Статус выполнения шага" title={result.status} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell label="Описание ошибки" title={result.error ?? empty} stretching="auto" />
                </UI.CellContainer>
                <UI.CellContainer>
                  <Cell
                    label="Источник обработки результата действия"
                    title={result.source ?? empty}
                    stretching="auto"
                  />
                </UI.CellContainer>
                <UI.CellContainer style={{ gridColumn: "1/6" }}>
                  <Cell label="Скриншот выполнения шага" />
                  {result.screenshot_uri ? (
                    <img
                      src={`${config.tracesUrl}/s3/file/${result.screenshot_uri}`}
                      alt={result.action_name}
                      style={{ maxWidth: "100%" }}
                    />
                  ) : (
                    empty
                  )}
                </UI.CellContainer>
              </UI.UserQueryResponseGrid>
            ))}
          </UI.Section>
        )}
      </UI.Content>
    </>
  );
}
