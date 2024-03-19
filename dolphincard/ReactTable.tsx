import {
  Column,
  useExpanded,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from "react-table";
import {alpha, useTheme} from "@mui/material/styles";
import {
  Button,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery
} from "@mui/material";
import {Fragment, ReactNode, useEffect, useMemo, useState} from "react";
import {renderFilterTypes} from "../../../../utils/react-table";
import { HeaderSort, TableRowSelection } from '../../../../components/third-party/ReactTable';
import {PlusOutlined} from "@ant-design/icons";
import {TablePagination} from "../../../../components/third-party/react-table/tablePagination/TablePagination";
import TypeWrapper from "../../../../components/third-party/typeWrapper/TypeWrapper";
import StatusWrapper from "../../../../components/third-party/statusWrapper/StatusWrapper";
import SearchEmailWrapper from "../../../../components/third-party/searchEmailWrapper/SearchEmailWrapper";
import {useSelector} from "react-redux";
import {dispatch, RootState} from "../../../../store";
import {AxiosResponse} from "axios/index";
import {setUsersData} from "../../../../store/reducers/users";
import {TypeApi} from "../../../../api/TypeApi";
import {UsersApi} from "../../../../api/UsersApi";

interface Props {
  columns: Column[] | any;
  data: any[];
  getHeaderProps: (column: any) => void;
  handleAdd: () => void;
  renderRowSubComponent: any;
  getAffiliateTableValues?: (query:string) => void;
  handlePageChange: (page: number) => void;
  handleChangePerPage: (
    evt: SelectChangeEvent<number>,
    child: ReactNode
  ) => void;
  title: string;
  handleSelectedStatusChange?: (status:string) => void;
  selectedStatuses?: string[];
  handleDeleteSelectedStatus?: (status:string) => void;
}

function ReactTableCards({
                           columns,
                           handleChangePerPage,
                           data,
                           getHeaderProps,
                           renderRowSubComponent,
                           getAffiliateTableValues,
                           handleAdd,
                           handlePageChange,
                           title,
                           handleSelectedStatusChange,
                           selectedStatuses,
                           handleDeleteSelectedStatus,
                         }: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'fatherName', desc: false };
  const [selectedValue, setSelectedValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<number | any>(null);
  // const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const itemCount = useSelector((state: RootState) => state.pagination.itemCount);
  // const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
  const lastPage = useSelector((state: RootState) => state.pagination.lastPage);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    visibleColumns,
    // @ts-ignore
    page,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    // @ts-ignore
    preGlobalFilteredRows,
    // @ts-ignore
    setGlobalFilter,
    // @ts-ignore
    setSortBy
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      filterTypes,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['avatar', 'email'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['age', 'contact', 'visits', 'email', 'status', 'avatar']);
    } else {
      setHiddenColumns(['avatar', 'email']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  // useEffect(() => {
  //   console.log('selectedStatuses11', selectedStatuses)
  //   handleSelectedStatusSort(selectedStatuses);
  // }, [selectedStatuses]);
  //
  // const handleSelectedStatusSort = async (query: string | any) => {
  //   console.log('query', query)
  //   return StatusApi.getSortData(query)
  //     .then((res: AxiosResponse) => {
  //       const {data} = res.data;
  //       dispatch(setUsersData(data));
  //     } )
  //     .catch( (err) => {
  //       console.log('err', err)
  //     } )
  //     .finally( () => {
  //     } );
  // };

  const handleSelectedTypeSort = async (query: string[]) => {
    return TypeApi.getTypeSortData(query)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        dispatch(setUsersData(data));
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const getUsersEmail = async (query?: string) => {
    return UsersApi.getUsersEmailAll(query)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        dispatch(setUsersData(data));
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  // const handleSelectedStatusChange =  (status: string) => {
  //   console.log('status', status)
  //   if (!selectedStatuses.includes(status)) {
  //     setSelectedStatuses([...selectedStatuses, status]);
  //   }
  // };

  // const handleDeleteSelectedStatus =  (status: string) => {
  //   console.log('status555444', status)
  //   // if (selectedStatuses.includes(status)) {
  //   //   setSelectedStatuses(selectedStatuses.filter((item) => item !== status));
  //   // }
  // };

  const handleSelectedTypesChange = async (selectedType: string) => {
    await handleSelectedTypeSort([selectedType]);
  };

  const getUsersByEmail = async (newValue: string) => {
    await getUsersEmail(`?q=${newValue}`);
  };

  const handleSearchEmailValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    clearTimeout(timeoutId);

    // Set a timeout to send the request after 0.5 seconds of inactivity
    const newTimeoutId = setTimeout(() => {
      if (newValue.trim() !== '') {
        getUsersByEmail(newValue);

      } else {
        if (getAffiliateTableValues) {
          getAffiliateTableValues(`?page=${lastPage}&perPage=${itemCount}`);
        }
      }
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="end"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            {title === 'users' ? (
              <>
                <TypeWrapper
                  dataType={data}
                  onSelectedTypesChange={handleSelectedTypesChange}
                />
                <StatusWrapper
                  onSelectedStatusChange={handleSelectedStatusChange}
                  selectedStatuses={selectedStatuses}
                  handleDeleteSelectedStatus={handleDeleteSelectedStatus}
                />
                <SearchEmailWrapper
                  selectedValue={selectedValue}
                  handleSearchEmailValue={handleSearchEmailValue}
                />
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                  Приглашение
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                Создать карту
              </Button>
            )}
          </Stack>

        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column: any) => (
                  <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: any, i: number) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell: any) => (
                      <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination
                  gotoPage={handlePageChange}
                  handleChangePerPage={ handleChangePerPage }
                  setPageSize={setPageSize}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

export default ReactTableCards;











