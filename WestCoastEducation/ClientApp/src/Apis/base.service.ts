import axios, { RawAxiosRequestHeaders, type AxiosInstance } from "axios";

const axiosDefaultHeaders: RawAxiosRequestHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-control-allow-origin": "*",
};

export abstract class BaseService {
  protected readonly $http: AxiosInstance;

  protected constructor(controller: string, timeout: number = 50000) {
    const baseUrl = import.meta.env.DEV
      ? import.meta.env.VITE_BASE_URL
      : "/api";

    this.$http = axios.create({
      timeout,
      baseURL: `${baseUrl}/${controller}/`,
      headers: {
        ...axiosDefaultHeaders,
      },
    });
  }
}
