export interface UserProperties {
    Id: string;
    UserName: string;
    Email: string;
    Role: string;
  }
  
   export class User implements UserProperties {

    Id: string;
    UserName: string;
    Email: string;
    Role: string;

    constructor(props: UserProperties = {
      Id: "",
      UserName: "",
      Email: "",
      Role: "User"
    }) {
      this.Id = props.Id;
      this.UserName = props.UserName;
      this.Email = props.Email;
      this.Role = props.Role
    }

  }
  