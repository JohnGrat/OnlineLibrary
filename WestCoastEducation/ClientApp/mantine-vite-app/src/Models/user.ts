export interface UserProperties {
    id: string;
    userName: string;
    email: string;
    role: string;
    picture: string;
  }
  
   export class User implements UserProperties {

    id: string;
    userName: string;
    email: string;
    role: string;
    picture: string;

    constructor(props: UserProperties = {
      id: "",
      userName: "",
      email: "",
      role: "User",
      picture: "",
    }) {
      this.id = props.id;
      this.userName = props.userName;
      this.email = props.email;
      this.role = props.role
      this.picture = props.picture
    }

  }
  