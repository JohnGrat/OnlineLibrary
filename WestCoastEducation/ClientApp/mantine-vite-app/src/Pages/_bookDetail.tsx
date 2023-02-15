import { Button, Card, Container, Grid, Group, SimpleGrid, Skeleton, Text, Title, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getOneBook } from '../API/books.api';
import { Props } from '../config';
import { BookModel } from '../Models/book';

const PRIMARY_COL_HEIGHT = 300;

export function bookDetail(props : any) {
    const [book, setbook] = useState<BookModel>();
    const theme = useMantineTheme();

    const secondaryColor = theme.colorScheme === 'dark'
    ? theme.colors.dark[1]
    : theme.colors.gray[7];

    const load = async () => {

        const book = await getOneBook(props.match.params.id);
        setbook(book)
      };

  useEffect(() => {
    load()
  }, []);

  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

  return (
        <Card shadow="sm" >
            <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
            <Title weight={500}>{book?.title}</Title>
            </Group>
            <Text weight={400}>Pages: {book?.numPages}</Text>
            <Text weight={400}>Authors: {book?.authors.flatMap(a => a.authorName).join(", ")}</Text>
            <Text weight={400}>Language: {book?.languageName}</Text>
            <Text weight={400}>Publication: {dayjs(book?.publicationDate).format('YYYY-MM-DD')}</Text>
            <Text weight={400}>Publisher: {book?.publisher?.publisherName}</Text>
            <Text weight={400}>Price: ${book?.bookPrice}</Text>
        </Card>
  );
}