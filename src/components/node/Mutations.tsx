import React, { memo } from 'react'
import { Table, Tag } from 'antd'
import sortSrc from '../../assets/sort.svg'

const MutaitionsTable: React.FC<{}> = memo((props) => {
    return (
        <div className="mutations-table">
            <Table dataSource={[]}>
                <Table.Column
                    title="No."
                    dataIndex=""
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column title="Type" dataIndex="" />
                <Table.Column
                    title="Age"
                    dataIndex=""
                    render={(text) => <Tag color="magenta">{text}</Tag>}
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column title="DB Addr" dataIndex="" />
                <Table.Column title="Sender" dataIndex="" />
                <Table.Column title="State" dataIndex="" />
                <Table.Column title="Ar Block" dataIndex="" />
            </Table>
        </div>
    )
})
export default MutaitionsTable
