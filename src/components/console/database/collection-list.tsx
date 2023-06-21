import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Button, Modal, Input, Table, Space } from 'antd'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
    createFromPrivateKey,
    createClient,
    syncAccountNonce,
    createCollection,
    showCollection,
    Index,
} from 'db3.js'

import { useAccount } from 'wagmi'

type Database = {
    id: string
    name: string
    address: string
    db: any
    desc: string
}

export const CollectionList = () => {
    const location = useLocation()

    const { db } = location.state
    let description: string[] = db.internal?.database?.docDb?.desc
        ?.toString()
        .split('#')
    const [database, setDataBase] = React.useState<Database>({
        id: db.addr,
        name: description[0],
        address: db.addr,
        db: db,
        desc: description.length > 1 ? description[1] : '-',
    })

    const [showCreateCollectionModal, setShowCreateCollectionModal] =
        React.useState<boolean>(false)
    const [createCollectionForm] = Form.useForm()

    const onCreateCollection = async () => {
        // TODO
        if (db) {
            // const index1: Index = {
            //     path: '/city', // a top level field name 'city' and the path will be '/city'
            //     indexType: Indextype.StringKey,
            // }
            const { collection, result } = await createCollection(
                db,
                'test_collection_002',
                []
            )
        }
        const values = createCollectionForm.getFieldsValue()
    }

    const [collections, setCollections] = React.useState<any[]>([
        {
            name: 'test-collection',
            documents: 10,
            size: 100,
            indexes: 2,
        },
        {
            name: 'test-collectio-2',
            documents: 10,
            size: 100,
            indexes: 2,
        },
    ])
    const fetchData = async () => {
        const data = await showCollection(db)
        console.log(data)
        if (data) {
            let items: any = []
            for (let i = 0; i < data.length; i++) {
                const collection = data[i]
                let collectionItem = {
                    name: collection.name,
                    documents: '-',
                    size: '-',
                    indexes: collection.indexFields?.length,
                }

                items.push(collectionItem)
            }
            setCollections([...items])
        }
    }
    useEffect(() => {
        fetchData()
    }, [db])

    return (
        <div style={{ padding: '12px 24px' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h3 style={{ display: 'inline-block' }}>{database.name}</h3>
                    <Space direction="vertical">
                        <div>
                            <span> addr: {database.address}</span>
                            <CopyOutlined />
                        </div>
                        <div>
                            <span> desc: {database.desc}</span>
                        </div>
                    </Space>
                </div>
                <div>
                    <Button onClick={() => setShowCreateCollectionModal(true)}>
                        <PlusOutlined /> Create Collection
                    </Button>
                    <Modal
                        title="Create Collection"
                        open={showCreateCollectionModal}
                        onCancel={() => setShowCreateCollectionModal(false)}
                        onOk={() => {
                            onCreateCollection()
                            setShowCreateCollectionModal(false)
                        }}
                    >
                        <Form form={createCollectionForm}>
                            <Form.Item
                                required={true}
                                label="Database"
                                key="database"
                            >
                                <Input value={database.name} disabled />
                            </Form.Item>
                            <Form.Item
                                required={false}
                                label="Collection Name"
                                key="collectionName"
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
            <div>
                <Table
                    dataSource={collections}
                    columns={[
                        { dataIndex: 'name', title: 'Collection Name' },
                        { dataIndex: 'documents', title: 'Documents' },
                        { dataIndex: 'size', title: 'Total Size' },
                        { dataIndex: 'indexes', title: 'Indexes' },
                    ]}
                />
            </div>
        </div>
    )
}
