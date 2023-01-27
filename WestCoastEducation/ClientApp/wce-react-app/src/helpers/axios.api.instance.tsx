import authService from '../services/auth.service';
import axios from 'axios';

const baseUrl = "https://localhost:7253/api/authenticate";

const axiosApiInstance = axios.create();
axiosApiInstance.defaults.headers.common.Accept = 'application/json'  
axiosApiInstance.defaults.headers.common['Access-control-allow-origin'] = '*'
axiosApiInstance.defaults.headers.common['Content-Type'] = 'application/json'

axiosApiInstance.interceptors.request.use(async config => {
  if (config.url !== `${baseUrl}/authorize`) {
    const key = localStorage.access_token;
    const decryptedKey = authService.decrypt(key);
    config.headers.Authorization = `Bearer ${decryptedKey}`;
  }
  return config;
}, error => Promise.reject(error));

axiosApiInstance.interceptors.response.use(response => response, async error => {

  if (error.response.status === 401 && !error.config._retry) {

    error.config._retry = true;

    const encryptedRefresh = localStorage.refresh_token;
    const encryptedAccess = localStorage.access_token;
    const refreshKey = authService.decrypt(encryptedRefresh)
    const accessKey = authService.decrypt(encryptedAccess)

    await authService.refresh(accessKey, refreshKey);

    return axiosApiInstance(error.config);
  }

  return Promise.reject(error);
});

export default axiosApiInstance;