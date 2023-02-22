import { Button, Card, Group, Skeleton, Text, Textarea, Title, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { BookModel } from '../Models/book';
import * as signalR from '@microsoft/signalr';
import { hasLength, useForm } from '@mantine/form';
import { CommentHtml } from '../Components/_comment';
import useAxios from '../Hooks/useAxios';
import { User } from '../Models/user';
import AuthContext from '../Providers/auth.provider';

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

export const bookDetail = (props: any)  => {
    const [book, setbook] = useState<BookModel>();
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [comments, setComments] = useState<Array<CommentDto>>([]);
    const { user }: Partial<{ user: User }> = useContext(AuthContext);

    let api = useAxios();

    const form = useForm({
        initialValues: {
            body: '',
            bookId: props.match.params.id
        },

        validate: {
            body: hasLength({ min: 3 }, 'comment must be atleast 3 charathers'),
        },
    });

    async function addComment(comment: CreateCommentDto) {
        try {
            await connection?.invoke('NewCommentAdded', comment);
            form.reset()
        } catch (err) {
            console.error(err);
        }
    }


    async function getInitialComments() {
        try {
            const initialComments = await connection?.invoke('GetCommentsForBook', props.match.params.id);
            setComments(initialComments);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/Commenthub', {
                accessTokenFactory: () => sessionStorage.access_token
            })
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                console.log('Connected!');
                getInitialComments()
                connection.invoke('SubscribeToComments', props.match.params.id);
            });

            connection.on('CommentAdded', (comment: CommentDto) => {

                setLoading(true)

                setComments((prevComments) => [...prevComments, comment]);
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            });

            return () => {
                connection.invoke('UnsubscribeFromComments', props.match.params.id);
                connection.stop();
            };
        }
    }, [connection,]);


    const theme = useMantineTheme();

    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    const load = async () => {
        const response = await api.get<BookModel>(`/book/${props.match.params.id}`);
        setbook(response.data)
    };

    useEffect(() => {
        load()
    }, []);

    const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    return (


        <Card p="xl">

            <Card.Section p="xl">

                <Title weight={500}>Details</Title>
                <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                    <Title weight={400}>{book?.title}</Title>
                </Group>
                <Text weight={300}>Pages: {book?.numPages}</Text>
                <Text weight={300}>Authors: {book?.authors.flatMap(a => a.authorName).join(", ")}</Text>
                <Text weight={300}>Language: {book?.languageName}</Text>
                <Text weight={300}>Publication: {dayjs(book?.publicationDate).format('YYYY-MM-DD')}</Text>
                <Text weight={300}>Publisher: {book?.publisher?.publisherName}</Text>
                <Text weight={300}>Price: ${book?.bookPrice}</Text>

            </Card.Section>

            <Card.Section p="xl">

                <form onSubmit={form.onSubmit(addComment)}>
                    <Textarea label="Your comment" placeholder={user ? "Your comment" : "You must be logged in to comment"} {...form.getInputProps('body')} />
                    <Button disabled={!user} type="submit" mt="sm">
                        Submit
                    </Button>
                </form>

            </Card.Section>

            <Card.Section p="xl">

                <div hidden={!loading}>
                    <Skeleton height={50} circle mb="xl" visible={loading} />
                    <Skeleton height={8} radius="xl" visible={loading} />
                    <Skeleton height={8} mt={6} radius="xl" visible={loading} />
                    <Skeleton height={8} mt={6} width="70%" radius="xl" visible={loading} />
                </div>

                {comments.sort((a, b) => b.id - a.id).map((comment) => (
                    <CommentHtml
                        key={comment.id}
                        postedAt={new Date().toDateString()}
                        body={comment.body}
                        author={comment.author}
                    />))}
            </Card.Section>
        </Card>

    );
}