import { BookBriefModel } from "./book";

export interface IAuthorModel {
    id: number;
    authorBirthday?: Date;
    authorEmail?: string;
    authorPhoneNumber?: string;
    authorName?: string;
    books: BookBriefModel[];
}

export default class AuthorModel implements IAuthorModel {
    id: number;
    authorBirthday?: Date;
    authorEmail?: string;
    authorPhoneNumber?: string;
    authorName?: string;
    books: BookBriefModel[];

    constructor(props: IAuthorModel) {
        this.id = props.id;
        this.authorBirthday = props.authorBirthday;
        this.authorEmail = props.authorEmail;
        this.authorPhoneNumber = props.authorPhoneNumber;
        this.authorName = props.authorName;
        this.books = props.books;
    }
}