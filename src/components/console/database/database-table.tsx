import { Button, Form, Input, Modal, Skeleton, Tree } from 'antd'
import { createDocumentDatabase, showDatabase } from 'db3.js'
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
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)

        await Client.init()
        const data = await showDatabase(
            Client.account!.address,
            Client.instance!
        )

        if (!data) return

        console.log('databases:', data)

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
                    key: i,
                    db: data[i],
                }
                items.push(db_item)
            }
        }
        setIsLoading(false)
        // await Promise.all(
        //     items.map(async (dbItem, idx) => {
        //         const collections = await showCollection(dbItem.db)

        //         console.log(collections)
        //         let childrens: DataNode[] = []

        //         collections.map((item, idx) => {
        //             let collection_item = {
        //                 id: item.name,
        //                 title: item.name,
        //                 key: `${dbItem.key}-${idx}`,
        //                 collection: item,
        //                 isLeaf: true,
        //             }

        //             childrens.push(collection_item)
        //         })

        //         items = updateTreeData(items, dbItem.id, childrens)
        //     })
        // )
        setDbData([...items])
        // if (!currentDb && currentCollection)
        if (items.length > 0) {
            navigateToDb(items[0])
        }
    }

    const [createDBForm] = Form.useForm()
    const [isCreating, setIsCreating] = React.useState<boolean>(false)

    const onCreateDatabase = async () => {
        setIsCreating(true)
        // const values = createDBForm.getFieldsValue()
        if (!dbName || dbName === '') {
            alert('Please enter a database name')
        } else {
            let the_desc = `${dbName}#-#${dbDesc}`
            const { db, result } = await createDocumentDatabase(
                Client.instance!,
                the_desc
            )
            const databases = await showDatabase(
                Client.account!.address,
                Client.instance!
            )
            setDbData(databases)
            setIsCreating(false)
            setShowCreateDatabaseModal(false)
        }
    }

    const onSelect = (e) => {
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
    }

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
                    <Input.Search style={{ marginBottom: 8 }} size="small" />
                    <Modal
                        title="Create Database"
                        open={showCreateDatabaseModal}
                        onOk={() => {
                            onCreateDatabase()
                        }}
                        confirmLoading={isCreating}
                        onCancel={() => setShowCreateDatabaseModal(false)}
                    >
                        <Form form={createDBForm}>
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
                            onSelect={onSelect}
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
