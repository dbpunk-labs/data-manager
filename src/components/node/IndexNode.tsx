import { Table, Tag } from 'antd'
import React, { memo } from 'react'

const IndexNode: React.FC<{}> = memo((props) => {
    return (
        <div className="index-node">
            <Table dataSource={[]}>
                <Table.Column title="No." dataIndex="" />
                <Table.Column title="Type" dataIndex="" />
                <Table.Column
                    title="Age"
                    dataIndex=""
                    render={(text) => <Tag color="magenta">{text}</Tag>}
                />
                <Table.Column title="DB Addr" dataIndex="" />
                <Table.Column title="Sender" dataIndex="" />
                <Table.Column title="State" dataIndex="" />
                <Table.Column title="Ar Block" dataIndex="" />
            </Table>
        </div>
    )
})
export default IndexNode
