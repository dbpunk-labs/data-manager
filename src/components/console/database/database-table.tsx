import { Button, Form, Input, Modal, Skeleton, Tree } from 'antd'
import { createDocumentDatabase, showDatabase } from 'db3.js'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { PlusOutlined } from '@ant-design/icons'

import { Client } from '../../../data-context/client'

interface DataNode {
    title: string
    id: string
    key: string
    isLeaf?: boolean
    db?: any
    collection?: any
    children?: DataNode[]
}

export const DatabaseTable = (props) => {
    const { client } = usePageContext()
    const [showCreateDatabaseModal, setShowCreateDatabaseModal] =
        React.useState<boolean>(false)
    const [currentDb, setCurrentDb] = React.useState<any>(null)
    const [currentCollection, setCurrentCollection] = React.useState<any>(null)
    const navigate = useNavigate()
    const navigateToCollection = (dbItem, collectionItem) => {
        setCurrentDb(dbItem)
        setCurrentCollection(collectionItem)
        navigate(`/console/database/db/${dbItem.id}/${collectionItem.id}`)
    }

    const [dbName, setDbName] = React.useState<string>('')
    const [dbDesc, setDbDesc] = React.useState<string>('')

    const navigateToDb = (dbItem: DataNode) => {
        setCurrentDb(dbItem)
        setCurrentCollection(null)
        navigate(`/console/database/db/${dbItem.id}`)
    }

    const [dbData, setDbData] = React.useState<any[]>([])
    const updateTreeData = (
        list: DataNode[],
        id: React.Key,
        children: DataNode[]
    ): DataNode[] =>
        list.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    children,
                }
            }

            return node
        })

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const [loadDataRet, loadDataFn] = useAsyncFn(async () => {
        setIsLoading(true)
        const data = await showDatabase(client.account.address, client)
        let items: any = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].internal?.database?.oneofKind === 'docDb') {
                let desc = data[i].internal?.database?.docDb?.desc
                    ?.toString()
                    .split('#-#')[0]
                let db_item = {
                    id: data[i].addr,
                    title: desc,
                    isLeaf: false,
                    key: data[i].addr,
                    db: data[i],
                }
                items.push(db_item)
            }
        }
        setIsLoading(false)
        setDbData(items)
        if (items.length > 0) {
            navigateToDb(items[0])
        }
    }, [client])

    const [createDBForm] = Form.useForm()
    const [isCreating, setIsCreating] = React.useState<boolean>(false)
    const [createDBRet, createDBFn] = useAsyncFn(async () => {
        if (client) {
            setIsCreating(true)
            if (!dbName || dbName === '') {
                alert('Please enter a database name')
                setIsCreating(false)
            } else {
                let the_desc = `${dbName}#-#${dbDesc}`
                const { db, result } = await createDocumentDatabase(
                    client,
                    the_desc
                )
                setIsCreating(false)
                setShowCreateDatabaseModal(false)
                loadDataFn()
            }
        } else {
            console.log('please login')
        }
    }, [client, dbName, dbDesc])

    const [onSelectRet, onSelectFn] = useAsyncFn(
        async (e) => {
            const key = e[0]
            const dbItem = dbData.find((item) => item.key === key)
            if (dbItem) {
                navigateToDb(dbItem)
            } else {
                dbData.map((dbItem) => {
                    const collection = dbItem?.children?.find(
                        (item) => item.key === key
                    )
                    if (collection) navigateToCollection(dbItem, collection)
                })
            }
        },
        [client, dbData]
    )

    useEffect(() => {
        loadDataFn()
    }, [client])
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 200,
                    padding: '20px 12px',
                    minHeight: '100%',
                    borderRight: '1px solid rgba(5, 5, 5, 0.06)',
                }}
            >
                <div>
                    <Button
                        style={{
                            backgroundColor: '#1677ff',
                            color: '#fff',
                            marginBottom: 8,
                        }}
                        size="small"
                        onClick={() => {
                            setShowCreateDatabaseModal(true)
                        }}
                    >
                        <PlusOutlined /> Create Database
                    </Button>
                    <Input.Search
                        style={{ marginBottom: 8 }}
                        size="small"
                        placeholder="Search"
                    />
                    <Modal
                        title="Create Database"
                        open={showCreateDatabaseModal}
                        onOk={() => {
                            createDBFn()
                        }}
                        confirmLoading={isCreating}
                        onCancel={() => setShowCreateDatabaseModal(false)}
                    >
                        <Form form={createDBForm} style={{ maxWidth: 600 }}>
                            <Form.Item required={true} label="Name" key="name">
                                <Input
                                    value={dbName}
                                    onChange={(e) => {
                                        setDbName(e.target.value)
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                required={false}
                                label="Description"
                                key="description"
                            >
                                <Input.TextArea
                                    value={dbDesc}
                                    onChange={(e) => {
                                        setDbDesc(e.target.value)
                                    }}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>

                <div>
                    <Skeleton loading={isLoading}>
                        <Tree
                            showLine={false}
                            showIcon={false}
                            defaultExpandedKeys={['0-0-0']}
                            onSelect={onSelectFn}
                            treeData={dbData}
                        />
                    </Skeleton>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 200px)',
                }}
            >
                <Outlet
                    context={{ db: currentDb, collection: currentCollection }}
                />
            </div>
        </div>
    )
}
