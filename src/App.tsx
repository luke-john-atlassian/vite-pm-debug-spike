import { useEffect, useState } from "react";
import { DebugUI } from "./debug-ui/DebugUI";
import { Editor } from "./Editor";

function App() {
  const [showSecondEditor, setShowSecondEditor] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSecondEditor(true);
    }, 1000);
  }, []);

  return (
    <div>
      <Editor />
      {showSecondEditor ? <Editor /> : null}
      <hr />
      <div
        style={{ width: "100%", height: "500px", border: "1px solid black" }}
      >
        <DebugUI />
      </div>
    </div>
  );
}

export default App;
