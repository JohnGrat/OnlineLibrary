export interface CommentDto {
  id: number;
  bookId: string;
  postedAt: Date;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

export interface CreateCommentDto {
  bookId: string;
  body: string;
}
