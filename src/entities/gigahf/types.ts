export interface IGetGigaHFList {
  models: IModel[];
}

export interface IModel {
  name: string;
  provider: string;
  description: string;
  engine: string;
  tasks: string[];
  labels: string[];
  modes: Record<string, unknown>;
}

export interface ICallParams {
  model: string;
  messages: Message[];
  [key: string]: unknown;
}

export type ContentPart = {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
};

export type Message = {
  role: "system" | "user";
  content: string | ContentPart[];
};
