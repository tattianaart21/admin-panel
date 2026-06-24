import { useToast } from "@salutejs/sdds-platform-ai";

export function useConfiguredToast() {
  const { showToast, hideToast } = useToast();

  return {
    showToast: (text: string) =>
      showToast({
        text,
        position: "bottom",
        hasClose: true,
        timeout: 5000,
        fade: false,
      }),
    hideToast,
  };
}
