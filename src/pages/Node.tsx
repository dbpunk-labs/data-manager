import React, { memo } from 'react'
import { Tabs, TabsProps } from 'antd'
import NodeDatabase from '../components/node/Database'

import '../styles/Node.scss'
import RollupNode from '../components/node/RollupNode'
import IndexNode from '../components/node/IndexNode'
import MutaitionsTable from '../components/node/Mutations'
import Account from '../components/node/Account'
import Setting from '../components/node/Setting'

const Node: React.FC<{}> = memo((props) => {
    const items: TabsProps['items'] = [
        {
            key: 'database',
            label: 'Database',
            children: <NodeDatabase />,
        },
        {
            key: 'RollupNode',
            label: 'Rollup Node',
            children: <RollupNode />,
        },
        {
            key: 'IndexNode',
            label: 'Index Node',
            children: <IndexNode />,
        },
        {
            key: 'Mutations',
            label: 'Mutations',
            children: <MutaitionsTable />,
        },
        {
            key: 'Account',
            label: 'Account',
            children: <Account />,
        },
        {
            key: 'setting',
            label: 'Setting',
            children: <Setting />,
        },
    ]
    return (
        <div className="node-view">
            <Tabs className="db3-tabs tabs-smill db3-sub-tabs" items={items} />
        </div>
    )
})
export default Node
