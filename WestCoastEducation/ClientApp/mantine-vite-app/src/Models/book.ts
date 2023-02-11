export interface IBookBriefModel {
  id: string;
  title: string;
  authorsName?: string;
  publicationDate?: Date;
  languageName?: string;
  bookPrice: number;
}

export default class BookBriefModel implements IBookBriefModel {
  id: string;
  title: string;
  authorsName?: string;
  publicationDate?: Date;
  languageName?: string;
  bookPrice: number;

  constructor(props: IBookBriefModel) {
      this.id = props.id || '';
      this.title = props.title || '';
      this.authorsName = props.authorsName || '';
      this.publicationDate = props.publicationDate || undefined;
      this.languageName = props.languageName || '';
      this.bookPrice = props.bookPrice || 0;
  }
}