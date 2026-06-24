import { Flow } from "@salutejs/sdds-platform-ai";
import * as UI from "./ui.styles";
import { useState } from "react";

type Props = {
  size: number;
  onChange(idx: number): void;
};

export function PaginationDots(props: Props) {
  const [innerIdx, setInnerIdx] = useState(0);

  const onIdxChange = (idx: number) => () => {
    setInnerIdx(idx);
    props.onChange(idx);
  };
  return (
    <Flow mainAxisGap={10} alignment="center">
      {Array(props.size)
        .fill(0)
        .map((_, idx) => (
          <UI.Dot key={idx} active={innerIdx === idx} onClick={onIdxChange(idx)} />
        ))}
    </Flow>
  );
}
