import { Menu } from 'antd'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const NodeConsole = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/console/node/mutations')
    }, [])
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Menu
                mode="horizontal"
                defaultActiveFirst={true}
                defaultChecked={true}
                defaultSelectedKeys={['mutations']}
                items={[
                    {
                        key: 'mutations',
                        label: 'Mutations',
                    },
                    {
                        key: 'rollup',
                        label: 'Roll-up',
                    },
                    {
                        key: 'events',
                        label: 'Events',
                    },
                    {
                        key: 'account',
                        label: 'Account',
                    },
                    {
                        key: 'setting',
                        label: 'Setting',
                    },
                ]}
                onClick={(e) => {
                    navigate(`/console/node/${e.key}`)
                }}
            />
            <div style={{ height: 'calc(100% - 48px)' }}>
                <Outlet />
            </div>
        </div>
    )
}
