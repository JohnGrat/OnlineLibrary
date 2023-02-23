import { User } from "../Models/user";
import jwt_decode from "jwt-decode";

export function hasTokenExpired(token: string): boolean {
  const decoded: any = jwt_decode(token);
  const now: number = Date.now() / 1000;

  if (decoded.exp < now) {
    return true;
  }
  return false;
}

export function userFromJwt(token: string): User {
  var decoded: any = jwt_decode(token);
  return new User({
    id: decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
    displayName:
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    email:
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    role: decoded[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
    picture: decoded["picture"],
  });
}
