import "./global.css";

import { Button } from "./components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [path, setPath] = useState("");
  const navigate = useNavigate();

  const invokeScreenshot = async () => {
    const result = await invoke("screen_capture");

    const parsedResult = JSON.parse(result as string);

    if (parsedResult["path"]) {
      setPath(parsedResult["path"]);
    }
  };

  return (
    <div className="container">
      {path.length > 0 ? <img src={path} alt="screenshot" /> : <h1>Home</h1>}

      <Button type="button" onClick={() => invokeScreenshot()}>
        Invoke Screenshot
      </Button>

      <Button type="button" onClick={() => navigate("/auth")}>
        Go to Auth
      </Button>
    </div>
  );
}

export default App;
