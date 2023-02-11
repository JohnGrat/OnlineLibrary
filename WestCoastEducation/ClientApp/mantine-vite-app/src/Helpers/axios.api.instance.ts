import axios, { AxiosRequestConfig } from 'axios';

const axiosApiInstance = axios.create({
  baseURL: 'https://localhost:7253/api'
});
axiosApiInstance.defaults.headers.common.Accept = 'application/json'  
axiosApiInstance.defaults.headers.common['Access-control-allow-origin'] = '*'
axiosApiInstance.defaults.headers.common['Content-Type'] = 'application/json'

axiosApiInstance.interceptors.request.use(async (config : any) => {
  if (config.url !== '/authenticate/authorize') {
    const key = localStorage.access_token;
    config.headers['Authorization'] = `Bearer ${key}` ;
  }
  return config;
}, error => Promise.reject(error));

axiosApiInstance.interceptors.response.use(response => response, async error => {

  if (error.response.status === 401 && !error.config._retry) {

    error.config._retry = true;

    const accessToken = localStorage.access_token;
    const refreshToken = localStorage.refresh_token;

    const response = await axiosApiInstance.post('/authenticate/refresh-token', { accessToken, refreshToken });

    localStorage.access_token = response.data.access_token
    localStorage.refresh_token = response.data.refresh_token

    return axiosApiInstance(error.config);
  }

  return Promise.reject(error);
});




export default axiosApiInstance;