import { useEffect, useState } from "react";
import { IconArrowUp } from "@salutejs/plasma-icons";
import { IconButton } from "@salutejs/sdds-platform-ai";
import styled from "styled-components";

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 36px;
  right: 20px;
  z-index: 100;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: opacity 0.15s;
`;

type Props = {
  scrollRef?: React.RefObject<HTMLElement | null>;
};

export function ScrollToTop({ scrollRef }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current ?? window;
    const onScroll = () => {
      setVisible((el instanceof Window ? el.scrollY : el.scrollTop) > 300);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <Container $visible={visible}>
      <IconButton
        view="accent"
        size="m"
        onClick={() => {
          const el = scrollRef?.current;
          if (el) {
            el.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <IconArrowUp />
      </IconButton>
    </Container>
  );
}
