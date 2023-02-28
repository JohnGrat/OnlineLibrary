import { LoadingOverlay, MediaQuery } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Providers/auth.provider";
declare var google: any;

export function SignInButton() {
  const { login }: any = useContext(AuthContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: login,
      });

      google.accounts.id.renderButton(document.getElementById("login"), {
        theme: "filled_black",
        text: "signin_with",
        shape: "rectangular",
      });

      google.accounts.id.renderButton(document.getElementById("loginSmall"), {
        theme: "filled_black",
        text: "signin_with",
        shape: "rectangular",
        type: "icon",
      });
    };

    document.body.appendChild(script);
  }, [login]);
  return (
    <>
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <div id="loginSmall"></div>
      </MediaQuery>
      <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
        <div id="login"></div>
      </MediaQuery>      
    </>
  );
}
