import React, { memo, useEffect } from 'react'
import { showDatabase, showCollection } from 'db3.js'
import { Alert, Dropdown, Input, MenuProps, Modal, Tree } from 'antd'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import {
    DownOutlined,
    DatabaseOutlined,
    EllipsisOutlined,
    TableOutlined,
} from '@ant-design/icons'

import { deleteEventDatabase } from 'db3.js'
import { DataNode } from 'antd/es/tree'
import { useAccount } from 'wagmi'
import { usePageContext } from '../../pages/Context'
import { useAsyncFn } from 'react-use'
interface TreeTitleProps {
    title: string
}

const TreeTitle: React.FC<TreeTitleProps> = (props) => {
    const navigate = useNavigate()
    const [visible, setVisible] = React.useState(false)
    const items: MenuProps['items'] = [
        {
            key: '3',
            label: <a onClick={() => setVisible(true)}>delete</a>,
        },
    ]
    const { client } = usePageContext()
    const [inputName, setInputName] = React.useState('')
    const [deleteEventDatabaseState, deleteEventDatabaseHandle] =
        useAsyncFn(async () => {
            if (client) {
                if (inputName != props.title) {
                    console.log('name mismatch')
                    return
                }
                const result = await deleteEventDatabase(client, props.addr)
                setVisible(false)
                navigate('/eventdb')
            }
        }, [client, inputName])
    return (
        <>
            <Link to={`/eventdb/${props.addr}`}>
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
            </Link>
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
                onOk={() => deleteEventDatabaseHandle()}
            >
                <Alert
                    showIcon
                    type="warning"
                    message="Once Event Database has been deleted, it cannot be recovered. Please proceed
                    with caution."
                ></Alert>
                <div className="delete-check">
                    Enter “delete” in the input box bellow to confirm the
                    operation
                </div>
                <Input
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                />
            </Modal>
        </>
    )
}

const Events: React.FC<{}> = memo((props) => {
    const { address, isConnecting, isDisconnected } = useAccount()
    const [treeData, setTreeData] = React.useState<DataNode[]>([])
    const { client } = usePageContext()
    const [getTreeDataState, getTreeData] = useAsyncFn(async () => {
        if (address && client) {
            try {
                const databases = await showDatabase(address, client)
                const eventDatabases = databases.filter(
                    (item) => item.internal?.database?.oneofKind === 'eventDb'
                )
                const treeData = await Promise.all(
                    eventDatabases.map(async (item) => {
                        try {
                            const collections = await showCollection(item)
                            const desc = item.internal?.database?.eventDb?.desc
                            const name = desc.split(':')[0]
                            return {
                                title: (
                                    <TreeTitle title={name} addr={item.addr} />
                                ),
                                key: item.addr,
                                icon: <DatabaseOutlined />,
                                children: collections.map((c) => {
                                    return {
                                        title: (
                                            <Link
                                                to={`/eventdb/${c.db.addr}/${c.name}`}
                                            >
                                                <div className="tree-title">
                                                    {c.name}
                                                </div>
                                            </Link>
                                        ),
                                        key: c.name,
                                        icon: <TableOutlined />,
                                    }
                                }),
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    })
                )
                setTreeData(treeData)
            } catch (e) {
                console.log(e)
            }
        }
    }, [address, client])

    useEffect(() => {
        getTreeData()
    }, [client])

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
