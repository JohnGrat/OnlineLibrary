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
import { fromJwtToken } from '../Helpers/jwt.helper';


interface AuthServiceProviderProps {
  children?: React.ReactNode;
}

const AccessTokenKey = 'access_token';
const RefreshTokenKey = 'refresh_token';
const UserKey = 'user';

const AuthContext = createContext({});


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const user = getUserStorage();
    if(user){
      setUser(user)
    }
  }, []);

  async function login( response: any ) {
    const res: any = await axiosApiInstance.get('/authenticate/GoogleExternalLogin', {
      headers: {
        "Authorization": "Bearer " + response.credential
      },
    });
    const { accessToken,  refreshToken} = res.data
    updateUser({ accessToken,  refreshToken});
  };

  function logout() {
    setUser(null);
    setUserStorage(null);
    setAccessToken("");
    setRefreshToken("");
  }

  function updateUser(tokens: {accessToken: string, refreshToken: string}) {
    const user = fromJwtToken(tokens.accessToken);
    setUser(user);
    setUserStorage(user)
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  function setAccessToken(token: string) {
    console.log(token)
    if (token) {
      sessionStorage.setItem(AccessTokenKey, token);
    } else {
      sessionStorage.removeItem(AccessTokenKey);
    }
  };

  function setUserStorage(user: User | null) {
    if (user) {
      localStorage.setItem(UserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(UserKey);
    }
  };

  function getUserStorage(): User | null {
    const userString = localStorage.getItem(UserKey);
    if (userString) {
      return JSON.parse(userString);
    } else {
      return null;
    }
  }

  function setRefreshToken(token: string) {
    if (token) {
      localStorage.setItem(RefreshTokenKey, token);
    } else {
      localStorage.removeItem(RefreshTokenKey);
    }
  };

  const memoedValue = useMemo(
    () => ({
      user,
      logout,
      login,
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