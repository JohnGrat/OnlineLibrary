import AuthorModel from "./author";
import PublisherModel from "./publisher";

export interface IBookBriefModel {
  bookId: string;
  title: string;
  authorsName?: string;
  publicationDate?: Date;
  languageName?: string;
  bookPrice: number;
}

export class BookBriefModel implements IBookBriefModel {
  bookId: string;
  title: string;
  authorsName?: string;
  publicationDate?: Date;
  languageName?: string;
  bookPrice: number;

  constructor(props: IBookBriefModel) {
    this.bookId = props.bookId || "";
    this.title = props.title || "";
    this.authorsName = props.authorsName || "";
    this.publicationDate = props.publicationDate || undefined;
    this.languageName = props.languageName || "";
    this.bookPrice = props.bookPrice || 0;
  }
}

export interface IBookModel {
  id: string;
  title: string;
  numPages?: number;
  publicationDate?: Date;
  publisherId?: number;
  languageName?: string;
  publisher?: PublisherModel;
  authors: AuthorModel[];
  bookPrice: number;
}

export class BookModel implements IBookModel {
  id: string;
  title: string;
  numPages?: number;
  publicationDate?: Date;
  publisherId?: number;
  languageName?: string;
  publisher?: PublisherModel;
  authors: AuthorModel[];
  bookPrice: number;

  constructor(props: IBookModel) {
    this.id = props.id || "";
    this.title = props.title || "";
    this.numPages = props.numPages || undefined;
    this.publicationDate = props.publicationDate || undefined;
    this.publisherId = props.publisherId || undefined;
    this.languageName = props.languageName || "";
    this.publisher = props.publisher || undefined;
    this.authors = props.authors || [];
    this.bookPrice = props.bookPrice || 0;
  }
}
