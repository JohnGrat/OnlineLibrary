import { Box, Text, DefaultMantineColor, Grid, Group, MantineSize, TextInput, ActionIcon } from '@mantine/core';
import { useDebouncedValue, useInterval } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { getBooks, LoaderOptions } from '../API/books.api';
import BookBriefModel, { IBookBriefModel } from '../Models/book';
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';


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
const PAGE_SIZE = 15;

interface Callback {
  loader: (options: LoaderOptions) => Promise<{}[]>;
}
interface Props {
  promise: () => void | Array<Promise<Function>>;
  children: React.ReactNode;
  history: History;
  guardData?: object;
}


//export function AsynchronousDataLoadingExampleWithCustomLoader<T>({props , callback } : any) {
export function AsynchronousDataLoadingExampleWithCustomLoader(callback : any) {
  //const { children, history, location, guardData } : any = props;
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<Array<{}>>([]);
  const [filteredRecords, setFilteredRecords] = useState<Array<{}>>([].slice(0, PAGE_SIZE));
  const [pageRecords, setPageRecords] = useState<Array<{}>>([].slice(0, PAGE_SIZE));
  const [fetching, setFetching] = useState(false);
  const isMounted = useIsMounted();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 1000);

  const load = async () => {
    setFetching(true);
    const companies = await callback.loader({ filter: query });
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
    <Box sx={{ height: 300 }}>
      <DataTable
        withBorder
        records={pageRecords}
        fetching={fetching}
        columns={[{accessor: 'title' },  {
          accessor: 'actions',
          title: <Text mr="xs">Row actions</Text>,
          textAlignment: 'right',
          render: (company) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon
                color="blue"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                 // history.pushState('/23')
                }}
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                color="red"
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  //deleteCompany(company);
                }}
              >
                <IconTrash size={16} />
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