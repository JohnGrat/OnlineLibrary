import { HubConnectionState } from "@microsoft/signalr";
import React, { StrictMode, useEffect, useState } from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import { SignalRApi } from "./Apis/signalr.service";
import { App } from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

function AppRenderer() {

  useEffect(() => {
    async function establishConnection() {
      await SignalRApi.startConnection();
    }
    establishConnection();
  }, []);
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

root.render(<AppRenderer />);
