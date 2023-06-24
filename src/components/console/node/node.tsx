import { Menu } from 'antd'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const NodeConsole = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/console/node/rollup')
    }, [])
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* <h2 style={{ width: '100%', padding: '0 16px', marginBottom: 0 }}>
                Node
            </h2> */}
            <Menu
                mode="horizontal"
                defaultActiveFirst={true}
                defaultChecked={true}
                defaultSelectedKeys={['rollup']}
                items={[
                    {
                        key: 'rollup',
                        label: 'Roll-up',
                    },
                    {
                        key: 'mutations',
                        label: 'Mutations',
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
