import axiosApiInstance from '../Helpers/axios.api.instance'
import { jwtHasExpired, fromJwtToken } from '../Helpers/jwt.helper';

export default function checkAuth() {
    return new Promise(async (resolve, reject) => {
      const accessToken = localStorage.access_token;
      const refreshToken = localStorage.refresh_token;
  
      if (accessToken && !jwtHasExpired(accessToken)) {
        resolve({ user : fromJwtToken(accessToken) });
      } 
      else if (refreshToken == undefined) {
        reject(new Error('/login'));
      } 
      else {
        try {
            const response = await axiosApiInstance.post('/authenticate/refresh-token', { accessToken, refreshToken });
            resolve({ user : fromJwtToken(response.data.accessToken) });
          } catch (error) {
            reject(new Error('/login'));
          }
      }

    });
  }