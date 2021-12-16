import React, { createContext, useContext, useEffect, useState } from "react";
import { backendDebugInterface, TrackedEditor } from "../backend/backend";

const initListOfTrackedEditors = Object.values(
  backendDebugInterface.trackedEditors
);

const appStateContext = createContext({
  backendDebugInterface,
  listOfTrackedEditors: initListOfTrackedEditors,
  activeTrackedEditor: initListOfTrackedEditors.length
    ? initListOfTrackedEditors[0]
    : null,
  setActiveTrackedEditor: (activeTrackedEditor: TrackedEditor | null) => {
    return;
  },
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [liveBackendDebugInterface, setLiveBackendDebugInterface] = useState(
    backendDebugInterface
  );
  const listOfTrackedEditors = Object.values(
    liveBackendDebugInterface.trackedEditors
  );
  const [activeTrackedEditor, setActiveTrackedEditor] = useState(() => {
    return listOfTrackedEditors.length ? listOfTrackedEditors[0] : null;
  });

  useEffect(() => {
    setInterval(() => {
      setLiveBackendDebugInterface({
        trackedEditors: {
          ...backendDebugInterface.trackedEditors,
        },
      });
    }, 100);
  }, []);

  useEffect(() => {
    setActiveTrackedEditor(listOfTrackedEditors[0]);
  }, [listOfTrackedEditors.length !== 0]);

  return (
    <appStateContext.Provider
      value={{
        backendDebugInterface: liveBackendDebugInterface,
        listOfTrackedEditors,
        activeTrackedEditor,
        setActiveTrackedEditor,
      }}
    >
      {children}
    </appStateContext.Provider>
  );
}

export function useAppStateContextValue() {
  const appStateContextValue = useContext(appStateContext);

  return appStateContextValue;
}
