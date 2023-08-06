import "./global.css";

import { Button } from "./components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  const invokeScreenshot = async () => {
    const result = await invoke("screen_capture");

    const parsedResult = JSON.parse(result as string);

    if (parsedResult["path"]) {
      setPath(parsedResult["path"]);
    }
  };

  return (
    <div className="container">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <Button type="submit">Click me</Button>
      </form>

      <p>{greetMsg}</p>

      {{ path } && <img src={path} alt="screenshot" />}

      <Button type="button" onClick={() => invokeScreenshot()}>
        Invoke Screenshot
      </Button>
    </div>
  );
}

export default App;
