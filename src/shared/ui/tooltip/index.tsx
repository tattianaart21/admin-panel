import { Tooltip as TooltipLib } from "@salutejs/sdds-platform-ai";

export function Tooltip({ children, text }: { children: React.ReactNode; text?: string }) {
  if (!text) {
    return children;
  }

  return (
    <TooltipLib
      target={children}
      text={text}
      placement="top"
      hasArrow
      trigger="hover"
      minWidth={10}
      usePortal={false}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
}
