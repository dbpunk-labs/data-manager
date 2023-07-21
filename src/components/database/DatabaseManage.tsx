import React, { memo } from 'react'
import '../../styles/DatabaseManage.scss'
import {
    Button,
    Dropdown,
    Input,
    MenuProps,
    Table,
    Tree,
    Typography,
} from 'antd'
import {
    DownOutlined,
    DatabaseOutlined,
    PlusCircleOutlined,
    EllipsisOutlined,
} from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'
import { Link, Outlet } from 'react-router-dom'

const { Paragraph } = Typography

interface TreeTitleProps {
    title: string
}

export const TreeTitle: React.FC<TreeTitleProps> = (props) => {
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <a>Create Collection</a>,
        },
        {
            key: '1',
            label: <a>Edit</a>,
        },
    ]
    return (
        <div className="tree-title">
            {props.title}
            <Dropdown
                menu={{ items }}
                overlayClassName="tree-dropdown"
                placement="bottomRight"
                trigger={['contextMenu']}
            >
                <EllipsisOutlined />
            </Dropdown>
        </div>
    )
}

const DatabaseManage: React.FC<{}> = memo((props) => {
    const treeData: DataNode[] = [
        {
            title: <TreeTitle title="Book_Store" />,
            key: 'Book_Store',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: <Link to="/database/0x223fddaa">accounts1</Link>,
                    key: 'accounts1',
                    icon: null,
                },
                {
                    title: <Link to="/database/0x223fddaa">accounts2</Link>,
                    key: 'accounts2',
                },
            ],
        },
        {
            title: 'Book_Store2',
            key: 'Book_Store2',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: <Link to="/database/0x223fddaa">accounts1</Link>,
                    key: 'accounts21',
                },
                {
                    title: <Link to="/database/0x223fddaa">accounts2</Link>,
                    key: 'accounts22',
                },
            ],
        },
        {
            title: 'Book_Store3',
            key: 'Book_Store3',
            icon: <DatabaseOutlined />,
        },
    ]

    return (
        <div className="database-manage">
            <div className="database-left">
                <Input.Search placeholder="Search" />
                <Tree
                    showIcon
                    blockNode
                    defaultExpandAll
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                />
            </div>
            <div className="database-right">
                <Outlet />
            </div>
        </div>
    )
})
export default DatabaseManage