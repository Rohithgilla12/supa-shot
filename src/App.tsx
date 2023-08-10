import "./global.css";

import { toBlob, toPng } from "html-to-image";
import { useRef, useState } from "react";

import { Auth } from "@supabase/auth-ui-react";
import { Button } from "./components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { supabase } from "./data/db";
import { useNavigate } from "react-router-dom";

function App() {
  const [path, setPath] = useState("");
  const [watermark, setWatermark] = useState("");
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { user } = Auth.useUser();

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

  const shareImage = async () => {
    // toFile
    const data = await toBlob(ref.current!, { cacheBust: true });
    const userId = user?.id || "anonymous";

    if (data) {
      const file = new File([data], "screenshot.png", { type: "image/png" });

      const { data: storageData, error } = await supabase.storage
        .from("shots")
        .upload(`${userId}/screenshot-${Date.now()}.png`, file, {
          cacheControl: "3600",
        });

      if (error) {
        console.error(error);
      }

      if (storageData) {
        console.log(storageData.path);
        const path = storageData.path;

        // Get public url
        const url = supabase.storage.from("shots").getPublicUrl(path);

        console.log(url.data.publicUrl);
      }
    }
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
        {user
          ? `Logged in as ${JSON.stringify(user, null, 2)}`
          : "Not logged in"}
      </p>

      <input
        type="text"
        placeholder="Watermark"
        value={watermark}
        onChange={(e) => setWatermark(e.target.value)}
      />

      <Button className="m-4" type="button" onClick={invokeScreenshot}>
        Invoke Screenshot
      </Button>

      <Button className="m-4" type="button" onClick={downloadImage}>
        Download Image
      </Button>

      <Button className="m-4" type="button" onClick={shareImage}>
        Share Image
      </Button>

      <Button className="m-4" type="button" onClick={() => navigate("/auth")}>
        Go to Auth
      </Button>
    </div>
  );
}

export default App;
