import { Menu } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

export const EventDB = () => {
    const menu = useMatch({ path: '/console/event-db/:menu', end: false })
        ?.params.menu
    const navigate = useNavigate()

    useEffect(() => {
        if (!menu) navigate('/console/event-db/events')
    }, [menu])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* <h2 style={{ width: '100%', padding: '0 16px', marginBottom: 0 }}>
                Event DB
            </h2> */}
            <Menu
                mode="horizontal"
                selectedKeys={[menu!]}
                items={[
                    {
                        key: 'events',
                        label: 'Events',
                    },
                    {
                        key: 'playground',
                        label: 'Playground',
                    },
                ]}
                onClick={(e) => {
                    navigate(`/console/event-db/${e.key}`)
                }}
            />
            <div style={{ height: 'calc(100% - 48px)' }}>
                <Outlet />
            </div>
        </div>
    )
}
