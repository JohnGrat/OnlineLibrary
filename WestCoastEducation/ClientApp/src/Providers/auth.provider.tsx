import React, {
    createContext,
    ReactNode,
    useEffect,
    useState,
} from "react";
import { User } from '../Models/user';
import { userFromJwt } from '../Helpers/jwt.helper';
import axios from "axios";
import { axiosDefaultHeaders } from "../Hooks/useAxios";
import { baseUrl } from "../App";

const AuthContext = createContext({});
export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(getUserStorage())
    let [refreshToken, setRefreshToken] = useState(localStorage.refresh_token ? localStorage.refresh_token as string : null)
    let [accessToken, setAccessToken] = useState(sessionStorage.access_token ? sessionStorage.access_token as string : null)

    async function login(response: any) {
        const url = `${baseUrl}/auth/googleexternallogin`;
        const res: any = await axios.get(url, {
            headers: {
                ...axiosDefaultHeaders,
                Authorization: `Bearer ${response.credential}`,
            },
        });
        if (res.status === 200) {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);
        }
    };

    function logout() {
        setAccessToken(null);
        setRefreshToken(null);
    }

    function setAccessTokenStorage(token: string | null) {
        if (token) {
            sessionStorage.setItem('access_token', token);
        } else {
            sessionStorage.removeItem('access_token');
        }
    };

    function setRefreshTokenStorage(token: string | null) {
        if (token) {
            localStorage.setItem('refresh_token', token);
        } else {
            localStorage.removeItem('refresh_token');
        }
    };

    function setUserStorage(user: User | null) {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    useEffect(() => {
        if (accessToken) {
            const user = userFromJwt(accessToken);
            setUser(user);
            setUserStorage(user);
            setAccessTokenStorage(accessToken);
        } else {
            setAccessTokenStorage(null);
        }
    }, [accessToken])

    useEffect(() => {
        if (refreshToken) {
            setRefreshTokenStorage(refreshToken);
        } else {
            setUserStorage(null);
            setRefreshTokenStorage(null);
        }
    }, [refreshToken])

    let contextData = {
        user: user,
        setUser: setUser,
        refreshToken: refreshToken,
        setRefreshToken: setRefreshToken,
        accessToken: accessToken,
        setAccessToken: setAccessToken,
        login: login,
        logout: logout,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export function getUserStorage(): User | null {
    const userString = localStorage.getItem('user');
    if (userString) {
        return JSON.parse(userString);
    } else {
        return null;
    }
}