import { useContext, useEffect } from "react";
import AuthContext from "../Providers/auth.provider";
declare var google: any;
//const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function SignInButton() {
  const { login }: any = useContext(AuthContext);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "",
        callback: login,
      });

      google.accounts.id.renderButton(document.getElementById("loginDiv"), {
        theme: "filled_black",
        text: "signin_with",
        shape: "pill",
      });
    };

    document.body.appendChild(script);
  }, [login]);
  return (
    <>
      <div id="loginDiv"></div>
    </>
  );
}
