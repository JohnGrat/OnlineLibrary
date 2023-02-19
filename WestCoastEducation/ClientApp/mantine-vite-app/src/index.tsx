import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { AuthProvider } from "./Providers/auth.provider";
import { RouterGuard } from "react-router-guard";
import config from "./config";


const Index: React.FC = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <MantineProvider theme={{colorScheme}}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <NotificationsProvider>
           <AuthProvider>
              <RouterGuard config={config} />
            </AuthProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
};

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);