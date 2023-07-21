import { Table } from 'antd'
import React, { memo } from 'react'
import sortSrc from '../../assets/sort.svg'
import filterSrc from '../../assets/filter.svg'

const Indexes: React.FC<{}> = memo((props) => {
    return (
        <div className="indexes">
            <Table dataSource={[]}>
                <Table.Column
                    title="Name"
                    dataIndex="name"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Type"
                    dataIndex="type"
                    filtered={true}
                    filters={[]}
                    filterIcon={() => <img src={filterSrc} />}
                />
                <Table.Column title="Attributes" dataIndex="attributes" />
                {/* <Table.Column title="Operation" dataIndex="operation" /> */}
            </Table>
        </div>
    )
})
export default Indexes
