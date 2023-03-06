import { AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../Models/user";
import { BaseService } from "./base.service";

class AuthService extends BaseService {
  private static _authService: AuthService;
  private static _controller: string = "auth";

  private constructor(name: string) {
    super(name);
  }

  public static get Instance(): AuthService {
    return (
      this._authService || (this._authService = new this(this._controller))
    );
  }

  public async webLogoutAsync(): Promise<AxiosResponse> {
    const config = {
      ...this.$http.defaults.headers,
      withCredentials: true,
    };
    return await this.$http.get("logout", config);
  }

  public async loginAsync(credentials: string): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: credentials,
      },
      withCredentials: true,
    };
    return await this.$http.get<AxiosResponse>("googleexternallogin", config);
  }

  public async getLoggedInUser(): Promise<User> {
    const config = {
      ...this.$http.defaults.headers,
      withCredentials: true,
    };
    const { data } = await this.$http.get<User>("me", config);
    return data;
  }
}

export const authApi = AuthService.Instance;
