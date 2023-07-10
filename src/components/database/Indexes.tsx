import { Table } from 'antd'
import React, { memo } from 'react'

const Indexes: React.FC<{}> = memo((props) => {
    return (
        <div className="indexes">
            <Table dataSource={[]}>
                <Table.Column title="Name" dataIndex="name" />
                <Table.Column title="Type" dataIndex="type" />
                <Table.Column title="Attributes" dataIndex="attributes" />
                <Table.Column title="Operation" dataIndex="operation" />
            </Table>
        </div>
    )
})
export default Indexes
