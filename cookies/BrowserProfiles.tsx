import React, { useState, useMemo, useEffect, memo, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserHistory } from 'history';
import { FormattedMessage } from 'react-intl';
import { Cell, Column } from 'react-table';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import Promise from 'bluebird';
import { saveAs } from 'file-saver';
import { useTheme } from '@mui/material/styles';
import { MenuOutlined } from '@ant-design/icons';
import { Grid, SelectChangeEvent, Stack } from '@mui/material';
import { RootState } from '../../../store';
import { resetRowIds, resetTags, setSelectedProfiles } from '../../../store/reducers/brovisorTable';
import {
    setRunProfileId,
    setFailedProfileId,
    setStopProfileId,
    setLoadingProfiles,
    setIsBrowserDownload
} from '../../../store/reducers/nameCell';
import { setFirstProxies } from '../../../store/reducers/proxyCell';
import { setCheckedIds } from '../../../store/reducers/exportCookies';
import { setSelectedFolder } from '../../../store/reducers/brovisorFolder';
import { resetSearchValue, setSearchValue } from '../../../store/reducers/searchValue';
import { setCurrentPage, setItemCount, setLastPage } from '../../../store/reducers/pagination';
import { setUsersInfo } from '../../../store/reducers/userInfo';
import { setBrowserProfiles } from '../../../store/reducers/profiles';
import { hideToast, showToast } from '../../../store/reducers/toastLoader';
import { echo, socket } from '../../../App';
import BrovisorTable from '../../../components/brovisorTable/BrovisorTable';
import AlertDialog from '../../../components/modals/bulkDeleteAlertDialog/BulkDeleteAlertDialog';
import DeleteAlertDialog from '../../../components/modals/deleteAlertDialog/DeleteAlertDialog';
import SettingsDropdown from '../../../components/common/settingsDropdown/SettingsDropdown';
import BulkProxyModal from '../../../components/common/bulkProxyModal/BulkProxyModal';
import TagsCellWrapper from '../../../components/pages/browserProfiles/tagsCellWrapper/TagsCellWrapper';
import NamesCellWrapper from '../../../components/pages/browserProfiles/namesCellWraper/NamesCellWrapper';
import ProxyCellWrapper from '../../../components/pages/browserProfiles/proxyCellWrapper/ProxyCellWrapper';
import NotesCellWrapper from '../../../components/pages/browserProfiles/notesCellWrapper/NotesCellWrapper';
import StatusCellWrapper from '../../../components/pages/browserProfiles/statusCellWrapper/StatusCellWrapper';
import BrovisorPageHeader from '../../../components/brovisorPageHeader/BrovisorPageHeader';
import BulkFolderModal from '../../../components/common/bulkFolderModal/BulkFolderModal';
import BulkTagModal from '../../../components/common/bulkTagModal/BulkTagModal';
import BrovisorFolder from '../../../components/brovisorFolder/BrovisorFolder';
import toastLoaderConfig from '../../../toastLoaderConfig';
import { BrovisorFolderTypes } from '../../../types/brovisorFolder';
import { getUpdatedColumn } from '../../../utils/getColumns';
import { buildUrl, getAgentPort } from '../../../utils/helpers';
import { logoutWithUnexpectedToken } from '../../../utils/auth';
import { CreateProxyDataTypes, ProxyDataTypes } from '../../../types/proxy';
import {
    BrowserProfileDataTypes,
    BrowserProfileTransformedDataTypes,
    SizeWidthTypes,
    SocketTagsTypes,
    TagsTypes
} from '../../../types/browserProfiles';
import ProxyApi from '../../../api/ProxyApi';
import AgentApi from '../../../api/agentApi';
import BrowserProfilesApi from '../../../api/BrowserProfilesApi';
import loader from '../../../assets/icons/brovisorTableIcons/loader.svg';
import fontCase from '../../../assets/icons/brovisorTableIcons/fontCase.svg';
import notesText from '../../../assets/icons/brovisorTableIcons/notesText.svg';
import tagsIcon from '../../../assets/icons/brovisorTableIcons/tagsIcon.svg';
import proxyIcon from '../../../assets/icons/brovisorTableIcons/proxyIcon.svg';
import AddFolder from '../../../assets/icons/bulkOperation/addFolder.svg';
import PauseButton from '../../../assets/icons/bulkOperation/pauseButton.svg';
import { ReactComponent as RunButton } from '../../../assets/icons/bulkOperation/runButton.svg';
import AddTags from '../../../assets/icons/bulkOperation/addTags.svg';
import EditPen from '../../../assets/icons/helperIcons/editPen.svg';
import ChangeProxy from '../../../assets/icons/bulkOperation/changeProxy.svg';
import ExportCookie from '../../../assets/icons/bulkOperation/exportCookie.svg';
import browserProfilesIcon from '../../../assets/icons/drawerIcons/browserProfile.svg';
import Delete from '../../../assets/icons/bulkOperation/delete.svg';
import crossError from '../../../assets/icons/helperIcons/crossError.svg';
import searchIcon from '../../../assets/icons/common/search.svg';
import loaderIcon from '../../../assets/icons/helperIcons/loaderIcon.svg';
import styles from './browserProfiles.module.css';

export const browserProfilesInitialValues = {
    id: '',
    name: '',
    status: null,
    tags: [],
    folders: [],
    platform: '',
    mainWebsite: { name: 'none'},
    login: '',
    password: '',
    proxy: null,
    userAgent: null,
    cookies: '',
    webrtc: { mode: 'altered' },
    canvas: { mode: 'real' },
    webgl: { mode: 'real' },
    webglInfo: { mode: 'manual' },
    clientRect: { mode: 'real' },
    timezone: { mode: 'auto', value: null },
    locale: { mode: 'auto', value: null },
    geoLocation: { mode: 'auto', accuracy: null, latitude: null, longitude: null },
    cpu: { mode: 'manual', value: null },
    memory: { mode: 'manual', value: null },
    screen: { mode: 'auto', resolution: null },
    mediaDevice: { mode: 'manual', audioInputs: 1, audioOutputs: 1, videoInputs: 1 },
    port: { mode: 'real', blacklist: null },
    note: '',
    isProxyUpdate: false,
    isNoteUpdate: false,
    isCookieUpdate: false
};

export interface socketRunBrowser {
    profileId: string;
}

function BrowserProfiles() {
    const [searchParams] = useSearchParams();
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = createBrowserHistory();
    const navigate = useNavigate();

    const browserProfiles = useSelector((state: RootState) => state.profiles.browserProfiles);
    const itemCount = useSelector((state: RootState) => state.pagination.itemCount);
    const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
    const lastPage = useSelector((state: RootState) => state.pagination.lastPage);
    const searchValue = useSelector((state: RootState) => state.searchValue.searchValue);
    const idsOfSelectedRows = useSelector((state: RootState) => state.brovisorTableSlice.idsOfSelectedRows);
    const usersInfo = useSelector((state: RootState) => state.userInfo.usersInfo);
    const { isBrowserDownload } = useSelector((state: RootState) => state.nameCell);

    const bulkProxyRef = useRef<HTMLDivElement>(null);
    const bulkFolderRef = useRef<HTMLDivElement>(null);
    const bulkTagRef = useRef<HTMLDivElement>(null);

    const [filterLoading, setFilterLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [browserProfilesCount, setBrowserProfilesCount] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<BrowserProfileDataTypes[]>([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
    const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState<boolean>(false);
    const [openBulkProxyModal, setOpenBulkProxyModal] = useState<boolean>(false);
    const [openBulkFolderModal, setOpenBulkFolderModal] = useState<boolean>(false);
    const [openBulkTagModal, setOpenBulkTagModal] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] = useState<BrowserProfileDataTypes>(browserProfilesInitialValues);
    const [folderIds, setSelectedFolderIds] = useState<string[]>(
        searchParams.get('foldersIds[]') ? [`${searchParams.get('foldersIds[]')}`] : []
    );

    const  bulkOperationsSettings =  {
        settings : [
            {
                icon: <RunButton className={styles.runButton} /> ,
                func: ()=>  handleBulkClickButton( "start")
            },
            {
                icon: <img src={PauseButton} alt="Pause" className={styles.stopButton} /> ,
                func: ()=> handleBulkClickButton( "stop")
            },
            {
                name: 'bulk-operation-add-folder',
                icon: <img src={AddFolder} alt="Add folder" /> ,
                bulkRef: bulkFolderRef,
                func: ()=> {setOpenBulkFolderModal(!openBulkFolderModal); setOpenBulkProxyModal(false); setOpenBulkTagModal(false)}
            },
            {
                name: 'bulk-operation-change-proxy',
                icon: <img src={ChangeProxy}  alt="Change proxy" /> ,
                bulkRef: bulkProxyRef,
                func: () => { setOpenBulkProxyModal( !openBulkProxyModal ); setOpenBulkTagModal(false); setOpenBulkFolderModal(false)}
            },
            {
                name: 'bulk-operation-add-tags',
                icon: <img src={AddTags} alt="Add tags" /> ,
                bulkRef: bulkTagRef,
                func: ()=> handleBulkTags(),
            },
            {
                name: 'bulk-operation-export-cookies',
                icon: <img src={ExportCookie} alt="Export Cookie" /> ,
                func: ()=> handleBulkExportCookies(),
            },
            {
                name: 'bulk-operation-delete',
                icon: <img src={Delete}  alt="Delete"/> ,
                func: () => handleBulkDelete(Array.from(idsOfSelectedRows)),
            },
        ],
        selectedItemsCount: idsOfSelectedRows.size
    };

    const columns = useMemo(
        () => [
            {
                maxWidth: 30,
                accessor: 'burger',
                Header: '',
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    return (
                        <div
                            className={styles.settingsContainer}
                            onClick={evt => evt.stopPropagation()}
                        >
                            <SettingsDropdown
                                Icon={MenuOutlined}
                                settings={[
                                    {
                                        name: 'edit-browser-profile',
                                        icon: <img src = { EditPen } alt = "Edit Pen" />,
                                        func: () => {navigate(`/browser-profiles/${row.original.id}`)}
                                    },
                                    {
                                        name: 'delete-button',
                                        icon: <img src = {Delete} alt = "Delete" />,
                                        func: () => {deleteOneProfile(row.original)}
                                    },
                                ]}
                            />
                        </div>
                    )
                },
                disableSortBy: true,
                disableResizing: true,
            },
            {
                minWidth: 100,
                width: JSON.parse(localStorage.getItem('browser-profile-title-columns') ?? 'null')?.[2]?.width ?? 150,
                accessor: 'name',
                Header: (
                    <Grid container  direction="row" alignItems="center" className={styles.brovisorheaderItemContainer}>
                        <img src={fontCase} alt='font Case' className={styles.profileSvgs} />
                        <span className={styles.headerNameWrapper}>
              <FormattedMessage id='browser-profile-data-name' />
            </span>
                    </Grid>
                ),
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    const profile: BrowserProfileDataTypes = row.original;

                    return (
                        <NamesCellWrapper
                            browserProfile={profile}
                            handleSubmit={handleSubmit}
                        />
                    )
                },
                className: styles.cellCenter,
            },
            {
                minWidth: 90,
                width: JSON.parse(localStorage.getItem('browser-profile-title-columns') ?? 'null')?.[3]?.width ?? 150,
                accessor: 'status',
                Header: (
                    <Grid container  direction="row" alignItems="center" className={styles.brovisorheaderItemContainer}>
                        <img src={loader} alt='loader' className={styles.profileSvgs} />
                        <span className={styles.headerNameWrapper}>
              <FormattedMessage id='browser-profile-data-status' />
            </span>
                    </Grid>
                ),
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    const profile: BrowserProfileDataTypes = row.original;

                    return (
                        <StatusCellWrapper
                            browserProfile={profile}
                            handleSubmit={handleSubmit}
                        />
                    )
                },
                className: styles.cellCenter,
            },
            {
                minWidth: 90,
                width: JSON.parse(localStorage.getItem('browser-profile-title-columns') ?? 'null')?.[4]?.width ?? 150,
                accessor: 'notes',
                Header: (
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        className={styles.brovisorheaderItemContainer}
                    >
                        <img src={notesText} alt='Notes Text' className={styles.profileSvgs} />
                        <span className={styles.headerNameWrapper}>
              <FormattedMessage id='browser-profile-data-notes' />
            </span>
                    </Grid>
                ),
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    const profile: BrowserProfileDataTypes = row.original;

                    return (
                        <NotesCellWrapper
                            browserProfile={profile}
                            handleSubmit={handleSubmit}
                        />
                    )
                },
                className: styles.cellCenter,
            },
            {
                minWidth: 80,
                width: JSON.parse(localStorage.getItem('browser-profile-title-columns') ?? 'null')?.[5]?.width ?? 150,
                accessor: 'tags',
                Header: (
                    <Grid container  direction="row" alignItems="center" className={styles.brovisorheaderItemContainer}>
                        <img src={tagsIcon} alt='Tags Icon' className={styles.profileSvgs} />
                        <span className={styles.headerNameWrapper}>
              <FormattedMessage id='browser-profile-data-tags' />
            </span>
                    </Grid>
                ),
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    const profile: BrowserProfileDataTypes = row.original;

                    return (
                        <TagsCellWrapper
                            browserProfile={profile}
                            handleSubmit={handleSubmit}
                        />
                    )
                },
                className: styles.cellCenter,
            },
            {
                minWidth: 150,
                width: JSON.parse(localStorage.getItem('browser-profile-title-columns') ?? 'null')?.[6]?.width ?? 150,
                accessor: 'proxy',
                Header: (
                    <Grid container  direction="row" alignItems="center" className={styles.brovisorheaderItemContainer}>
                        <img src={proxyIcon} alt='Proxy Icon' className={styles.profileSvgs} />
                        <span className={styles.headerNameWrapper}>
              <FormattedMessage id='browser-profile-data-proxy' />
            </span>
                    </Grid>
                ),
                Cell: ({ row }: Cell<BrowserProfileDataTypes>) => {
                    const profile: BrowserProfileDataTypes = row.original

                    return (
                        <div
                            className={styles.proxyCellWrapper}
                            onClick={(evt) => evt.stopPropagation()}
                        >
                            <ProxyCellWrapper
                                browserProfile={profile}
                                handleSubmitProxyChanges={handleSubmitProxyChanges}
                                handleSubmitProfileChanges={handleSubmitProfileChanges}
                            />
                        </div>
                    );
                },
                className: `${styles.cellCenter} teamsInvitedColumn`,
            },
        ], [theme, browserProfiles]
    ) as unknown as Column<BrowserProfileDataTypes>[];

    const [profileColumns, setProfileColumns] = useState<Column<BrowserProfileDataTypes>[]>(columns);

    useEffect(() => {
        return () => {
            dispatch(resetSearchValue());
        }
    }, []);

    useEffect(() => {
        return () => {
            dispatch(resetTags());
        }
    }, [openBulkTagModal]);

    const successBrowserProfileHandler = (toastId?: string) => {
        dispatch(hideToast(toastId));
        getBrowserProfiles('?page=1', true);
    };

    const successEditTagSocketHandler = () => {
        getBrowserProfiles('?page=1', true);
        dispatch(hideToast(toastLoaderConfig.BULK_TAG_CREATE));
    };

    const successProfileProxyHandler = () => {
        getProxies(`?page=1`);
    };

    const failedBrowserProfileHandler = () => {
        toast.error(<FormattedMessage id="request-error-message" />, {
            icon: <img src={crossError} alt={crossError} />,
        });
    };

    const changeProfileTags = (changedTags: SocketTagsTypes) => {
        const findUpdatedProfileIndex = browserProfiles.findIndex(el => el.id === changedTags.browserProfileId);

        if(findUpdatedProfileIndex !== -1) {
            const updatedProfile = [...browserProfiles];
            const changeProfileTags = {...updatedProfile[findUpdatedProfileIndex], tags: changedTags.tags};
            updatedProfile[findUpdatedProfileIndex] = changeProfileTags;
            dispatch(setBrowserProfiles(updatedProfile));
        }
    };

    useEffect(() => {
        (async () => {
            await getProxies(`?page=1`);
        })();

        return () => {
            dispatch(resetRowIds());
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (folderIds.length) {
                await getBrowserProfiles(`?foldersIds[]=${folderIds}&page=1&perPage=25`);
            } else {
                const urlParams = new URLSearchParams(location.search);

                urlParams.delete('foldersIds[]');
                await getBrowserProfiles('?'+urlParams.toString());
            }
        })();
    }, [folderIds]);

    useEffect(() => {
        const channel = echo.private('browserProfile');
        const proxyChannel = echo.private('proxy');

        channel.listen('.delete.browserProfile', () => successBrowserProfileHandler(toastLoaderConfig.BULK_PROFILE_DELETE));
        channel.listen('.failed.delete.browserProfile', failedBrowserProfileHandler);
        channel.listen('.edit.tagsOnBrowserProfiles', successEditTagSocketHandler);
        channel.listen('.failed.edit.tagsOnBrowserProfiles', failedBrowserProfileHandler);
        channel.listen('.update.tags', (changedTags: SocketTagsTypes) => changeProfileTags(changedTags));
        channel.listen('.add.tags', (changedTags: SocketTagsTypes) => changeProfileTags(changedTags) );
        channel.listen('.edit.proxiesOnBrowserProfiles', () => successBrowserProfileHandler(toastLoaderConfig.BULK_PROXY_EDIT));
        channel.listen('.failed.edit.proxiesOnBrowserProfiles', failedBrowserProfileHandler);
        proxyChannel.listen('.create.proxy', successProfileProxyHandler);
        proxyChannel.listen('.failed.create.proxy', failedBrowserProfileHandler);
        proxyChannel.listen('.update.proxy', successProfileProxyHandler);
        proxyChannel.listen('.failed.update.proxy', failedBrowserProfileHandler);

        return () => {
            channel.stopListening('.delete.browserProfile', successBrowserProfileHandler);
            channel.stopListening('.failed.delete.browserProfile', failedBrowserProfileHandler);
            channel.stopListening('.edit.tagsOnBrowserProfiles');
            channel.stopListening('.failed.edit.tagsOnBrowserProfiles');
            channel.stopListening('.update.tags', (changedTags: SocketTagsTypes) => changeProfileTags(changedTags));
            channel.stopListening('.add.tags', (changedTags: SocketTagsTypes) => changeProfileTags(changedTags) );
            channel.stopListening('.edit.proxiesOnBrowserProfiles' );
            channel.stopListening('.failed.edit.proxiesOnBrowserProfiles' );
            proxyChannel.stopListening('.create.proxy', successProfileProxyHandler);
            proxyChannel.stopListening('.failed.create.proxy', failedBrowserProfileHandler);
            proxyChannel.stopListening('.update.proxy', successProfileProxyHandler);
            proxyChannel.stopListening('.failed.update.proxy', failedBrowserProfileHandler);
        };
    }, [browserProfiles]);

    useEffect(() => {
        socket.on('browser.downloading', () => {
            if(!isBrowserDownload) {
                dispatch(setIsBrowserDownload(true));
                console.log(socket, "browser.downloading");
            }
        });

        socket.on('browser.download.finished', () => {
            dispatch(setIsBrowserDownload(false));
            console.log(socket, "download.finished");
        });

        socket.on('connect', () => {
            console.log(socket, "CONNECTED");
        });

        socket.on('browser.started', (data: socketRunBrowser) => {
            dispatch(setRunProfileId(data.profileId));
            console.log("STARTED");
        });

        socket.on('browser.stopped', (data: socketRunBrowser) => {
            dispatch(setStopProfileId(data.profileId));
            console.log("STOPPED");
        });

        socket.on('browser.start.failed', (data: socketRunBrowser) => {
            dispatch(setFailedProfileId(data.profileId));
            console.log('START FAILED');
        });

        socket.on('browser.stop.failed', (data: socketRunBrowser) => {
            console.log('STOP FAILED');
        });
    },[]);

    useEffect(() => {
        const updatedProfileTotalCount = {
            ...usersInfo,
            usages: {
                ...usersInfo.usages,
                browserProfiles: browserProfilesCount
            },
        };

        dispatch(setUsersInfo(updatedProfileTotalCount));
    }, [browserProfilesCount]);

    const getBrowserProfiles = async (query: string, withSocket?: boolean) => {

        if (!withSocket) {
            setLoading(true);
        }

        return BrowserProfilesApi.getAllBrowserProfiles(query)
            .then((res: AxiosResponse) => {
                const { data } = res.data;
                const { current_page, per_page, last_page, total } = res.data.meta;
                const urlParams = new URLSearchParams( query );

                urlParams.set( 'page', current_page );
                urlParams.set( 'perPage', per_page );

                let url = buildUrl(`/browser-profiles?${ urlParams.toString() }`);

                if (folderIds.length) {
                    url = url+`&foldersIds[]=${folderIds}`
                }

                history.replace(url);
                dispatch(setCurrentPage(current_page));
                dispatch(setLastPage(last_page));
                dispatch(setItemCount(per_page));

                setBrowserProfilesCount(total);
                dispatch(setBrowserProfiles(data));
            })
            .catch((err) => {
                const message = err?.response?.data?.errors?.message;
                logoutWithUnexpectedToken(message || '');
                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            })
            .finally(() => {
                setLoading(false);
                setFilterLoading(false);
            });
    };

    const handleSortProfile = (columnId: string, sort: string) => {
        const urlParams = new URLSearchParams( location.search );
        urlParams.set( 'sort[key][]', columnId );
        urlParams.set( 'sort[value][]', sort );
        getBrowserProfiles('?'+urlParams.toString());
    };

    const handleSearchProfiles = async (searchValue: string) => {
        setFilterLoading(true);
        dispatch(setSearchValue(searchValue));

        if (folderIds.length) {
            await getBrowserProfiles(`?q=${searchValue}&foldersIds[]=${folderIds}`);
        } else {
            await getBrowserProfiles(`?q=${searchValue}`);
        }
    };

    const getProxies = async (query: string) => {
        return ProxyApi.getAllProxies(query)
            .then((res: AxiosResponse) => {
                const data = res.data.data;
                dispatch(setFirstProxies(data));
            })
            .catch((err: any) => {
                const message = err?.response?.data?.errors?.message;
                logoutWithUnexpectedToken(message || '');
            });
    };

    const handleDeleteBrowserProfile = async (selectedRowIds: string[]) => {
        dispatch(showToast(
            {
                id: toastLoaderConfig.BULK_PROFILE_DELETE,
                content: {
                    toastText: 'Loading...',
                    icon: <img src={loaderIcon} alt={loaderIcon} className={styles.loaderIcon} />,
                    color: '#1CA7E2',
                }
            },
        ));

        return BrowserProfilesApi.deleteBrowserProfiles(selectedRowIds)
            .then(() => {

                setShowDeleteConfirmation(false);
                setShowBulkDeleteConfirmation(false);

                toast.success(<FormattedMessage id="browser-profile-success-deleted" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
                dispatch(resetRowIds());
            })
            .catch((err) => {
                const message = err?.response?.data?.errors?.message;
                logoutWithUnexpectedToken(message || '');
                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
                dispatch(hideToast(toastLoaderConfig.BULK_PROFILE_DELETE));
            });
    };

    const updateBrowserProfileItems = async (
        updatedProfile: BrowserProfileDataTypes,
        key: string,
        initialProfiles: BrowserProfileDataTypes[]
    ) => {
        return BrowserProfilesApi.updateProfileItems(updatedProfile, key)
            .then((res) => {
                const { data } = res.data;
                const findUpdatedProfileIndex = initialProfiles.findIndex(el => el.id === data.id);
                const findUpdatedProfile = initialProfiles.find(el => el.id === data.id);

                if(findUpdatedProfileIndex !== -1 && findUpdatedProfile) {
                    const updateProfile = {...findUpdatedProfile, ...data};
                    const updatedProfilesList = [...initialProfiles];
                    updatedProfilesList[findUpdatedProfileIndex] = updateProfile;
                    dispatch(setBrowserProfiles(updatedProfilesList));
                }

                toast.success(<FormattedMessage id="browser-profile-success-updated" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            })
            .catch((err) => {
                const message = err?.response?.data?.errors?.message;
                logoutWithUnexpectedToken(message || '');
                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            });
    };

    const updateProfileProxy = async (proxy: ProxyDataTypes) => {
        const { name, type, host, port, login, password, changeIpUrl } = proxy;
        const updatedProxy: CreateProxyDataTypes = {
            name,
            type,
            host,
            port,
            login,
            password,
            changeIpUrl,
        };

        return ProxyApi.updateProxy(proxy.id, updatedProxy)
            .then(() => {
                getBrowserProfiles(location.search);

                toast.success(<FormattedMessage id="browser-profile-success-updated" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            })
            .catch((err: any) => {
                const message = err?.response?.data?.errors?.message;
                logoutWithUnexpectedToken(message || '');
                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            });
    };

    const handleSaveBulkProxyChanges = ( proxy: ProxyDataTypes | null ) => {
        const browserProfileIds = Array.from( idsOfSelectedRows );
        const updatedProxies = proxy ? [{...proxy, action: 'add' }] : [];

        dispatch(showToast(
            {
                id: toastLoaderConfig.BULK_PROXY_EDIT,
                content: {
                    toastText: 'Loading...',
                    icon: <img src={loaderIcon} alt={loaderIcon} className={styles.loaderIcon} />,
                    color: '#1CA7E2',
                }
            },
        ));

        return ProxyApi.addProfileBulkProxies( updatedProxies, browserProfileIds )
            .then( () => {
                toast.success(<FormattedMessage id="proxy-success-updated" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            } )
            .catch( err => {
                if (err && err.response && err.response.data && err.response.data.errors) {
                    const { message } = err.response.data.errors;
                    logoutWithUnexpectedToken(message);
                }

                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
                dispatch(hideToast(toastLoaderConfig.BULK_PROXY_EDIT));
            } );
    };

    const exportSelectedProfileCookies = async (browserProfile: BrowserProfileTransformedDataTypes[]) => {
        return AgentApi.exportCookies(browserProfile)
            .then((response) => {
                // [
                //    {
                //      id: 'erger',
                //      cookies: '[{},{}]'
                //    }
                // ]
                if (response.status === 200 && response.data) {
                    const blob = new Blob([JSON.stringify(response.data)], {
                        type: 'text/plain;charset=utf-8',
                    });
                    // saveAs(blob, `${browserProfile.name}.txt`);
                } else {
                    // saveAs(new Blob([], {type: 'text/plain;charset=utf-8'}), `${browserProfile.name}.txt`);
                }

                dispatch(resetRowIds());
                toast.success(<FormattedMessage id="browser-profile-bulk-export-cookie-successfully" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            })
            .catch((err) => {
                if (err && err.response && err.response.data && err.response.data.errors) {
                    const { message } = err.response.data.errors;
                    logoutWithUnexpectedToken(message);
                }

                toast.error(<FormattedMessage id="request-error-message" />, {
                    icon: <img src={crossError} alt={crossError} />,
                });
            });
    };

    const handleExportCookies = async (selectedRowIds: string[]) => {
        dispatch(setCheckedIds(selectedRowIds));

        const selectedProfiles = browserProfiles.filter(item => selectedRowIds.includes(item.id));

        // await Promise.map(selectedProfiles, async element => {
        // console.log('element', element)
        // console.log('selectedProfiles', selectedProfiles)
        const transformedProfiles = selectedProfiles.map((profile) => ({
            id: profile.id,
            name: profile.name,
        }));

        console.log('transformedProfiles55', transformedProfiles);
        try {
            return await exportSelectedProfileCookies(transformedProfiles);
        } catch (error) {}
        // });

        dispatch(setCheckedIds([]));
    };

    const handleBulkExportCookies = async () => {
        await handleExportCookies(Array.from(idsOfSelectedRows));
    };

    const handleBulkClickButton = (mode: string) => {
        const agentPort = getAgentPort();
        const runList = JSON.parse(localStorage.getItem('browserRunList') || '[]');
        const profileIds = Array.from(idsOfSelectedRows);
        let profileIdsList = [];

        if (mode === 'start') {
            profileIdsList = profileIds.filter(item => !runList.includes(item));
        } else {
            profileIdsList = profileIds.filter(item => runList.includes(item));
        }

        if (profileIdsList.length === 0) return;

        for (const profileId of profileIdsList) {
            dispatch(setLoadingProfiles(profileId));

            if (agentPort && mode === "start") {
                BrowserProfilesApi.runBrowser(agentPort, profileId)
                    .then((res: AxiosResponse) => {
                        if (!res.data.success) {
                            dispatch(setLoadingProfiles(profileId));
                        }
                    })
                    .catch((err: any) => {
                        dispatch(setLoadingProfiles(profileId));
                        toast.error('Request Error!', {
                            icon: <img src={crossError} alt={crossError} />,
                        });
                        const message = err?.response?.data?.errors?.message;
                        logoutWithUnexpectedToken(message || '');
                    });
            } else if (agentPort && mode === "stop") {
                BrowserProfilesApi.stopBrowser(agentPort, profileId)
                    .then((res: AxiosResponse) => {

                    })
                    .catch((err) => {
                        const message = err?.response?.data?.errors?.message;
                        logoutWithUnexpectedToken(message || '');
                        toast.error(<FormattedMessage id="request-error-message" />, {
                            icon: <img src={crossError} alt={crossError} />,
                        });
                    });
            }
        }
        dispatch(resetRowIds());
    };

    const handleBulkTags = () => {
        setOpenBulkTagModal(!openBulkTagModal);
        setOpenBulkProxyModal(false);
        setOpenBulkFolderModal(false);
        const selectedProfiles = browserProfiles.filter((profile: BrowserProfileDataTypes) => {
            if (idsOfSelectedRows.has(profile.id)) {
                return profile;
            }
        });

        dispatch(setSelectedProfiles(selectedProfiles));
    };

    const handleSubmitProxyChanges = async (updatedData: ProxyDataTypes) => {
        await updateProfileProxy(updatedData);
    };

    async function handleSubmitProfileChanges(
        selectedProfile: BrowserProfileDataTypes,
        key: string,
        initialProfiles: BrowserProfileDataTypes[]
    )  {
        await updateBrowserProfileItems(selectedProfile, key, initialProfiles);
    }

    const handlePageChange = async (page: number) => {
        return getBrowserProfiles(`?page=${page}&perPage=${itemCount}`);
    };

    const handleChangePerPage = async (evt: SelectChangeEvent<number>) => {
        return getBrowserProfiles(`?page=1&perPage=${evt.target.value}`);
    };

    const deleteOneProfile = (selectedProfile: BrowserProfileDataTypes) => {
        setSelectedProfile(selectedProfile);
        setShowDeleteConfirmation(true);
    };

    const confirmProfileDelete = async () => {
        if (!selectedProfile) {
            return
        }

        await handleDeleteBrowserProfile([selectedProfile.id]);
    };

    const handleBulkDelete = (selectedRowIds: string[]) => {
        const selectedProxies = browserProfiles.filter(item => selectedRowIds.includes(item.id));
        setSelectedItems(selectedProxies);
        setShowBulkDeleteConfirmation(true);
    };

    const confirmProfileBulkDelete = async () => {
        const selectedRowIds = selectedItems.map(item => item.id);
        await handleDeleteBrowserProfile(selectedRowIds);
    };

    const handleSubmit = async (
        profile: BrowserProfileDataTypes,
        key: string,
        initialProfiles: BrowserProfileDataTypes[]
    ) => {
        const updatedProfile = {
            ...profile,
            cookies: typeof profile.cookies === 'string' ? profile.cookies : JSON.stringify(profile.cookies),
        };

        if (updatedProfile.proxy && updatedProfile.proxy.id) {
            updatedProfile.proxyId = updatedProfile.proxy.id
        }

        if (updatedProfile.status) {
            updatedProfile.statusId = updatedProfile.status.id
        } else {
            delete updatedProfile.statusId;
        }

        if (updatedProfile.mainWebsite && updatedProfile.mainWebsite.id) {
            updatedProfile.mainWebsiteId = updatedProfile.mainWebsite.id
        }
        await updateBrowserProfileItems(profile, key, initialProfiles);
    };

    const onColumnResize = (updatedColumns: SizeWidthTypes[]) => {

        if (updatedColumns) {
            localStorage.setItem(`browser-profile-title-columns`, JSON.stringify(updatedColumns));

            const updatedCols = updatedColumns.map((column: SizeWidthTypes) => {
                return getUpdatedColumn(column, profileColumns);
            }).filter(Boolean);
            //@ts-ignore
            setProfileColumns(updatedCols);
        }
    };

    const handleColumnResize = (updatedColumns: SizeWidthTypes[]) => {
        onColumnResize(updatedColumns);
    };

    const handleAddBrowserProfile = () => {
        navigate(`/browser-profiles/create`);
    };

    const handelFolderChange = async ( folder?: BrovisorFolderTypes | null, ) => {
        if ( folder && folder.id ) {
            dispatch( setSelectedFolder(folder) );
            setSelectedFolderIds( [ folder.id ] );
        } else {
            setSelectedFolderIds( [] );
            dispatch( setSelectedFolder({id: '', name: '', emoji: ''}) );
        }
    };

    return (
        <Grid
            className={ styles.pageWrapper }
            maxWidth={ `calc(100vw - 56px)` }
        >
            <Stack>
                <BrovisorPageHeader
                    componentTitle="browser-profile-title"
                    addButtonTitle="browser-profile-add-button"
                    count={browserProfilesCount}
                    handleAdd={handleAddBrowserProfile}
                    handleSearch={handleSearchProfiles}
                    loading={filterLoading}
                    globalFilterPlaceholder={"global-filter-placeholder"}
                    disabled={!!idsOfSelectedRows.size}
                />
            </Stack>
            {!loading && (
                <Stack className={styles.foldersContainer}>
                    <BrovisorFolder
                        handelFolderChange={handelFolderChange}
                    />
                </Stack>
            )}
            <Grid className={styles.tableContainer}>
                <BrovisorTable
                    loading={loading}
                    maxHeight={155}
                    columns={profileColumns}
                    data={browserProfiles}
                    getHeaderProps={(column) => column.getSortByToggleProps()}
                    handlePageChange={handlePageChange}
                    handleChangePerPage={handleChangePerPage}
                    onColumnResize={handleColumnResize}
                    bulkOperationsSettings={bulkOperationsSettings}
                    hasCheckbox={true}
                    brovisorEmptyScreenImage={searchValue ? searchIcon : browserProfilesIcon}
                    emptyScreenCreateText={searchValue ?
                        <FormattedMessage id="empty-screen-profiles-not-found"/> : folderIds.length ?
                            <FormattedMessage id="empty-screen-create-profile-in-folder"/> :
                            <FormattedMessage id="empty-screen-create-profile"/> }
                    brovisorCreatedNothingText={ searchValue ?
                        <FormattedMessage id="try-changing-your-search-term"/> : folderIds.length ?
                            <FormattedMessage id="have-not-added-any-profile-to-the-folder"/> :
                            <FormattedMessage id="have-not-created-any-profile-yet"/> }
                    addButtonTitle={ <FormattedMessage id="browser-profile-add-button"/> }
                    handleCreate={ handleAddBrowserProfile }
                    handleSort={handleSortProfile}
                />
            </Grid>
            {
                showDeleteConfirmation && (
                    <DeleteAlertDialog
                        name={selectedProfile.name}
                        titleId={'browser-profile-delete-confirmation-title'}
                        handleSubmit={confirmProfileDelete}
                        handleClose={() => setShowDeleteConfirmation(false)}
                    />
                )
            }
            {
                showBulkDeleteConfirmation && (
                    <AlertDialog
                        titleId={'browser-profile-bulk-delete-confirmation-title'}
                        items={selectedItems}
                        handleSubmit={confirmProfileBulkDelete}
                        handleClose={() => setShowBulkDeleteConfirmation(false)}
                    />
                )
            }
            {
                openBulkProxyModal && (
                    <BulkProxyModal
                        bulkProxyRef = {bulkProxyRef}
                        handleCloseBulkProxyModal={() => setOpenBulkProxyModal(false)}
                        handleSaveChanges={(proxy: ProxyDataTypes | null) => handleSaveBulkProxyChanges(proxy)}
                    />
                )
            }
            {
                openBulkFolderModal && (
                    <BulkFolderModal
                        bulkFolderRef={bulkFolderRef}
                        handleCloseFolderModal={() => setOpenBulkFolderModal(false)}
                        selectedItemsCount={bulkOperationsSettings.selectedItemsCount}
                    />
                )
            }
            {
                <BulkTagModal
                    bulkTagRef={bulkTagRef}
                    open={openBulkTagModal}
                    setOpen={setOpenBulkTagModal}
                />
            }
        </Grid>
    );
}

export default memo(BrowserProfiles);
