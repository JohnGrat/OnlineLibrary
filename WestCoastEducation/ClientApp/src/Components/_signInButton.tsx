import {
  ColorScheme,
  createStyles,
  LoadingOverlay,
  MediaQuery,
  useMantineColorScheme,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Providers/auth.provider";
declare var google: any;

export function SignInButton({ colorScheme }: { colorScheme: ColorScheme }) {
  const { login }: any = useContext(AuthContext);
  const [visible, setVisible] = useState(true);
  const buttonTheme = colorScheme === "dark" ? "filled_black" : "filled_blue";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      setVisible(false);
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          setVisible(true);
          login(response);
        },
      });

      google.accounts.id.renderButton(document.getElementById("login"), {
        theme: buttonTheme,
        text: "signin_with",
        shape: "rectangular",
        width: 200,
      });

      google.accounts.id.renderButton(document.getElementById("loginSmall"), {
        theme: buttonTheme,
        text: "signin_with",
        shape: "rectangular",
        type: "icon",
        width: 40,
      });
    };

    document.body.appendChild(script);
  }, [login]);
  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={visible} overlayBlur={2} />
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <div id="loginSmall"></div>
      </MediaQuery>
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <div id="login"></div>
      </MediaQuery>
    </div>
  );
}
