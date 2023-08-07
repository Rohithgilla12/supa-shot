import "./styles.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { SupaAuth } from "./routes/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <SupaAuth />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
