import { Menu } from 'antd'
import React, { useEffect } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'
import PageContext, { IPageContext } from '../data-context/page-context'
import { STORAGE_NODE_URL, INDEX_NODE_URL } from '../data-context/config'
import { ConsoleHeader } from '../components/console/console-header'
import { useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'
import { useAsyncFn } from 'react-use'
import {
    Client,
    createFromExternal,
    createClient,
    createReadonlyClient,
    syncAccountNonce,
} from 'db3.js'

export const ConsolePage = (props) => {
    const [isInited, setInited] = React.useState<boolean>(false)
    const [pageContext, setPageContext] = React.useState<IPageContext>(
        {} as IPageContext
    )
    const { chain } = useNetwork()
    const [initReadClientRet, initReadClientFn] = useAsyncFn(async () => {
        try {
            const account = await createReadonlyClient(chain)
            const c = createReadonlyClient(STORAGE_NODE_URL, INDEX_NODE_URL)
            setPageContext({
                ...pageContext,
                readClient: c,
            } as IPageContext)
        } catch (e) {
            console.log(e)
        }
    }, [pageContext])

    const [initClientRet, initClientFn] = useAsyncFn(async () => {
        if (chain) {
            try {
                const account = await createFromExternal(chain)
                const c = createClient(
                    STORAGE_NODE_URL,
                    INDEX_NODE_URL,
                    account
                )
                await syncAccountNonce(c)
                setPageContext({
                    ...pageContext,
                    client: c,
                } as IPageContext)
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('no chain')
        }
    }, [chain, pageContext])
    const accountHandle = useAccount({
        onConnect({ address, connector, isReconnected }) {
            initClientFn()
        },
    })
    const navigate = useNavigate()
    const activeMenu = useMatch({ path: '/console/:menu', end: false })?.params
        .menu
    useEffect(() => {
        if (!activeMenu) navigate('/console/home')
    }, [activeMenu])
    if (!isInited) {
        setInited(true)
        initReadClientFn()
    }
    return (
        <PageContext.Provider value={pageContext}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    style={{ height: 64, borderBottom: '1px solid lightgray' }}
                >
                    <ConsoleHeader />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 'calc(100% - 64px)',
                    }}
                >
                    <div
                        style={{
                            width: 160,
                            minHeight: '100%',
                            borderRight: '1px solid rgba(5, 5, 5, 0.06)',
                        }}
                    >
                        <Menu
                            selectedKeys={[activeMenu!]}
                            activeKey={activeMenu}
                            mode="inline"
                            items={[
                                {
                                    key: 'home',
                                    label: 'Home',
                                },
                                {
                                    key: 'database',
                                    label: 'Database',
                                },
                                {
                                    key: 'event-db',
                                    label: 'Event DB',
                                },
                                {
                                    key: 'node',
                                    label: 'Node',
                                },
                            ]}
                            onClick={(e) => {
                                navigate(`/console/${e.key}`)
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: 'calc(100% - 160px)',
                            height: '100%',
                        }}
                    >
                        <Outlet />
                    </div>
                </div>
            </div>
        </PageContext.Provider>
    )
}
