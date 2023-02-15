import { Box, Text, Grid, Group, TextInput, ActionIcon } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { getBooks } from '../API/books.api';
import { BookBriefModel } from '../Models/book';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { Link } from 'react-router-guard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Props } from '../config';

dayjs.extend(relativeTime);

export default function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

export type LoaderVariant = 'oval' | 'bars' | 'dots';
const PAGE_SIZE = 10;

export function booksList(props : Props) {
  const { children, location, guardData } : Props = props;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Array<BookBriefModel>>([]);
  const [filteredRecords, setFilteredRecords] = useState<Array<BookBriefModel>>([].slice(0, PAGE_SIZE));
  const [pageRecords, setPageRecords] = useState<Array<BookBriefModel>>([].slice(0, PAGE_SIZE));
  const [fetching, setFetching] = useState(false);
  const isMounted = useIsMounted();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 1000);

  const load = async () => {
    setFetching(true);
    const companies = await getBooks({ filter: query });
    if (isMounted()) {
      setRecords(companies);
      setFetching(false);
    }
  };

  useEffect(() => {
    load()
  }, [debouncedQuery]);

  useEffect(() => {
    setPage(1)
      setFilteredRecords(
        records.filter((props  : any) => {
          const stringProps : Array<string> = Object.values(props).filter((item : any) => typeof item === 'string') as Array<string>;
          if(debouncedQuery == '' || stringProps.some((v : string) => v.toLowerCase().includes(debouncedQuery))){
            return true;
          }
          return false;
        })
      );
  }, [records]);


 useEffect(() => {
  const from = (page - 1) * PAGE_SIZE;
   const to = from + PAGE_SIZE;
   setPageRecords(filteredRecords.slice(from, to));
   }, [page, filteredRecords]);
  

  return (
    <>
    <Grid align="center" mb="md">
      <Grid.Col xs={8} sm={9}>
        <TextInput
          sx={{ flexBasis: '60%' }}
          placeholder="Search employees..."
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
                <ActionIcon  color="blue" component={Link} to={`${location.pathname}/${book.id}`}>
                  <IconEdit size={16} />
                </ActionIcon>
            </Group>
          ),
        },]}
        totalRecords={filteredRecords.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
    </Box>
  </>
  )
  // example-end
}