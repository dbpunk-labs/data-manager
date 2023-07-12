import React, { memo } from 'react'
import { Descriptions, Input, Table } from 'antd'

const RollupNode: React.FC<{}> = memo((props) => {
    return (
        <div className="rollup-node">
            <div className="db3-box">
                <Descriptions
                    className="db3-banner-descriptions"
                    layout="vertical"
                    column={4}
                >
                    <Descriptions.Item label="10 GB">
                        Origin Data Size
                    </Descriptions.Item>
                    <Descriptions.Item label="0.98 GB">
                        0.98 GB
                    </Descriptions.Item>
                    <Descriptions.Item label="98 $">
                        Total Fees
                    </Descriptions.Item>
                    <Descriptions.Item label="0.5 $">
                        Avg Cost if 1 GB
                    </Descriptions.Item>
                    <Descriptions.Item label="0.000006 $">
                        Avg Cost for a data
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <div className="table-toobar">
                <div className="table-title">Rollup List</div>
                <Input.Search placeholder="Search" />
            </div>
            <Table dataSource={[]}>
                <Table.Column title="Batch No." dataIndex="" />
                <Table.Column title="Age" dataIndex="" />
                <Table.Column title="Origin Size" dataIndex="" />
                <Table.Column title="Batch Size" dataIndex="" />
                <Table.Column title="Mutation" dataIndex="" />
                <Table.Column title="AR Block" dataIndex="" />
                <Table.Column title="Fees" dataIndex="" />
                <Table.Column title="AR tx" dataIndex="" />
                <Table.Column title="evm tx" dataIndex="" />
            </Table>
        </div>
    )
})
export default RollupNode
