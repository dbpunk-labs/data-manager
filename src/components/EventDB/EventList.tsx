import React, { memo } from 'react'

import { Button, Input, Space, Tabs, TabsProps, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import sortSrc from '../../assets/sort.svg'

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
                <Table.Column
                    title="Documents"
                    dataIndex="documents"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Total Size"
                    dataIndex="size"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Indexes"
                    dataIndex="index"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column title="Operation" dataIndex="name" />
            </Table>
        </div>
    )
})
export default EventList
