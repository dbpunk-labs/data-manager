import { Button, Form, Input, Modal, Skeleton, Space, Table } from 'antd'
import { showCollection, getDatabase } from 'db3.js'
import React, { useEffect } from 'react'
import { Link, useMatch } from 'react-router-dom'

import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'

export const EventDbList = () => {
    const { client } = usePageContext()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [database, setDataBase] = React.useState({})
    const [showCreateCollectionModal, setShowCreateCollectionModal] =
        React.useState<boolean>(false)
    const [createCollectionForm] = Form.useForm()
    const [colName, setColName] = React.useState<string>('')
    const [collections, setCollections] = React.useState<any[]>([])
    const dbId = useMatch('/console/event-db/events/:dbId')?.params.dbId
    const [description, setDesc] = React.useState<string[]>([])
    const [fetchDataRet, fetchDataFn] = useAsyncFn(async () => {
        if (client) {
            try {
                if (!dbId) return
                setLoading(true)
                const db = await getDatabase(dbId, client)
                setDataBase(db)
                let description: string[] =
                    db?.internal?.database?.eventDb?.desc
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
            } catch (e) {
                console.log(e)
            }
        }
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
                                <span> addr: {database?.addr}</span>
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
                            <div></div>
                        </Space>
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
                                        to={`/console/event-db/events/${database.addr}/${record.name}`}
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
