import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Button, Modal, Input, Table, Space } from 'antd'
import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'

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
        .split('#-#')
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
                db,
                colName,
                []
            )
            setShowCreateCollectionModal(false)
            fetchData()
        }
    }

    const [collections, setCollections] = React.useState<any[]>([])
    const fetchData = async () => {
        const data = await showCollection(db)
        console.log('==>>>', data)
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
                            render: (text: string) => (
                                <a>
                                    <Link
                                        to={`/console/database/list/${database.id}/collection/1`}
                                    >
                                        {text}
                                    </Link>{' '}
                                </a>
                            ),
                        },
                        { dataIndex: 'documents', title: 'Documents' },
                        { dataIndex: 'size', title: 'Total Size' },
                        { dataIndex: 'indexes', title: 'Indexes' },
                    ]}
                />
            </div>
        </div>
    )
}
