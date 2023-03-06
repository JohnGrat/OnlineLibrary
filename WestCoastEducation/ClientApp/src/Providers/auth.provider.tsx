import React, { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../Models/user";
import axios from "axios";
import { baseUrl } from "../App";
import { authApi } from "../Apis/auth.service";

const AuthContext = createContext({});
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUserStorage());

  async function login(response: any) {
    const res = await authApi.loginAsync(`Bearer ${response.credential}`);
    if (res.status === 200) {
      const user = await authApi.getLoggedInUser();
      setUser(user);
    }
  }

  function logout() {
    try {
      authApi.webLogoutAsync();
    } catch (error) {
      console.log(error);
    } finally {
      setUser(null);
    }
  }

  function setUserStorage(user: User | null) {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }

  useEffect(() => {
    setUserStorage(user);
  }, [user]);

  let contextData = {
    user: user,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export function getUserStorage(): User | null {
  const userString = localStorage.getItem("user");
  if (userString) {
    return JSON.parse(userString);
  } else {
    return null;
  }
}
