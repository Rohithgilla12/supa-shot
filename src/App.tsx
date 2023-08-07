import "./global.css";

import { useEffect, useRef, useState } from "react";

import { Button } from "./components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { supabase } from "./data/db";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";

function App() {
  const [path, setPath] = useState("");
  const [watermark, setWatermark] = useState("");
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const invokeScreenshot = async () => {
    const result = await invoke("screen_capture");

    const parsedResult = JSON.parse(result as string);

    if (parsedResult["path"]) {
      setPath(parsedResult["path"]);
    }
  };

  const downloadImage = async () => {
    const data = await toPng(ref.current!, { cacheBust: true });

    console.log(data);
  };

  return (
    <div className="flex flex-col">
      {path.length > 0 ? (
        <div ref={ref} className="relative w-full h-2/3">
          <p className="absolute z-20 text-yellow-50 bottom-16 right-24">
            {watermark.length > 0 ? `@${watermark}` : ""}
          </p>
          <img src={path} alt="screenshot" className="img z-0" />
        </div>
      ) : (
        <h1>Home</h1>
      )}
      <p>
        {session
          ? `Logged in as ${JSON.stringify(session, null, 2)}`
          : "Not logged in"}
      </p>

      <input
        type="text"
        placeholder="Watermark"
        value={watermark}
        onChange={(e) => setWatermark(e.target.value)}
      />

      <Button className="m-4" type="button" onClick={() => invokeScreenshot()}>
        Invoke Screenshot
      </Button>

      <Button className="m-4" type="button" onClick={downloadImage}>
        Download Image
      </Button>

      <Button className="m-4" type="button" onClick={() => navigate("/auth")}>
        Go to Auth
      </Button>
    </div>
  );
}

export default App;
