import React, { memo, useEffect } from 'react'
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
import {
    getCollection,
    queryDoc,
    showCollection,
    getDatabase,
    addDoc,
} from 'db3.js'
import { PlusCircleOutlined } from '@ant-design/icons'
import { usePageContext } from '../../pages/Context'
import { useMatch } from 'react-router-dom'
import { useAsyncFn } from 'react-use'
import Documents from './Documents'
import Indexes from './Indexes'

const { Paragraph } = Typography

const DatabaseAccount: React.FC<{}> = memo((props) => {
    const { client, networkId } = usePageContext()
    const routeParams = useMatch('/database/:addr/:name')?.params
    const [dbName, setDbName] = React.useState('')
    const [docValue, setDocValue] = React.useState({
        doc: '',
        col: '',
    })
    const [allCollectionNames, setAllCollectionNames] = React.useState<any[]>(
        []
    )
    const [collection, setCollection] = React.useState({})
    const [items, setItems] = React.useState<TabsProps['items']>([
        {
            key: 'Documents',
            label: 'Documents',
            children: <Documents docs={[]} />,
        },
        {
            key: 'Indexes',
            label: 'Indexes',
            children: <Indexes />,
        },
    ])
    const [insertDocState, insertDocHandle] = useAsyncFn(async () => {
        if (docValue.doc && docValue.col) {
            try {
                const col = await getCollection(
                    routeParams.addr,
                    docValue.col,
                    client
                )
                if (col) {
                    const object = JSON.parse(docValue.doc)
                    await addDoc(col, object)
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }, [docValue, client])
    const [queryCollectionState, queryCollection] = useAsyncFn(async () => {
        if (client && routeParams.addr && routeParams.name) {
            try {
                const database = await getDatabase(routeParams.addr, client)
                const collections = await showCollection(database)
                const col = collections.find(
                    (item) => item.name == routeParams.name
                )
                if (col && col.db.internal?.database?.docDb) {
                    const desc = col.db.internal?.database?.docDb?.desc
                    const parts = desc.split(':')
                    setDbName(parts[0])
                }
                const names = collections.map((item) => {
                    return {
                        label: item.name,
                        value: item.name,
                    }
                })
                setAllCollectionNames(names)
                setCollection(col)
                setDocValue({
                    doc: '',
                    col: col.name,
                })
                if (col) {
                    const docs = await queryDoc(col, '/* | limit 10')
                    if (docs?.docs) {
                        setItems([
                            {
                                key: 'Documents',
                                label: 'Documents',
                                children: <Documents docs={docs?.docs} />,
                            },
                            {
                                key: 'Indexes',
                                label: 'Indexes',
                                children: <Indexes />,
                            },
                        ])
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, [client, routeParams])
    useEffect(() => {
        queryCollection()
    }, [client, routeParams])
    const [docModalvisible, setDocModalvisible] = React.useState(false)
    const [indexModalvisible, setIndexModalvisible] = React.useState(false)
    const [activeKey, setActiveKey] = React.useState('Documents')
    const tableData = [
        {
            name: 'accounts1',
            type: 'key1',
            attribute: 'name',
        },
        {
            name: 'accounts1',
            type: 'key2',
            attribute: 'name',
        },
    ]
    return (
        <div className="database-account">
            <div className="table-header-title">
                {dbName}/{routeParams.name}
                <Paragraph copyable>{collection?.db?.addr}</Paragraph>
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
                confirmLoading={insertDocState.loading}
                okText="Insert"
                onOk={() => {
                    insertDocHandle()
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="Collection">
                        <Select
                            options={allCollectionNames}
                            value={{
                                value: collection.name,
                                label: collection.name,
                            }}
                            onChange={(value) => {
                                setDocValue({
                                    ...docValue,
                                    col: value,
                                })
                            }}
                        />
                    </Form.Item>
                    <Form.Item label="Doc">
                        <Input.TextArea
                            onChange={(e) => {
                                setDocValue({
                                    ...docValue,
                                    doc: e.target.value,
                                })
                            }}
                        />
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
