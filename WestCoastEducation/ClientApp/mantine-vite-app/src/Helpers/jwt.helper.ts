import { User } from "../Models/user";
import jwt_decode from "jwt-decode";


export function jwtHasExpired(token: string) : Boolean{
    var decoded : any = jwt_decode(token);

    var dt = new Date(0);
    dt.setUTCSeconds(decoded["exp"]);
    
    return dt < new Date();
}


export function fromJwtToken(token: string): User {
    var decoded : any = jwt_decode(token);

    return new User({
      Id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      UserName: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      Email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      Role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    });
}