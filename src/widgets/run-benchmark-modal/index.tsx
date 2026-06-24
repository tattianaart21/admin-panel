import { Modal, useModal } from "@/shared/ui/modal";
import { OnSubmitHandler, RunBenchmarkVersionForm, FormProps } from "../run-benchmark-form";
import { forwardRef, useImperativeHandle } from "react";

type Props = {
  loading?: boolean;
  onSubmit: OnSubmitHandler;
};

export type RunBenchmarkModalRef = Omit<ReturnType<typeof useModal>, "modalRef">;

export const RunBenchmarkModal = forwardRef<RunBenchmarkModalRef, Props>(
  function RunBenchmarkModal(props, ref) {
    const { hide, show, modalRef } = useModal();

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }));

    return (
      <Modal ref={modalRef} id="run-benchmark-modal">
        <RunBenchmarkVersionForm
          onClose={hide}
          onSubmit={props.onSubmit}
          loading={props.loading ?? false}
        />
      </Modal>
    );
  },
);

export type RunBenchFormProps = FormProps;
