import React, { memo } from 'react'
import { Input, Tree } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import { DownOutlined, DatabaseOutlined } from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

const Events: React.FC<{}> = memo((props) => {
    const treeData: DataNode[] = [
        {
            title: 'Uniswap_pool',
            key: 'Uniswap_pool',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: <Link to="/eventdb/0x223fddaa">name1</Link>,
                    key: 'accounts1',
                    icon: null,
                },
                {
                    title: <Link to="/eventdb/0x223fddaa">name2</Link>,
                    key: 'accounts2',
                },
            ],
        },
        {
            title: 'Curve_Swap1',
            key: 'Curve_Swap1',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: <Link to="/eventdb/0x223fddaa">name1</Link>,
                    key: 'accounts21',
                },
                {
                    title: <Link to="/eventdb/0x223fddaa">name2</Link>,
                    key: 'accounts22',
                },
            ],
        },
        {
            title: 'Curve_Swap2',
            key: 'Curve_Swap2',
            icon: <DatabaseOutlined />,
        },
    ]
    return (
        <div className="events">
            <div className="events-left">
                <Input.Search />
                <Tree
                    showIcon
                    blockNode
                    defaultExpandAll
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                />
            </div>
            <div className="events-right">
                <Outlet />
            </div>
        </div>
    )
})
export default Events
