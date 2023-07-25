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
    Checkbox,
} from 'antd'
import {
    getCollection,
    queryDoc,
    showCollection,
    getDatabase,
    addDoc,
    addIndex,
    Index,
    IndexType,
} from 'db3.js'
import { PlusCircleOutlined } from '@ant-design/icons'
import { usePageContext } from '../../pages/Context'
import { useMatch } from 'react-router-dom'
import { useAsyncFn } from 'react-use'
import Documents from './Documents'
import Indexes from './Indexes'

const { Paragraph } = Typography

interface IndexRecord {
    key: string
    path: string
    type: string
}

const DatabaseAccount: React.FC<{}> = memo((props) => {
    const typeMapping = {
        string: IndexType.StringKey,
        integer: IndexType.Int64Key,
        float: IndexType.DoubleKey,
    }
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
            children: <Indexes collection={{}} />,
        },
    ])

    const [indexRecords, setIndexRecords] = React.useState<IndexRecord[]>([])
    const [indexModalvisible, setIndexModalvisible] = React.useState(false)
    const [addIndexState, addIndexHandle] = useAsyncFn(async () => {
        if (indexRecords.length > 0 && docValue.col) {
            try {
                const col = await getCollection(
                    routeParams.addr,
                    docValue.col,
                    client
                )
                const indexes = indexRecords.map((item) => {
                    return {
                        path: item.path,
                        indexType: typeMapping[item.type],
                    } as Index
                })
                await addIndex(col, indexes)
                setIndexModalvisible(false)
            } catch (e) {
                console.log(e.message)
            }
        }
    }, [indexRecords, docValue, client])
    const [docModalvisible, setDocModalvisible] = React.useState(false)
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
                    setDocModalvisible(false)
                }
            } catch (e) {
                console.log(e.message)
            }
        }
    }, [docValue, client])
    const [queryCollectionState, queryCollection] = useAsyncFn(
        async (query: string) => {
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
                        const docs = await queryDoc<any>(col, query)
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
                                    children: <Indexes collection={col} />,
                                },
                            ])
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        [client, routeParams]
    )
    useEffect(() => {
        queryCollection('/* | limit 10')
    }, [client, routeParams])
    const [activeKey, setActiveKey] = React.useState('Documents')

    const addNewIndexRecords = () => {
        const key = indexRecords.length + 1
        setIndexRecords(
            indexRecords.concat([
                {
                    key: key.toString(),
                    type: '',
                    path: '',
                } as IndexRecord,
            ])
        )
    }

    const updateIndexRecords = (record: IndexRecord) => {
        const newIndexRecords = indexRecords.map((item) => {
            if (item.key == record.key) {
                return record
            } else {
                return item
            }
        })
        setIndexRecords(newIndexRecords)
    }

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
                confirmLoading={addIndexState.loading}
                okText="Create"
                onOk={() => addIndexHandle()}
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
                    <Form.Item label="Indexes">
                        <Table
                            dataSource={indexRecords}
                            pagination={false}
                            className="index-table"
                        >
                            <Table.Column
                                width={180}
                                title="Type"
                                dataIndex="type"
                                render={(text, record, index) => (
                                    <Select
                                        defaultValue={text}
                                        onSelect={(value) => {
                                            const newRecord = {
                                                ...record,
                                                type: value,
                                            }
                                            updateIndexRecords(newRecord)
                                        }}
                                    >
                                        <Select.Option value="string">
                                            String
                                        </Select.Option>
                                        <Select.Option value="integer">
                                            Integer
                                        </Select.Option>
                                        <Select.Option value="float">
                                            Float
                                        </Select.Option>
                                    </Select>
                                )}
                            />

                            <Table.Column
                                width={180}
                                title="Path"
                                dataIndex="path"
                                render={(text, record, index) => (
                                    <Input
                                        defaultValue={text}
                                        onChange={(e) => {
                                            const newRecord = {
                                                ...record,
                                                path: e.target.value,
                                            }
                                            updateIndexRecords(newRecord)
                                        }}
                                    />
                                )}
                            />
                        </Table>
                        <Button
                            className="add-index"
                            icon={<PlusCircleOutlined />}
                            size="large"
                            onClick={() => addNewIndexRecords()}
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
