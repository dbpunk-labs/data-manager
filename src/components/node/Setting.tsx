import React, { memo } from 'react'
import {
    Descriptions,
    Typography,
    Table,
    Input,
    Form,
    Space,
    Button,
} from 'antd'

const { Paragraph } = Typography

const Setting: React.FC<{}> = memo((props) => {
    const tableData = [
        {
            addr: '0x61e613F27b8B48144fbf93DFdBcC5B2BEa6eb7DD',
            endpoint: '127.0.0.1:26659',
        },
        {
            addr: '0x61e613F27b8B48144fbf93DFdBcC5B2BEa6eb7DD',
            endpoint: '127.0.0.1:26659',
        },
    ]
    return (
        <div className="setting">
            <div className="db3-box">
                <Descriptions
                    className="db3-descriptions"
                    column={1}
                    layout="vertical"
                >
                    <Descriptions.Item label="Node Admin">
                        <Paragraph copyable>
                            8AiVx-VNNV8NbEZ69qHfRDD27WbUZCndjEJp6COc{' '}
                        </Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label="Network ID">
                        <Paragraph copyable>
                            8AiVx-VNNV8NbEZ69qHfRDD27WbUZCndjEJp6COc{' '}
                        </Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label="write Nodes" span={2}>
                        <Descriptions
                            className="db3-descriptions"
                            layout="vertical"
                        >
                            <Descriptions.Item label="Addr">
                                <Paragraph copyable>
                                    8AiVx-VNNV8NbEZ69qHfRDD27WbUZCndjEJp6COc{' '}
                                </Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Endpoint">
                                <Paragraph copyable>127.0.0.1 </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <div className="db3-box">
                <div className="db3-box-title">Indexer Nodes</div>
                <Table
                    dataSource={tableData}
                    pagination={false}
                    className="index-table"
                >
                    <Table.Column
                        width={180}
                        title="Addr"
                        dataIndex="addr"
                        render={(text, record, index) => <Input value={text} />}
                    />
                    <Table.Column
                        width={180}
                        title="Endpoint"
                        dataIndex="endpoint"
                        render={(text, record, index) => <Input value={text} />}
                    />
                </Table>
            </div>
            <div className="db3-box">
                <div className="db3-box-title">Roll-Up Rule</div>
                <Form layout="vertical">
                    <Form.Item
                        label="Size"
                        help="Min. size recommended: 10Mb, AR requires 1Mb at min,DB3 will compress 10Mb to 1Mb."
                    >
                        <Input suffix="Mb" />
                    </Form.Item>
                    <Form.Item
                        label="Time"
                        help="Min. 1 min, data size should be > 10Mb first."
                    >
                        <Input suffix="Min" />
                    </Form.Item>

                    <Form.Item
                        label="Interval Time for Rollup"
                        help="Set the time frequency for the rollup."
                    >
                        <Input suffix="Min" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size="large">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
})
export default Setting
