import { useContext } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import { userFromJwt, hasTokenExpired } from "./jwt.helper";
import AuthContext from "../Providers/auth.provider";
const BASEURL = import.meta.env.VITE_API_BASEURL + '/api'

export const axiosDefaultHeaders : RawAxiosRequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-control-allow-origin': '*'
  }
  
 
const useAxios = (): AxiosInstance => {
    const {accessToken, refreshToken, setAccessToken, setRefreshToken} : any = useContext(AuthContext);

    const useAxios = axios.create({
        baseURL: BASEURL,
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

            const response = await axios.post(BASEURL + `/authenticate/refresh-token`, {
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


