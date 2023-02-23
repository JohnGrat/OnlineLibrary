import { useContext } from "react";
import axios, { AxiosInstance, RawAxiosRequestHeaders } from "axios";
import { hasTokenExpired } from "../Helpers/jwt.helper";
import AuthContext from "../Providers/auth.provider";

export const axiosDefaultHeaders : RawAxiosRequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-control-allow-origin': '*'
  }
  
 
const useAxios = (): AxiosInstance => {
    const {accessToken, refreshToken, setAccessToken, setRefreshToken} : any = useContext(AuthContext);

    const useAxios = axios.create({
        baseURL: '/api',
        headers: {
            ...axiosDefaultHeaders, 
        }
      });
    
      useAxios.interceptors.request.use(async (req : any) => {

        if (accessToken && !hasTokenExpired(accessToken)){
            req.headers['Authorization'] = `Bearer ${accessToken}` ;
            return req
        } 
        else if(refreshToken != undefined) {

            const response = await axios.post('/auth/refresh-token', {
                refreshToken
            }, { headers: axiosDefaultHeaders});
            
            sessionStorage.access_token = response.data.accessToken
            localStorage.refresh_token = response.data.refreshToken

            setAccessToken(response.data.accessToken)
            setRefreshToken(response.data.refreshToken)
                
            req.headers['Authorization'] = `Bearer ${response.data.accessToken}` ;
        }
        return req
    }) 
    return useAxios
}

export default useAxios;


