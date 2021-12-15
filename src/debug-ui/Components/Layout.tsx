import type React from "react";
import { useState } from "react";

type TabInfo = { label: string };

export function Tabs<Tabs extends TabInfo[]>({
  defaultActiveTab,
  tabs,
  contentComponent,
}: {
  defaultActiveTab?: TabInfo;
  tabs: Tabs;
  contentComponent: (activeTab: Tabs[number]) => React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]);

  function handleTabClick(tab: TabInfo) {
    setActiveTab(tab);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <div
        role="tablist"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tabs.map((tab) => {
          return (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab)}
              role="tab"
              id={getTabId(tab)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={getTabId(activeTab)}
        style={{ flex: "1" }}
      >
        {contentComponent(activeTab)}
      </div>
    </div>
  );
}

function getTabId(tab: TabInfo) {
  return `tab-${tab.label.replace(" ", "_")}`;
}
