import axios, { AxiosResponse } from "axios";
import axiosApiInstance from '../helpers/axios.api.instance'
import CryptoJS from "crypto-js";

const secretKey = "yoursecretkey";
const baseUrl = "https://localhost:7253/api/authenticate";

const encrypt = (data: any) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

const decrypt = (data: any) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const revokeAll = () => {
  return axiosApiInstance.post(`${baseUrl}/revoke-all`);
};

const revoke = (username: string) => {
  return axiosApiInstance.post(`${baseUrl}/revoke/${username}`);
};

const refresh = async (accessToken: string, refreshToken: string) => {
  const response = await axiosApiInstance.post(`${baseUrl}/refresh-token`, { accessToken, refreshToken });
  handleAuthorizeSuccess(response)
};

const handleAuthorizeSuccess = (response: AxiosResponse) => {
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem("access_token", encrypt(accessToken));
  localStorage.setItem("refresh_token", encrypt(refreshToken));
};

const authorize = async (username: string, password: string) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  const response = await axiosApiInstance.get(`${baseUrl}/authorize`, {
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
    },
  });
  handleAuthorizeSuccess(response);
};


export default { authorize, revokeAll, revoke, refresh, decrypt };