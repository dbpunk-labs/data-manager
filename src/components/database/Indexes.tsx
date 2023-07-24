import { Table } from 'antd'
import React, { memo } from 'react'
import sortSrc from '../../assets/sort.svg'
import filterSrc from '../../assets/filter.svg'
import { IndexType } from 'db3.js'

const Indexes: React.FC<{}> = memo((props) => {
    return (
        <div className="indexes">
            <Table dataSource={props.collection.indexFields}>
                <Table.Column
                    title="Path"
                    dataIndex="path"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Type"
                    dataIndex="indexType"
                    filtered={true}
                    filters={[]}
                    render={(text, record, index) =>
                        IndexType[record.indexType]
                    }
                    filterIcon={() => <img src={filterSrc} />}
                />
            </Table>
        </div>
    )
})
export default Indexes
