import React, { memo } from 'react'

import { Button, Input, Space, Tabs, TabsProps, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Table } from 'antd'

const { Paragraph } = Typography

const EventList: React.FC<{}> = memo((props) => {
    const tableData = [
        {
            name: 'accounts1',
            documents: 100,
            size: '1.2MB',
            index: 10,
        },
    ]
    return (
        <div className="event-list">
            <div className="database-table-header">
                <div className="table-header-left">
                    <div className="table-header-title">
                        Uniswap_pool
                        <Paragraph copyable>
                            addr：asdfsfdghretgbxegtbfdheadg
                        </Paragraph>
                    </div>
                    <div className="table-header-desc">
                        Contract addr
                        <Paragraph copyable>
                            addr：asdfsfdghretgbxegtbfdheadg
                        </Paragraph>
                    </div>
                </div>
            </div>
            <Table dataSource={tableData}>
                <Table.Column title="Indexer Name" dataIndex="name" />
                <Table.Column title="Documents" dataIndex="documents" />
                <Table.Column title="Total Size" dataIndex="size" />
                <Table.Column title="Indexes" dataIndex="index" />
                <Table.Column title="Operation" dataIndex="name" />
            </Table>
        </div>
    )
})
export default EventList
