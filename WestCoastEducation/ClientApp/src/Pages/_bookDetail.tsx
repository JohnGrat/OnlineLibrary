import {
  Button,
  Card,
  Group,
  LoadingOverlay,
  Skeleton,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { BookModel } from "../Models/book";
import { hasLength, useForm } from "@mantine/form";
import { CommentHtml } from "../Components/_comment";
import { User } from "../Models/user";
import AuthContext from "../Providers/auth.provider";
import { BookApi } from "../Apis/book.service";
import { SignalRApi } from "../Apis/signalr.service";
import { CommentDto, CreateCommentDto } from "../Models/comment";
import SignalRContext from "../Providers/signalr.provider";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

const PRIMARY_COL_HEIGHT = 300;

export const bookDetail = (props: any) => {
  const { isConnected } = useContext(SignalRContext);
  const [book, setbook] = useState<BookModel>();
  const [visible, setVisible] = useState(true);
  const { comments, loadingComment, addComment } = useSignalRConnection(
    props.match.params.id, isConnected
  );
  const { user }: Partial<{ user: User }> = useContext(AuthContext);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      body: "",
      bookId: props.match.params.id,
    },

    validate: {
      body: hasLength({ min: 3 }, "comment must be atleast 3 charathers"),
    },
  });

  const load = async () => {
    const response = await BookApi.GetOneBook(props.match.params.id);
    setbook(response);
    setVisible(false);
  };

  useEffect(() => {
    load();
  }, []);

  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

  return (
    <Card p="xl">
      <LoadingOverlay overlayOpacity={0.4} visible={visible} />

      <Card.Section p="xl">
        <Title weight={500}>Details</Title>
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Title weight={400}>{book?.title}</Title>
        </Group>
        <Text weight={300}>Pages: {book?.numPages}</Text>
        <Text weight={300}>
          Authors: {book?.authors.flatMap((a) => a.authorName).join(", ")}
        </Text>
        <Text weight={300}>Language: {book?.languageName}</Text>
        <Text weight={300}>
          Publication:{" "}
          {book?.publicationDate
            ? dayjs(book?.publicationDate).format("YYYY-MM-DD")
            : null}
        </Text>
        <Text weight={300}>Publisher: {book?.publisher?.publisherName}</Text>
        <Text weight={300}>Price: ${book?.bookPrice}</Text>
      </Card.Section>

      <Card.Section p="xl">
        <form onSubmit={form.onSubmit((values) => {
          addComment(values)
          form.reset();
        })}>
          <Textarea
            label="Your comment"
            placeholder={
              user ? "Your comment" : "You must be logged in to comment"
            }
            {...form.getInputProps("body")}
          />
          <Button disabled={!user} type="submit" mt="sm">
            Submit
          </Button>
        </form>
      </Card.Section>

      <Card.Section p="xl">
        <div hidden={!loadingComment}>
          <Skeleton height={50} circle mb="xl" visible={loadingComment} />
          <Skeleton height={8} radius="xl" visible={loadingComment} />
          <Skeleton height={8} mt={6} radius="xl" visible={loadingComment} />
          <Skeleton
            height={8}
            mt={6}
            width="70%"
            radius="xl"
            visible={loadingComment}
          />
        </div>

        {comments
          .sort((a, b) => b.id - a.id)
          .map((comment) => (
            <CommentHtml
              key={comment.id}
              postedAt={new Date(comment.postedAt).toDateString()}
              body={comment.body}
              author={comment.author}
            />
          ))}
      </Card.Section>
    </Card>
  );
};

export const useSignalRConnection = (bookId: string, isConnected: any) => {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loadingComment, setLoadingComment] = useState(false);

  const getInitialComments = async (bookId: string) => {
    try {
      const initialComments = await SignalRApi.getCommentsForBook(bookId);
      setComments(initialComments);
      setLoadingComment(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewComment = (comment: CommentDto) => {
    setLoadingComment(true);
    setTimeout(() => {
      setComments((prevComments) => [...prevComments, comment]);
      setLoadingComment(false);
    }, 500);
  };

  useEffect(() => {
    if(isConnected){
      getInitialComments(bookId);
    SignalRApi.onCommentAdded(handleNewComment);
    SignalRApi.subscribeToComments(bookId);
    return () => {
      SignalRApi.unsubscribeFromComments(bookId);
    };
    }
  }, [isConnected]);

  const addComment = async (comment: CreateCommentDto) => {
    try {
      await SignalRApi.newCommentAdded(comment);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    comments,
    loadingComment,
    addComment,
  };
};
