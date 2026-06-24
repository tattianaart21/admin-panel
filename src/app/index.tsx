import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createGlobalStyle } from "styled-components";
import { sdds_platform_ai__light } from "@salutejs/sdds-themes";
import {
  RouterProvider,
  createRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import { backgroundSecondary } from "@salutejs/sdds-themes/tokens/sdds_platform_ai";
import { routeTree } from "../routeTree.gen.ts";

const Theme = createGlobalStyle(sdds_platform_ai__light);
const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    background: ${backgroundSecondary}
  }

  * {
    box-sizing: border-box;
  }

  dialog {
    color: inherit;
  }
`;

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  parseSearch: parseSearchWith(JSON.parse),
  stringifySearch: stringifySearchWith(JSON.stringify),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Theme />
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
