import { User } from "../Models/user";
import jwt_decode from "jwt-decode";

export function fromJwtToken(token: string): User {
    var decoded : any = jwt_decode(token);

    return new User({
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      userName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      picture: decoded["picture"],
    });
}