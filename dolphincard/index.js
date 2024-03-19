import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
// import NumberFormat from 'react-number-format';
import {
  useFilters,
  useExpanded,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
  usePagination,
  Column,
  Cell
} from 'react-table';

// project import
import CustomerView from 'sections/apps/customer/CustomerView';
import AddCustomer from 'sections/apps/customer/AddCustomer';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
// import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
import {
  HeaderSort,
  IndeterminateCheckbox,
  TablePagination,
  TableRowSelection
} from 'components/third-party/ReactTable';
import {
  PlusOutlined,
  EditTwoTone,
  DeleteTwoTone,
  CheckOutlined,
} from '@ant-design/icons';
import {ReactComponent as ShareIcon} from '../../../assets/shareIcon.svg';
import StatusWrapper from "../../../components/third-party/statusWrapper/StatusWrapper";
import {useSelector} from "react-redux";
import {dispatch, RootState} from "../../../store";
import {StatusApi} from "../../../api/statusApi";
import {AxiosResponse} from "axios";
import TypeWrapper from "../../../components/third-party/typeWrapper/TypeWrapper";
import {TypeApi} from "../../../api/TypeApi";
import {UserProfileData} from "../../../types/user-profile";
import {UsersApi} from "../../../api/UsersApi";
import SearchEmailWrapper from "../../../components/third-party/searchEmailWrapper/SearchEmailWrapper";
import {affiliateApi} from "../../../api/affiliateApi";
import {setAddUsersData, setUsersData} from "../../../store/reducers/users";
import {getSelectedType} from "../../../utils/helpers";
import AddComment from "../../../sections/apps/comment/AddComment";
import {openSnackbar} from "../../../store/reducers/snackbar";
import ConfirmAlertDialog from "../../../sections/apps/alertDialog/ConfirmAlertDialog";

const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[] | any;
  data: [];
  getHeaderProps: (column: any) => void;
  handleAdd: () => void;
  renderRowSubComponent: any;
  getAffiliateTableValues:() => void;
}

function ReactTable({ columns, data, getHeaderProps, renderRowSubComponent, handleAdd , getAffiliateTableValues}: Props) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedValue, setSelectedValue] = useState('');
  const [timeoutId, setTimeoutId] = useState<number | any>(null);

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'fatherName', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    visibleColumns,
    rows,
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

  const handleSelectedStatusSort = async (query: string[]) => {
    return StatusApi.getSortData(query)
      .then((res: AxiosResponse) => {
        console.log('res1', res)
        const {data} = res.data;
        dispatch(setUsersData(data))
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const handleSelectedTypeSort = async (query: string[]) => {
    return TypeApi.getTypeSortData(query)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        console.log('AAAAAAAAAAAAAAA', data)
        dispatch(setUsersData(data))
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
        console.log('res&&&&&&&&', res)
        const {data} = res.data;
        dispatch(setUsersData(data))
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const handleSelectedStatusChange = async (selectedStatus: string) => {
    console.log('Selected Status in Parent:', selectedStatus);
    await handleSelectedStatusSort([selectedStatus])
  };

  const handleSelectedTypesChange = async (selectedType: string) => {
    console.log('Selected types in Parent:', selectedType);
    await handleSelectedTypeSort([selectedType])
  };

  const getUsersByEmail = async (newValue: string) => {
    console.log('Selected types in Parent:', newValue);
    await getUsersEmail(`?q=${newValue}`);
  };

  const handleSearchEmailValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    clearTimeout(timeoutId);

    // Set a timeout to send the request after 0.5 seconds of inactivity
    const newTimeoutId = setTimeout(() => {
      if (newValue.trim() !== '') {
        getUsersByEmail(newValue)
        console.log('Sendiafter 0.5 5555 .');
      } else {
        getAffiliateTableValues()
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
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <TypeWrapper
              dataType={data}
              onSelectedTypesChange={handleSelectedTypesChange}
            />
            <StatusWrapper
              statusesAndType={data}
              onSelectedStatusChange={handleSelectedStatusChange}
            />
            <SearchEmailWrapper
              selectedValue={selectedValue}
              handleSearchEmailValue={handleSearchEmailValue}
            />
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add Customer
            </Button>
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
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

// ==============================|| CUSTOMER - LIST VIEW ||============================== //

const CustomerList = () => {
  const theme = useTheme();

  // const data = useMemo(() => makeData(200), []);

  const [customer, setCustomer] = useState(null);
  const [inviteUserAdded, setInviteUserAdded] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [userComment, setUserComment] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const usersData = useSelector((state: RootState) => state.users.usersData);
  console.log('usersData555555555555555', usersData)

  const handleAdd = () => {
    setAdd(!add);
    if (customer && !add) setCustomer(null);
  };

  const handleAddComment = () => {
    setOpenComment(!openComment);
  };

  const handleAddConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleAddData = async (data: UserProfileData) => {
    console.log('A111data7778899', data)
    await handleNewAddedData(data)
  };

  const handleAddCommentData = async (data: UserProfileData) => {
    await handleNewAddedComment(data)
  };

  const handleAddConfirmData = async (userId: string) => {
    setShowConfirmation(!showConfirmation)
    await confirmActivation(userId)
  };

  const confirmActivation = async (userId: string) => {
    return UsersApi.confirmUserActivation(userId)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        dispatch(setUsersData(data))
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const handleNewAddedComment = async (data: UserProfileData) => {
    return UsersApi.updateUserComment(data)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        console.log('data---555', data)
        getAffiliateTableValues()
        // dispatch(setUsersData(data))
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const handleRejectedActivation = async (userId: string) => {
    return UsersApi.rejectedActivation(userId)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        console.log('111111111111111111111111', data)
        // dispatch(setUsersData(data))
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  const handleConfirmActivation = (userId: string) => {
    setShowConfirmation(!showConfirmation);
    setCurrentUserId(userId);
  };

  const handleNewAddedData = async (data: UserProfileData) => {
    return UsersApi.setInviteUser(data)
      .then((res: AxiosResponse) => {
        const {data} = res.data;
        dispatch(setAddUsersData(data))
        setInviteUserAdded(true);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Отправлено.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      } )
      .catch( (err) => {
        console.log('err', err)
      } )
      .finally( () => {
      } );
  };

  useEffect(() => {
    (async () => {
      await getAffiliateTableValues();
    })();
  }, []);

  const getAffiliateTableValues = () => {
    affiliateApi
      .getAffiliateOverviewTableValues()
      .then((res) => {
        console.log('data#######1', res.data)
        const tableData = res.data.data;
        dispatch(setUsersData(tableData))
      })
      .catch((err) => {
        console.log(err); // fixme m
      });
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash)
      .then(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Link copied successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
      .catch(err => {
        console.error('Error copying to clipboard: ', err);
      });
  };

  const columns = useMemo(
    () => [
      {
        title: 'Row Selection',
        Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
          <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
        ),
        accessor: 'selection',
        Cell: ({ row }: any) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
        disableSortBy: true
      },
      {
        Header: 'id',
        accessor: 'id',
        className: 'cell-center'
      },
      {
        Header: 'Дата регистрации',
        accessor: 'fatherName',
        Cell: ({ row }: any) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar alt="Avatar 1" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`)} />
              <Stack spacing={0}>
                <Typography variant="subtitle1">{row.original?.invitation?.updated_at}</Typography>
                {/*<Typography variant="caption" color="textSecondary">*/}
                {/*  {values.email}*/}
                {/*</Typography>*/}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Email',
        accessor: 'contact',
        Cell: ({ row }: Cell<any>) => <div>{row.original.email}</div>
      },
      {
        Header: 'Тип',
        accessor: 'age',
        Cell: ({ row }: Cell<any>) => <div>
          {getSelectedType(row.original.type)}
        </div>
      },
      {
        Header: 'Комментарий',
        accessor: 'visits',
        Cell: ({ row }: Cell<any>) => <div>{row.original.comment}</div>
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Cell: ({ row }: Cell<any>) => {
          return (
            <Chip
              color="error"
              label={row.original.status}
              size="small"
              variant="light"
              style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderColor: '#69c0ff', borderRadius: '5px' }}
            />
          )
        }
      },
      {
        Header: 'Действия',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: any) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0}>
              {row.original.status === 'active' && (
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setUserComment(row.original.comment);
                      setCurrentUserId(row.original.id)
                      setOpenComment(!openComment)
                    }}
                  >
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
              )}
              {row.original.status === 'pending' && (
                <>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleRejectedActivation(row.original.id)
                      }}
                    >
                      <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Check">
                    <IconButton
                      color="primary"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleConfirmActivation(row.original.id)
                      }}
                    >
                      <CheckOutlined twoToneColor={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary" onClick={(e: any) => {
                      e.stopPropagation();
                      setOpenComment(!openComment);
                      setUserComment(row.original.comment);
                      setCurrentUserId(row.original.id)
                    }}
                    >
                      <EditTwoTone twoToneColor={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {row.original.status === 'rejected' && (
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setOpenComment(!openComment);
                      setUserComment(row.original.comment);
                      setCurrentUserId(row.original.id)
                    }}
                  >
                    <EditTwoTone twoToneColor={theme.palette.primary.main} />
                  </IconButton>
                </Tooltip>
              )}

              {row.original.status === 'invite_sent' && (
                <>
                  <Tooltip title="Share">
                    <IconButton
                      color="primary"
                      onClick={(e: any) => {
                        console.log('row.original', row.original);
                        const baseUrl = process.env.REACT_APP_DOLPHIN_CARD_REGISTER_URL;
                        const hash = row.original.invitation.hash
                        copyToClipboard(baseUrl + `/auth/register?hash=${ hash }` );
                        e.stopPropagation();
                      }}
                    >

                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        setOpenComment(!openComment);
                        setUserComment(row.original.comment);
                        setCurrentUserId(row.original.id)
                      }}
                    >
                      <EditTwoTone twoToneColor={theme.palette.primary.main} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          );
        }
      }
    ],
    [theme]
  );

  // const renderRowSubComponent = useCallback(({ row }: any) => <CustomerView data={data[row.id]} />, [data]);

  const renderRowSubComponent = useCallback(({ row }: any) => (
    <CustomerView data={usersData[row.id]} />
  ), [usersData]);

  console.log('openComment9-9-9', openComment)
  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={usersData}
          handleAdd={handleAdd}
          getHeaderProps={(column: any) => column.getSortByToggleProps()}
          renderRowSubComponent={renderRowSubComponent}
          getAffiliateTableValues={getAffiliateTableValues}
        />
      </ScrollX>

      {/* add customer dialog */}
      <Dialog onClose={handleAdd} open={add} >
        {add && <AddCustomer
          customer={customer}
          onCancel={handleAdd}
          handleAddData={handleAddData}
          inviteUserAdded={inviteUserAdded}
        />}
      </Dialog>
      <Dialog onClose={handleAddComment} open={openComment} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {openComment && <AddComment
          customer={customer}
          onCancel={handleAddComment}
          handleAddData={handleAddCommentData}
          userComment={userComment}
          currentUserId={currentUserId}
        />}
      </Dialog>
      <Dialog onClose={handleAddConfirmation} open={showConfirmation} >
        {showConfirmation && <ConfirmAlertDialog
          onCancel={handleAddConfirmation}
          handleAddData={handleAddConfirmData}
          currentUserId={currentUserId}
        />}
      </Dialog>
    </MainCard>
  );
};

export default CustomerList;
