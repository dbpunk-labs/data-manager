import React, { memo } from 'react'
import { Alert, Dropdown, Input, MenuProps, Modal, Tree } from 'antd'
import { Outlet, Link } from 'react-router-dom'
import {
    DownOutlined,
    DatabaseOutlined,
    EllipsisOutlined,
} from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'
interface TreeTitleProps {
    title: string
}

const TreeTitle: React.FC<TreeTitleProps> = (props) => {
    const [visible, setVisible] = React.useState(false)
    const items: MenuProps['items'] = [
        {
            key: '3',
            label: <a onClick={() => setVisible(true)}>delete</a>,
        },
    ]
    return (
        <>
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
            <Modal
                open={visible}
                onCancel={() => setVisible(false)}
                title="Delete Event DB"
                className="db3-modal db3-delete-modal"
                width={559}
                okText="Delete"
                okButtonProps={{
                    danger: true,
                    ghost: true,
                    className: 'delete-btn',
                }}
            >
                <Alert
                    showIcon
                    type="warning"
                    message="Once Event DBdeleted, it cannot be recovered. Please proceed
                    with caution."
                ></Alert>
                <div className="delete-check">
                    Enter “delete” in the input box bellow to confirm the
                    operation
                </div>
                <Input />
            </Modal>
        </>
    )
}

const Events: React.FC<{}> = memo((props) => {
    const treeData: DataNode[] = [
        {
            title: <TreeTitle title="Uniswap_pool" />,
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
                <Input.Search placeholder="Search" />
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
