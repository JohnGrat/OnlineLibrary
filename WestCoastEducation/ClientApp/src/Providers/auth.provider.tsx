import React, { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../Models/user";
import axios from "axios";
import { axiosDefaultHeaders } from "../Hooks/useAxios";
import { baseUrl } from "../App";

const AuthContext = createContext({});
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(getUserStorage());

  async function login(response: any) {
    const url = `${baseUrl}/auth/googleexternallogin`;
    const res: any = await axios.get(url, {
      headers: {
        ...axiosDefaultHeaders,
        Authorization: `Bearer ${response.credential}`,
      },
      withCredentials: true,
    });
    if (res.status === 200) {
      const res = await axios.get(`${baseUrl}/auth/me`, {
        headers: {
          ...axiosDefaultHeaders,
        },
        withCredentials: true,
      });

      setUser(res.data);
    }
  }

  function logout() {
    setUser(null);
  }

  function setUserStorage(user: User | null) {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }

  useEffect(() => {
    if (user) {
      setUserStorage(user);
    } else {
      setUserStorage(null);
    }
  }, [user]);

  let contextData = {
    user: user,
    setUser: setUser,
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
