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

          // sizes+colors copied from chrome devtools (Memory)
          background: "rgb(241, 243, 244)",
          borderRight: "1px solid rgb(202, 205, 209)",
          width: "130px",
        }}
      >
        {tabs.map((tab) => {
          const isActiveTab = tab.label === activeTab.label;

          return (
            <button
              style={{
                // sizes+colors copied from chrome devtools (Memory)
                ...(isActiveTab
                  ? {
                      backgroundColor: "rgb(218, 218, 218)",
                      color: "rgb(90, 90, 90)",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      color: "rgb(160 165 169);",
                    }),
                height: "36px",
                cursor: "pointer",
                border: "none",
              }}
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
