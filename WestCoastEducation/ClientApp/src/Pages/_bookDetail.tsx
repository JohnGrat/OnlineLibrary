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
import * as signalR from "@microsoft/signalr";
import { hasLength, useForm } from "@mantine/form";
import { CommentHtml } from "../Components/_comment";
import useAxios from "../Hooks/useAxios";
import { User } from "../Models/user";
import AuthContext from "../Providers/auth.provider";
import { baseUrl } from "../App";

interface CommentDto {
  id: number;
  bookId: string;
  postedAt: Date;
  body: string;
  author: {
    name: string;
    image: string;
  };
}

interface CreateCommentDto {
  bookId: string;
  body: string;
}

const PRIMARY_COL_HEIGHT = 300;

export const bookDetail = (props: any) => {
  const [book, setbook] = useState<BookModel>();
  const { comments, loadingComment, addComment } =
  useSignalRConnection(props.match.params.id);
  const [visible, setVisible] = useState(true);
  const { user }: Partial<{ user: User }> = useContext(AuthContext);
  const theme = useMantineTheme();

  let api = useAxios();

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
    const response = await api.get<BookModel>(`/book/${props.match.params.id}`);
    setbook(response.data);
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
        <form onSubmit={form.onSubmit(addComment)}>
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


export const useSignalRConnection = (bookId: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/hubs/commenthub`)
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR connection established");
          getInitialComments(bookId);
          connection.invoke("SubscribeToComments", bookId);
        })
        .catch((error) => {
          console.error(error);
        });

      connection.on("CommentAdded", (comment: CommentDto) => {
        setLoadingComment(true)

        setTimeout(() => {
          setComments((prevComments) => [...prevComments, comment]);
          setLoadingComment(false)
        }, 500);    
      });

      return () => {
        connection.invoke("UnsubscribeFromComments", bookId);
        connection.stop();
        console.log("SignalR connection stopped");
      };
    }
  }, [connection]);

  const getInitialComments = async (bookId: string) => {
    try {
      const initialComments = await connection?.invoke(
        "GetCommentsForBook",
        bookId
      );
      setComments(initialComments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (comment: CreateCommentDto) => {
    try {
      await connection?.invoke("NewCommentAdded", comment);
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