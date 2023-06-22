import { Menu } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

export const DatabaseManagement = (props) => {
    const navigate = useNavigate()

    const menu = useMatch({ path: '/console/database/:menu', end: false })
        ?.params.menu
    useEffect(() => {
        if (!menu) navigate('/console/database/db')
    }, [menu])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* <h2 style={{ width: '100%', padding: '0 16px', marginBottom: 0 }}>
                Database
            </h2> */}

            <Menu
                mode="horizontal"
                selectedKeys={[menu!]}
                onClick={(e) => navigate(`/console/database/${e.key}`)}
                items={[
                    {
                        key: 'db',
                        label: 'Collections',
                    },
                    {
                        key: 'playground',
                        label: 'Playground',
                    },
                ]}
            />
            <div style={{ height: 'calc(100% - 48px)' }}>
                <Outlet />
            </div>
        </div>
    )
}
