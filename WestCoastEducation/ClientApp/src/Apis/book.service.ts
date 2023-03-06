import { BookBriefModel, BookModel } from "../Models/book";
import { BaseService } from "./base.service";

class BookService extends BaseService {
  private static _bookService: BookService;
  private static _controller: string = "book";

  private constructor(name: string) {
    super(name);
  }

  public static get Instance(): BookService {
    return (
      this._bookService || (this._bookService = new this(this._controller))
    );
  }

  public async GetAllBooks(
    query: string,
    page: number,
    pageSize: number
  ): Promise<BookBriefModel[]> {
    const url = `?filter=${query}&page=${page}&pageSize=${pageSize}`;
    const { data } = await this.$http.get<BookBriefModel[]>(url);
    return data;
  }

  public async GetOneBook(id: string): Promise<BookModel> {
    const url = `${id}`;
    const { data } = await this.$http.get<BookModel>(url);
    return data;
  }
}

export const BookApi = BookService.Instance;
