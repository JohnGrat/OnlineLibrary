import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = "yoursecretkey";
const baseUrl = "https://localhost:7253/api/authenticate";

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

const decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const authorize = (username, password) => {
  const encodedCredentials = btoa(`${username}:${password}`);
  return axios.get(`${baseUrl}/authorize`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });
};

const revokeAll = () => {
  return axios.post(`${baseUrl}/revoke-all`);
};

const revoke = (username) => {
  return axios.post(`${baseUrl}/revoke/${username}`);
};

const refresh = (refreshToken) => {
  return axios.post(`${baseUrl}/refresh-token`, { refreshToken });
};

const handleAuthorizeSuccess = (response) => {
  const { access_token, refresh_token } = response.data;
  localStorage.setItem("access_token", encrypt(access_token));
  localStorage.setItem("refresh_token", encrypt(refresh_token));
};



export default { authorize, revokeAll, revoke,  refresh, decrypt, handleAuthorizeSuccess };