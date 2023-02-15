import axiosApiInstance from '../Helpers/axios.api.instance'

export default function checkAuth() {
    return new Promise(async (resolve, reject) => {
      const accessToken = sessionStorage.access_token;
      const refreshToken = localStorage.refresh_token;
      
      console.log("checkAuth")
      if (accessToken) {
        resolve(null);
      } else if(refreshToken == undefined) {
        reject(new Error('/'));
      } else {
        try{
          const response = await axiosApiInstance.post('/authenticate/refresh-token', { refreshToken });
          sessionStorage.access_token = response.data.accessToken;
          resolve(null);
        }
        catch (error) {
        reject(new Error('/'));
        }
    }
  })
};
