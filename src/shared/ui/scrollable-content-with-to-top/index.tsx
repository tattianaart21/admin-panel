import { UIEventHandler, useRef, useState } from "react";
import { IconArrowUp } from "@salutejs/plasma-icons";
import { Button, Toolbar } from "@salutejs/sdds-platform-ai";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
  treshold?: number;
};

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollableContent = ({ children, treshold = 300 }: Props) => {
  const [visible, setVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const nextVisible = e.currentTarget.scrollTop > treshold;
    setVisible(nextVisible);
  };

  return (
    <ScrollContainer ref={contentRef} onScroll={onScroll}>
      {children}
      {visible && (
        <div style={{ position: "absolute", bottom: 35, right: 20 }}>
          <Toolbar hasShadow={false} size="m">
            <Button
              contentLeft={<IconArrowUp />}
              view="clear"
              size="m"
              onClick={scrollToTop}
              square
            />
          </Toolbar>
        </div>
      )}
    </ScrollContainer>
  );
};
