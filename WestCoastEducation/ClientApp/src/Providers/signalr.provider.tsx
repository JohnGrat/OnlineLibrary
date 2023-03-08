import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { SignalRApi } from "../Apis/signalr.service";
import AuthContext from "./auth.provider";
import { User } from "../Models/user";


type SignalRContextType = {
    isConnected: boolean;
  };
  
  const SignalRContext = createContext<SignalRContextType>({
    isConnected: false,
  });

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const { user }: Partial<{ user: User }> = useContext(AuthContext)

    useEffect(() => {
      const signalR = async () => {
        if (SignalRApi.connectionState === HubConnectionState.Disconnected) {
          await SignalRApi.startConnection();
          setIsConnected(true);
        } else if (SignalRApi.connectionState === HubConnectionState.Connected) {
          setIsConnected(false);
          await SignalRApi.disconnect();
          await SignalRApi.startConnection();
          setIsConnected(true);
        }
      };
      signalR();
    }, [user]);


  let contextData = {
    isConnected: isConnected,
  };

  return (
    <SignalRContext.Provider value={contextData}>{children}</SignalRContext.Provider>
  );
};


export default SignalRContext;