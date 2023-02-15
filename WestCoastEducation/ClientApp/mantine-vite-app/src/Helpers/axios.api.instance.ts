import axios, { AxiosRequestConfig } from 'axios';
const BASEURL = import.meta.env.VITE_API_BASEURL

const axiosApiInstance = axios.create({
  baseURL: BASEURL
});
axiosApiInstance.defaults.headers.common.Accept = 'application/json'  
axiosApiInstance.defaults.headers.common['Access-control-allow-origin'] = '*'
axiosApiInstance.defaults.headers.common['Content-Type'] = 'application/json'

axiosApiInstance.interceptors.request.use(async (config : any) => {
  if (config.url !== '/authenticate/GoogleExternalLogin') {
    
    const key = sessionStorage.access_token;
    config.headers['Authorization'] = `Bearer ${key}` ;
  }
  return config;
}, error => Promise.reject(error));

axiosApiInstance.interceptors.response.use(response => response, async error => {
  if (error.response.status === 401 && !error.config._retry) {

    error.config._retry = true;
    const refreshToken = localStorage.refresh_token;

    const response = await axiosApiInstance.post('/authenticate/refresh-token', { refreshToken });
    sessionStorage.access_token = response.data.accessToken
    localStorage.refresh_token = response.data.refreshToken

    return axiosApiInstance(error.config);
  }

  return Promise.reject(error);
});

export default axiosApiInstance;