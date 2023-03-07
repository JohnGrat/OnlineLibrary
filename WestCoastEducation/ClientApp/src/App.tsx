import React, { createContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { NotificationsProvider } from "@mantine/notifications";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { AuthProvider } from "./Providers/auth.provider";
import config from "./config";
import { RouterGuard } from "react-router-guard";
import { SignalRApi } from "./Apis/signalr.service";
import SignalRContext, { SignalRProvider } from "./Providers/signalr.provider";

export const baseUrl = import.meta.env.DEV
  ? import.meta.env.VITE_BASE_URL
  : "/api";

export const App: React.FC = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <MantineProvider theme={{ colorScheme }}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <AuthProvider>
          <SignalRProvider>
            <RouterGuard config={config} />
          </SignalRProvider>
        </AuthProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
};
