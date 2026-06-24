import { forwardRef, useRef } from "react";
import * as UI from "./ui.styles";

type Props = {
  children?: React.ReactNode;
  id: string;
};

export const Modal = forwardRef<HTMLDialogElement, Props>(function Modal(props, ref) {
  return (
    <UI.Dialog closedby="closerequest" ref={ref} id={props.id}>
      {props.children}
    </UI.Dialog>
  );
});

export function useModal() {
  const modalRef = useRef<HTMLDialogElement>(null);

  const show = () => {
    modalRef.current?.showModal();
  };

  const hide = () => {
    modalRef.current?.close();
  };

  return {
    modalRef,
    show,
    hide,
  };
}
