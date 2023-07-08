import React, { memo } from 'react'
import '../../styles/DatabaseManage.scss'
import { Button, Input, Table, Tree, Typography } from 'antd'
import {
    DownOutlined,
    DatabaseOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons'
import { DataNode } from 'antd/es/tree'

const { Paragraph } = Typography

const DatabaseManage: React.FC<{}> = memo((props) => {
    const treeData: DataNode[] = [
        {
            title: 'Book_Store',
            key: 'Book_Store',
            icon: <DatabaseOutlined />,
            children: [
                {
                    title: 'accounts1',
                    key: 'accounts1',
                    icon: null,
                },
                {
                    title: 'accounts2',
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
                    title: 'accounts2',
                    key: 'accounts21',
                },
                {
                    title: 'accounts2',
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
    const tableData = [
        {
            name: 'accounts1',
            documents: 100,
            size: '1.2MB',
            index: 10,
        },
    ]
    return (
        <div className="database-manage">
            <div className="database-left">
                <Input.Search />
                <Tree
                    showIcon
                    blockNode
                    defaultExpandAll
                    switcherIcon={<DownOutlined />}
                    treeData={treeData}
                />
            </div>
            <div className="database-right">
                <div className="database-table-header">
                    <div className="table-header-left">
                        <div className="table-header-title">
                            Book_Store
                            <Paragraph copyable>
                                addr：asdfsfdghretgbxegtbfdheadg
                            </Paragraph>
                        </div>
                        <div className="table-header-desc">
                            This is a paragraph explaining the database, and the
                            specific content needs to be provided by PD
                        </div>
                    </div>
                    <div className="table-header-right">
                        <Button
                            type="ghost"
                            className="db3-ghost"
                            icon={<PlusCircleOutlined />}
                        >
                            Create Collection
                        </Button>
                    </div>
                </div>
                <Table dataSource={tableData}>
                    <Table.Column title="Collection Name" dataIndex="name" />
                    <Table.Column title="Documents" dataIndex="documents" />
                    <Table.Column title="Total Size" dataIndex="size" />
                    <Table.Column title="Indexes" dataIndex="index" />
                </Table>
            </div>
        </div>
    )
})
export default DatabaseManage
