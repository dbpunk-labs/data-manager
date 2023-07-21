import React, { memo,useEffect } from 'react'
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
import sortSrc from '../../assets/sort.svg'
import { usePageContext } from '../../pages/Context'
import { useContractWrite,useAccount, useContractEvent } from 'wagmi'
import { useAsyncFn } from 'react-use'
import { stringToHex } from 'viem'
import { showDatabase, db3MetaStoreContractConfig } from 'db3.js'
const { Option } = Select;

interface DatabaseNameAddress {
    label:string,
    value:string
}

const { Paragraph } = Typography
const Collections: React.FC<{}> = memo((props) => {
     const tableData = [
        {
            key: '1',
            name: 'accounts1',
            documents: 100,
            size: '1.2MB',
            index: 10,
        },
        {
            key: '2',
            name: 'accounts1',
            documents: 100,
            size: '1.2MB',
            index: 10,
        },
    ]

    const [visible, setVisible] = React.useState(false)
    function tableOnChange(
        pagination,
        filters,
        sorter,
        extra: { currentDataSource: []; action: 'paginate' | 'sort' | 'filter' }
    ) {
        // 分页
        // 排序
    }
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
                <Table dataSource={tableData} onChange={tableOnChange}>
                    <Table.Column title="Collection Name" dataIndex="name" />
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
                        <Select/>
                    </Form.Item>
                    <Form.Item label="Collection Name">
                        <Input
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})
export default Collections
