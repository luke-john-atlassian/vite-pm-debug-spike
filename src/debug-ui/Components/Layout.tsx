import type React from "react";
import { createContext, useContext, useState } from "react";

const detailsContext = createContext({
  open: false,
  setOpen: (arg: boolean | ((prevState: boolean) => boolean)) => {},
});
export function Details({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <detailsContext.Provider value={{ open, setOpen }}>
      <details style={{}} open={open}>
        {children}
      </details>
    </detailsContext.Provider>
  );
}
export function Summary({
  children,
  isTop = false,
  isBottom = false,
}: {
  children: React.ReactNode;
  isTop?: boolean;
  isBottom?: boolean;
}) {
  const { open, setOpen } = useContext(detailsContext);
  return (
    <summary
      onClick={(event) => {
        event.preventDefault();
        setOpen((open) => !open);
      }}
      style={{
        // sizes+colors copied from chrome devtools (Elements>Layout)
        backgroundColor: "rgb(241, 243, 244)",
        borderBottom:
          isBottom || open ? "1px solid rgb(202, 205, 209)" : undefined,
        borderTop: !isTop ? "1px solid rgb(202, 205, 209)" : undefined,
        fontSize: "12px",
        lineHeight: "20px",
        padding: "2px 8px 0px",
        color: "rgb(48 57 66)",
      }}
    >
      {children}
    </summary>
  );
}

export function DetailsContent({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0 5px" }}>{children}</div>;
}

type TabInfo = { label: string };

export function SideTabs<Tabs extends TabInfo[]>({
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
                      color: "rgb(51, 51, 51)",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      color: "rgb(160 165 169)",
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

export function TopTabs<Tabs extends TabInfo[]>({
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
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        role="tablist"
        style={{
          display: "flex",
          flexDirection: "row",

          // sizes+colors copied from chrome devtools (Memory)
          background: "rgb(241, 243, 244)",
          borderBottom: "1px solid rgb(202, 205, 209)",
        }}
      >
        {tabs.map((tab, index) => {
          const isActiveTab = tab.label === activeTab.label;

          return (
            <button
              style={{
                // sizes+colors copied from chrome devtools
                backgroundColor: "rgba(0, 0, 0, 0)",
                color: "rgb(51, 51, 51)",

                borderTop: "2px solid rgb(0, 0, 0, 0)",
                ...(isActiveTab
                  ? { borderBottom: "2px solid rgb(26, 115, 232)" }
                  : { borderBottom: "2px solid rgb(0, 0, 0, 0)" }),

                marginBottom: "-1px",

                marginLeft: index ? "5px" : 0,

                height: "23px",
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
        style={{ flex: "1", overflow: "scroll" }}
      >
        {contentComponent(activeTab)}
      </div>
    </div>
  );
}

export function ContentArea({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "5px 5px" }}>{children}</div>;
}
