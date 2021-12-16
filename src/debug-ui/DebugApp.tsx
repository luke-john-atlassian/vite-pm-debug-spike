import { AppStateProvider } from "./AppStateProvider";
import { DebugUI } from "./DebugUI";

export function DebugApp() {
  return (
    <AppStateProvider>
      <DebugUI />
    </AppStateProvider>
  );
}
