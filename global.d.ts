declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare interface Pagination {
  total: number;
  offset: number;
  limit: number;
}
