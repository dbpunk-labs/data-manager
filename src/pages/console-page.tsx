import { Menu } from 'antd'
import React, { useEffect } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router-dom'

import { ConsoleHeader } from '../components/console/console-header'

export const ConsolePage = (props) => {
    const navigate = useNavigate()

    const activeMenu = useMatch({ path: '/console/:menu', end: false })?.params
        .menu

    useEffect(() => {
        if (!activeMenu) navigate('/console/home')
    }, [activeMenu])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <div style={{ height: 64, borderBottom: '1px solid lightgray' }}>
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
    )
}
