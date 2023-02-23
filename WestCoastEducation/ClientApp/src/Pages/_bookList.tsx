import { Box, Text, Grid, Group, TextInput, ActionIcon } from '@mantine/core';
import { useDebouncedValue, useViewportSize } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { BookBriefModel } from '../Models/book';
import { useEffect, useState } from 'react';
import { IconEdit, IconSearch } from '@tabler/icons-react';
import { Link } from 'react-router-guard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Props } from '../config';
import useAxios from '../Hooks/useAxios';

dayjs.extend(relativeTime);

export type LoaderVariant = 'oval' | 'bars' | 'dots';
const PAGE_SIZE = 10;

export const bookList = (props : Props) => {
  const { children, location, guardData } : Props = props;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Array<BookBriefModel>>([]);
  const [pageRecords, setPageRecords] = useState<Array<BookBriefModel>>([].slice(0, PAGE_SIZE));
  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 1000);
  let api = useAxios();
  const { height, width } = useViewportSize();

  const load = async () => {
    setFetching(true);
    const response = await api.get<BookBriefModel[]>(`/book`, {
      params: { filter: query },
    });
      setRecords(response.data);
      setPage(1);
      setFetching(false);
  };

  useEffect(() => {
    load()
  }, [debouncedQuery]);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
     const to = from + PAGE_SIZE;
     setPageRecords(records.slice(from, to));
     }, [page, records]);

  return (
    <>
    <Grid align="center" mb="md">
      <Grid.Col xs={8} sm={9}>
        <TextInput
          sx={{ flexBasis: '60%' }}
          placeholder="Search books..."
          icon={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      </Grid.Col>
    </Grid>
    <Box>
      <DataTable
        withBorder
        records={pageRecords}
        fetching={fetching}
        columns={[{accessor: 'title'}, {accessor: 'authorsName', title: 'Authors', render: ({authorsName} ) => authorsName != undefined && authorsName.length > 20  ? `${authorsName?.substring(0, 20)}...`: authorsName },
        { accessor: 'publicationDate', render: ({ publicationDate }) => dayjs(publicationDate).format('YYYY') }, 
          {
          accessor: 'actions',
          title: <Text mr="xs">Row actions</Text>,
          textAlignment: 'right',
          render: (book) => (
            <Group spacing={4} position="right" noWrap>
                <ActionIcon  color="blue" component={Link} to={`${location.pathname}/${book.bookId}`}>
                  <IconEdit size={16} />
                </ActionIcon>
            </Group>
          ),
        },]}
        totalRecords={records?.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        minHeight={height * 0.6}
      />
    </Box>
  </>
  )
}


