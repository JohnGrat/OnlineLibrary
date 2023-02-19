import { BookBriefModel } from "./book";

export interface IPublisherModel {
    id: number;
    publisherName?: string;
    books: BookBriefModel[];
  }
  
  export default class PublisherModel implements IPublisherModel {
    id: number;
    publisherName?: string;
    books: BookBriefModel[];
  
    constructor(props: IPublisherModel) {
      this.id = props.id;
      this.publisherName = props.publisherName;
      this.books = props.books;
    }
  }