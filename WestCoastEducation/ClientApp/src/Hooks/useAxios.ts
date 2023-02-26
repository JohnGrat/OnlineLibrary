import axios, { AxiosInstance, RawAxiosRequestHeaders } from "axios";
import { baseUrl } from "../App";

export const axiosDefaultHeaders: RawAxiosRequestHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-control-allow-origin": "*",
};

const useAxios = (): AxiosInstance => {
  const useAxios = axios.create({
    baseURL: baseUrl,
    headers: {
      ...axiosDefaultHeaders,
    },
  });

  return useAxios;
};

export default useAxios;
