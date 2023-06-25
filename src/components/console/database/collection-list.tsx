import { Button, Form, Input, Modal, Skeleton, Space, Table } from 'antd'
import {
    createCollection,
    showCollection,
    showDatabase,
    getDatabase,
} from 'db3.js'
import React, { useEffect } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { CopyOutlined, PlusOutlined } from '@ant-design/icons'

import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'

export const CollectionList = () => {
    const { client } = usePageContext()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [database, setDataBase] = React.useState({})
    const [showCreateCollectionModal, setShowCreateCollectionModal] =
        React.useState<boolean>(false)
    const [createCollectionForm] = Form.useForm()

    const [colName, setColName] = React.useState<string>('')
    const [description, setDesc] = React.useState<string[]>([])

    const [createColRet, createColFn] = useAsyncFn(async () => {
        if (!colName || colName === '') {
            alert('Please input collection name')
        } else {
            // const index1: Index = {
            //     path: '/city', // a top level field name 'city' and the path will be '/city'
            //     indexType: Indextype.StringKey,
            // }
            const { collection, result } = await createCollection(
                database,
                colName,
                []
            )
            setShowCreateCollectionModal(false)
            fetchDataFn()
        }
    }, [client, database, colName])

    const [collections, setCollections] = React.useState<any[]>([])
    const dbId = useMatch('/console/database/db/:dbId')?.params.dbId
    const [fetchDataRet, fetchDataFn] = useAsyncFn(async () => {
        if (!dbId) return
        setLoading(true)
        const db = await getDatabase(dbId, client)
        setDataBase(db)
        let description: string[] = db?.internal?.database?.docDb?.desc
            ?.toString()
            .split('#-#')
        setDesc(description)
        const cols = await showCollection(db)
        let items: any = []
        for (let i = 0; i < cols.length; i++) {
            const collection = cols[i]
            let collectionItem = {
                key: collection.name,
                name: collection.name,
                documents: '-',
                size: '-',
                indexes: collection.indexFields?.length,
            }
            items.push(collectionItem)
        }
        setCollections(items)
        setLoading(false)
    }, [client, dbId])

    useEffect(() => {
        fetchDataFn()
    }, [dbId, client])

    return (
        <div style={{ padding: '12px 24px' }}>
            <Skeleton loading={loading}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h3 style={{ display: 'inline-block' }}>
                            {description?.[0]}
                        </h3>
                        <br />

                        <Space direction="vertical">
                            <div>
                                <span> addr: {database.addr}</span>
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(
                                                database.addr
                                            )
                                        }
                                    }}
                                >
                                    <CopyOutlined />
                                </a>
                            </div>
                            <div>
                                <span>
                                    {description?.length > 1
                                        ? description[1]
                                        : '-'}
                                </span>
                            </div>
                        </Space>
                    </div>
                    <div>
                        <Button
                            style={{
                                backgroundColor: '#1677ff',
                                color: '#fff',
                            }}
                            onClick={() => setShowCreateCollectionModal(true)}
                        >
                            <PlusOutlined /> Create Collection
                        </Button>
                        <Modal
                            title="Create Collection"
                            open={showCreateCollectionModal}
                            onCancel={() => setShowCreateCollectionModal(false)}
                            onOk={() => {
                                createColFn()
                            }}
                        >
                            <Form form={createCollectionForm}>
                                <Form.Item
                                    required={true}
                                    label="Database"
                                    key="database"
                                >
                                    <Input value={description?.[0]} disabled />
                                </Form.Item>
                                <Form.Item
                                    required={true}
                                    label="Collection Name"
                                    key="collectionName"
                                >
                                    <Input
                                        value={colName}
                                        onChange={(e) => {
                                            setColName(e.target.value)
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </div>
                <div>
                    <Table
                        dataSource={collections}
                        columns={[
                            {
                                dataIndex: 'name',
                                title: 'Collection Name',
                                render: (text: string, record) => (
                                    <Link
                                        to={`/console/database/db/${database.addr}/${record.name}`}
                                    >
                                        {text}
                                    </Link>
                                ),
                            },
                            { dataIndex: 'documents', title: 'Documents' },
                            { dataIndex: 'size', title: 'Total Size' },
                            { dataIndex: 'indexes', title: 'Indexes' },
                        ]}
                    />
                </div>
            </Skeleton>
        </div>
    )
}
