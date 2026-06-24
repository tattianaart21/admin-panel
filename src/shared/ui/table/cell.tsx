import { useRef, useState } from "react";
import { CellContainer, TCell, CopyAction } from "./ui.styles";
import { CellTextbox, CellTextboxTitle } from "@salutejs/sdds-platform-ai";
import { IconCopyOutline, IconDone } from "@salutejs/plasma-icons";
import { capText } from "./utils";

type Props = {
  title: string;
  maxCharacters?: number;
  width?: number;
  contentLeft?: React.ReactNode;
};

export function TableCell(props: Props) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(props.title);

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }

    copyTimeout.current = setTimeout(() => {
      setCopied(false);
    }, 300);
  };

  let contentRight: React.ReactNode = null;

  if (props.title) {
    if (copied) {
      contentRight = <IconDone size="s" color="inherit" />;
    } else if (hovered) {
      contentRight = (
        <span
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleCopy();
          }}
        >
          <IconCopyOutline size="s" />
        </span>
      );
    }
  }

  return (
    <CellContainer onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <TCell contentLeft={props.contentLeft}>
        <CellTextbox
          style={{
            alignItems: "flex-start",
            width: props.width,
            flexGrow: !props.width ? 1 : "initial",
          }}
        >
          <CellTextboxTitle style={{ padding: "4px 0" }}>
            {capText(props.title, props.maxCharacters)}
          </CellTextboxTitle>
        </CellTextbox>
      </TCell>
      <CopyAction>{contentRight}</CopyAction>
    </CellContainer>
  );
}
