import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from '../Models/user';
import axiosApiInstance from '../Helpers/axios.api.instance'
import { jwtHasExpired,  fromJwtToken } from '../Helpers/jwt.helper';


interface AuthServiceProviderProps {
  children?: React.ReactNode;
}

const AccessTokenKey = 'access_token';
const RefreshTokenKey = 'refresh_token';


const AuthContext = createContext({});


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User>();


  useEffect(() => {
    const tokens : any = {
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken(),
    };

    if (tokens.accessToken && tokens.refreshToken) {
      updateUser(tokens);
    }
  }, []);

  async function login(user: { username: string, password: string }) {
    const encodedCredentials = btoa(`${user.username}:${user.password}`);
    const response: any = await axiosApiInstance.get('/authenticate/authorize', {
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });
    updateUser(response.data);
  };

  function logout() {
    updateUser({ accessToken: null, refreshToken: null });
  }


  function updateUser(tokens: { accessToken: string | null, refreshToken: string | null }) {
    if (tokens.accessToken === null || tokens.refreshToken === null) {
      setUser(undefined);
      setAccessToken("");
      setRefreshToken("");
      return;
    }
  
    const data = fromJwtToken(tokens.accessToken);
    setUser(data);
  
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  function setAccessToken(token: string) {
    if (token) {
      localStorage.setItem(AccessTokenKey, token);
    } else {
      localStorage.removeItem(AccessTokenKey);
    }
  };

  function setRefreshToken(token: string) {
    if (token) {
      localStorage.setItem(RefreshTokenKey, token);
    } else {
      localStorage.removeItem(RefreshTokenKey);
    }
  };

  function getAccessToken(){
    return localStorage.getItem(AccessTokenKey);
  };

  function getRefreshToken(){
    return localStorage.getItem(RefreshTokenKey);
  };


  const memoedValue = useMemo(
    () => ({
      user,
      login,
      logout

    }),
    [user]
  );


  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  );

}

export default function useAuth() {
  return useContext(AuthContext);
}