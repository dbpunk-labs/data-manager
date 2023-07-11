import React from 'react'
import { Breadcrumb } from 'antd'
import { ConnectWallet } from '../connect-wallet'
import { Link } from 'react-router-dom'
import { Wallet } from '../../data-context/wallet'
import { usePageContext } from '../../data-context/page-context'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

export const ConsoleHeader = () => {
    const { client } = usePageContext()
    const breadcrumbNameMap = [
        {
            key: '/console/home',
            title: <Link to="/console/home">Home</Link>,
        },
        {
            key: '/console/database',
            title: <Link to="/console/database">Database</Link>,
        },
        {
            key: '/console/event-db',
            title: <Link to="/console/event-db">Event DB</Link>,
        },
        {
            key: '/console/node',
            title: <Link to="/console/node">Node</Link>,
        },
    ]

    const item = breadcrumbNameMap.find((item) =>
        location.pathname.includes(item.key)
    )
    const breadcrumbItems = [
        {
            title: <Link to="/console">Home</Link>,
            key: 'home',
        },
    ].concat(item ? [item] : [])

    return (
        <div
            style={{
                height: 40,
                padding: 12,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <div style={{ width: 60 }}></div>
            <div
                style={{
                    width: 'calc(100% - 60px)',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Breadcrumb items={breadcrumbItems} />
                <ConnectWallet />
            </div>
        </div>
    )
}
