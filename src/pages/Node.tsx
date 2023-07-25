import React, { memo } from 'react'
import { Tabs, TabsProps } from 'antd'
import NodeDashboard from '../components/node/Dashboard'
import { useMatch, Link } from 'react-router-dom'
import '../styles/Node.scss'
import RollupNode from '../components/node/RollupNode'
import IndexNode from '../components/node/IndexNode'
import MutaitionsTable from '../components/node/Mutations'
import Account from '../components/node/Account'
import Setting from '../components/node/Setting'

const Node: React.FC<{}> = memo((props) => {
    const routeParams = useMatch('/node/:tab')?.params
    const items: TabsProps['items'] = [
        {
            key: 'dashboard',
            label: (
                <Link to="/node/dashboard">
                    <div>Dashboard</div>
                </Link>
            ),
            children: <NodeDashboard />,
        },
        {
            key: 'rollup',
            label: (
                <Link to="/node/rollup">
                    <div>Rollups</div>
                </Link>
            ),
            children: <RollupNode />,
        },
        {
            key: 'mutations',
            label: (
                <Link to="/node/mutations">
                    <div>Mutations</div>
                </Link>
            ),
            children: <MutaitionsTable />,
        },
        {
            key: 'account',
            label: (
                <Link to="/node/account">
                    <div>Account</div>
                </Link>
            ),
            children: <Account />,
        },
        {
            key: 'setting',
            label: (
                <Link to="/node/setting">
                    <div>Settings</div>
                </Link>
            ),
            children: <Setting />,
        },
    ]
    return (
        <div className="node-view">
            <Tabs
                className="db3-tabs tabs-smill db3-sub-tabs"
                items={items}
                activeKey={routeParams.tab}
            />
        </div>
    )
})
export default Node
