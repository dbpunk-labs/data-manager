import React, { memo } from 'react'
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Tabs,
    TabsProps,
    Typography,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import Documents from './Documents'
import Indexes from './Indexes'

const { Paragraph } = Typography

const DatabaseAccount: React.FC<{}> = memo((props) => {
    const items: TabsProps['items'] = [
        {
            key: 'Documents',
            label: 'Documents',
            children: <Documents />,
        },
        {
            key: 'Indexes',
            label: 'Indexes',
            children: <Indexes />,
        },
    ]
    const [docModalvisible, setDocModalvisible] = React.useState(false)
    const [indexModalvisible, setIndexModalvisible] = React.useState(false)
    const [activeKey, setActiveKey] = React.useState('Documents')
    const tableData = [
        {
            name: 'accounts1',
            type: 'key',
            attribute: 'name',
        },
        {
            name: 'accounts1',
            type: 'key',
            attribute: 'name',
        },
    ]
    return (
        <div className="database-account">
            <div className="table-header-title">
                Book_Store/Account
                <Paragraph copyable>addr：asdfsfdghretgbxegtbfdheadg</Paragraph>
            </div>
            <Tabs
                className="db3-tabs db3-sub-tabs"
                defaultActiveKey={activeKey}
                items={items}
                onChange={setActiveKey}
                tabBarExtraContent={
                    <Space>
                        <Input.Search
                            style={{ marginBottom: 0 }}
                            placeholder="Search"
                        />
                        {activeKey === 'Documents' ? (
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => setDocModalvisible(true)}
                            >
                                Insert Document
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() => setIndexModalvisible(true)}
                            >
                                Insert Index
                            </Button>
                        )}
                    </Space>
                }
            />
            <Modal
                className="db3-modal"
                title="Insert Doc"
                open={docModalvisible}
                onCancel={() => setDocModalvisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Collection">
                        <Select />
                    </Form.Item>
                    <Form.Item label="Doc">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="db3-modal"
                title="Insert Index"
                open={indexModalvisible}
                onCancel={() => setIndexModalvisible(false)}
                okText="Create"
            >
                <Form layout="vertical">
                    <Form.Item label="Collection">
                        <Select />
                    </Form.Item>
                    <Form.Item label="Indexes">
                        <Table
                            dataSource={tableData}
                            pagination={false}
                            className="index-table"
                        >
                            <Table.Column
                                width={180}
                                title="Index Name"
                                dataIndex="name"
                                render={(text, record, index) => (
                                    <Input value={text} />
                                )}
                            />
                            <Table.Column
                                width={180}
                                title="Type"
                                dataIndex="type"
                                render={(text, record, index) => (
                                    <Select value={text}>
                                        <Select.Option value="key">
                                            key
                                        </Select.Option>
                                        <Select.Option value="text">
                                            text
                                        </Select.Option>
                                    </Select>
                                )}
                            />
                            <Table.Column
                                width={180}
                                title="Atrribute"
                                dataIndex="atrribute"
                                render={(text, record, index) => (
                                    <Input value={text} />
                                )}
                            />
                        </Table>
                        <Button
                            className="add-index"
                            icon={<PlusCircleOutlined />}
                            size="large"
                        >
                            Add Index
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
})
export default DatabaseAccount
