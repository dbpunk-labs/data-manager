import React, { memo } from 'react'
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Table,
    Tree,
    Typography,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

const { Paragraph } = Typography

const Collections: React.FC<{}> = memo((props) => {
    const tableData = [
        {
            name: 'accounts1',
            documents: 100,
            size: '1.2MB',
            index: 10,
        },
    ]
    const [visible, setVisible] = React.useState(false)
    return (
        <>
            <div className="collections">
                <div className="database-table-header">
                    <div className="table-header-left">
                        <div className="table-header-title">
                            Book_Store
                            <Paragraph copyable>
                                addr：asdfsfdghretgbxegtbfdheadg
                            </Paragraph>
                        </div>
                        <div className="table-header-desc">
                            This is a paragraph explaining the database, and the
                            specific content needs to be provided by PD
                        </div>
                    </div>
                    <div className="table-header-right">
                        <Button
                            type="ghost"
                            className="db3-ghost"
                            icon={<PlusCircleOutlined />}
                            onClick={() => setVisible(true)}
                        >
                            Create Collection
                        </Button>
                    </div>
                </div>
                <Table dataSource={tableData}>
                    <Table.Column title="Collection Name" dataIndex="name" />
                    <Table.Column title="Documents" dataIndex="documents" />
                    <Table.Column title="Total Size" dataIndex="size" />
                    <Table.Column title="Indexes" dataIndex="index" />
                </Table>
            </div>
            <Modal
                className="db3-modal"
                title="Create Collection"
                open={visible}
                onCancel={() => setVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Database">
                        <Select />
                    </Form.Item>
                    <Form.Item label="Collection Name">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})
export default Collections
