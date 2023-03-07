import { createContext, ReactNode, useEffect, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { SignalRApi } from "../Apis/signalr.service";


type SignalRContextType = {
    isConnected: HubConnectionState;
  };
  
  const SignalRContext = createContext<SignalRContextType>({
    isConnected: HubConnectionState.Disconnected,
  });

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(HubConnectionState.Disconnected);

  useEffect(() => {
    async function establishConnection() {
      await SignalRApi.startConnection();
      console.log(SignalRApi.connectionState)
      setIsConnected(SignalRApi.connectionState)
    }
    if(SignalRApi.connectionState === HubConnectionState.Disconnected){
        establishConnection();
    }
  }, []);

  let contextData = {
    isConnected: isConnected,
  };

  return (
    <SignalRContext.Provider value={contextData}>{children}</SignalRContext.Provider>
  );
};


export default SignalRContext;