
import { useEffect } from 'react';
import  useAuth from '../Providers/auth.provider';
declare var google: any;
declare var window: any;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

  export function SignIn() {
    const { login  } : any = useAuth();
    useEffect(() => {

      if (window.google) {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: login,
        });
  
        google.accounts.id.renderButton(document.getElementById("loginDiv"), {
          theme: "filled_black",
          text: "signin_with",
          shape: "pill",
        });
  
      }
    }, [login]);
  
  
  return(<><div id="loginDiv"></div></>)
  
  }