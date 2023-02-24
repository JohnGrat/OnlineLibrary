export interface UserProperties {
    id: string;
    displayName: string;
    email: string;
    role: string;
    picture: string;
}

export class User implements UserProperties {
    id: string;
    displayName: string;
    email: string;
    role: string;
    picture: string;

    constructor(
        props: UserProperties = {
            id: "",
            displayName: "",
            email: "",
            role: "User",
            picture: "",
        }
    ) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.email = props.email;
        this.role = props.role;
        this.picture = props.picture;
    }
}