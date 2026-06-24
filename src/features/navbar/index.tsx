import { TabItem, Tabs } from "@salutejs/sdds-platform-ai";
import { createLink, useLocation } from "@tanstack/react-router";

const tabs = [
  { key: "blacklist", label: "блэклист", to: "/blacklist" },
  { key: "prompts", label: "промпты", to: "/prompts" },
  { key: "traces", label: "трейсы", to: "/traces", disabled: false },
  { key: "benchmarks", label: "бенчмарки", to: "/benchmark", disabled: false },
  { key: "configs", label: "конфиги", to: "/configs", disabled: false },
];

const TabLinkItem = createLink(TabItem);

function isTabActive(tabTo: string, currentPath: string): boolean {
  if (tabTo === "/traces") {
    return currentPath.startsWith("/traces");
  }
  return currentPath.startsWith(tabTo);
}

export function Navbar() {
  const location = useLocation();

  return (
    <Tabs view="clear" style={{ padding: "0 0 0 24px" }}>
      {tabs.map((tab, idx) => (
        <TabLinkItem
          view="divider"
          key={tab.key}
          size="m"
          activeProps={{
            selected: true,
          }}
          selected={isTabActive(tab.to, location.pathname)}
          tabIndex={idx}
          to={tab.to}
          disabled={tab.disabled}
        >
          {tab.label.toUpperCase()}
        </TabLinkItem>
      ))}
    </Tabs>
  );
}
