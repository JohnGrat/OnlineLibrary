import React, { StrictMode, useEffect } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { SignalRApi } from "./Apis/signalr.service";
import { App } from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

function AppRenderer() {
  useEffect(() => {
    setTimeout(() => {
      SignalRApi.startConnection();
    }, 250);
  }, []);
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

root.render(<AppRenderer />);
