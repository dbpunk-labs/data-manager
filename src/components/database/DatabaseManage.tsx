import React, { memo, useEffect } from 'react'
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
import { useAsyncFn } from 'react-use'
import { showDatabase, showCollection } from 'db3.js'
import { useAccount } from 'wagmi'
import { usePageContext } from '../../pages/Context'

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
            key: '2',
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
    const { address, isConnecting, isDisconnected } = useAccount()
    const [treeData, setTreeData] = React.useState<DataNode[]>([])
    const { client } = usePageContext()
    const [getTreeDataState, getTreeData] = useAsyncFn(async () => {
        if (address && client) {
            try {
                const databases = await showDatabase(address, client)
                const docDatabases = databases.filter(
                    (item) => item.internal?.database?.oneofKind === 'docDb'
                )
                const treeData = await Promise.all(
                    docDatabases.map(async (item) => {
                        try {
                            const collections = await showCollection(item)
                            const desc = item.internal?.database?.docDb?.desc
                            const name = desc.split(':')[0]
                            return {
                                title: <TreeTitle title={name} />,
                                key: item.addr,
                                icon: <DatabaseOutlined />,
                                children: collections.map((c) => {
                                    return {
                                        title: (
                                            <Link to={`/database/${c.db.addr}/${c.name}`}>
                                                {c.name}
                                            </Link>
                                        ),
                                        key: c.name,
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
