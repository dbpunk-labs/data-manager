import { Button, Form, Input, Modal, Skeleton, Space, Table } from 'antd';
import { createCollection, showCollection, showDatabase } from 'db3.js';
import React, { useEffect } from 'react';
import { Link, useMatch } from 'react-router-dom';

import { CopyOutlined, PlusOutlined } from '@ant-design/icons';

import { Client } from '../../../data-context/client';

export const CollectionList = () => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const getDBInstance = async (addr: string) => {
        await Client.init()
        const dbs = await showDatabase(
            Client.account!.address,
            Client.instance!
        )
        return dbs.find((db) => db.addr === addr)
    }

    const [database, setDataBase] = React.useState({})

    const [showCreateCollectionModal, setShowCreateCollectionModal] =
        React.useState<boolean>(false)
    const [createCollectionForm] = Form.useForm()

    const [colName, setColName] = React.useState<string>('')

    const onCreateCollection = async () => {
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
            fetchData()
        }
    }

    const [collections, setCollections] = React.useState<any[]>([])

    const dbId = useMatch('/console/database/db/:dbId')?.params.dbId
    const fetchData = async () => {
        if (!dbId) return
        setLoading(true)
        const db = await getDBInstance(dbId)
        if (!db) return
        setDataBase(db)

        const data = await showCollection(db)
        console.log('==>>>', data)
        if (data) {
            let items: any = []
            for (let i = 0; i < data.length; i++) {
                const collection = data[i]
                let collectionItem = {
                    id: collection.id,
                    name: collection.name,
                    documents: '-',
                    size: '-',
                    indexes: collection.indexFields?.length,
                }

                items.push(collectionItem)
            }
            setCollections([...items])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [dbId])

    useEffect(() => {
        fetchData()
    }, [])

    let description: string[] = database?.internal?.database?.docDb?.desc
        ?.toString()
        .split('#-#')

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
                        <Space direction="vertical">
                            <div>
                                <span> addr: {database?.addr}</span>
                                <CopyOutlined />
                            </div>
                            <div>
                                <span>
                                    desc:
                                    {description?.length > 1
                                        ? description[1]
                                        : '-'}
                                </span>
                            </div>
                        </Space>
                    </div>
                    <div>
                        <Button
                            onClick={() => setShowCreateCollectionModal(true)}
                        >
                            <PlusOutlined /> Create Collection
                        </Button>
                        <Modal
                            title="Create Collection"
                            open={showCreateCollectionModal}
                            onCancel={() => setShowCreateCollectionModal(false)}
                            onOk={() => {
                                onCreateCollection()
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
                                    <a>
                                        <Link
                                            to={`/console/database/db/${database.addr}/${record.name}`}
                                        >
                                            {text}
                                        </Link>
                                    </a>
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
