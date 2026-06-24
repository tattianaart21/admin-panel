import { Outlet } from "@tanstack/react-router";
import { NotificationsProvider, ToastProvider } from "@salutejs/sdds-platform-ai";

import * as UI from "./ui.styles";

export function RootLayout() {
  return (
    <UI.Container>
      <NotificationsProvider>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
      </NotificationsProvider>
    </UI.Container>
  );
}
