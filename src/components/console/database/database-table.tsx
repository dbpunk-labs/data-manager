import { PlusOutlined } from '@ant-design/icons'
import { Form, Button, Input, Modal, Tree } from 'antd'
import React, { useEffect } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router'
import {
    createClient,
    showDatabase,
    createDocumentDatabase,
    createFromPrivateKey,
    syncAccountNonce,
    showCollection,
} from 'db3.js'
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
    const dbId = useMatch('console/database/:id')

    const navigate = useNavigate()
    const navigateToCollection = (dbItem, collectionItem) => {
        navigate(
            `/console/database/list/${dbItem.id}/collection/${collectionItem.id}`,
            {
                state: { db: dbItem.db, collection: collectionItem },
            }
        )
    }

    const [dbName, setDbName] = React.useState<string>('')
    const [dbDesc, setDbDesc] = React.useState<string>('')

    const navigateToDb = (dbItem: DataNode) => {
        console.log(dbItem)

        navigate(`/console/database/list/${dbItem.id}`, {
            state: { db: dbItem.db, collectionList: dbItem.children },
        })
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

    const onLoadData = ({ key, id, db }: any) =>
        new Promise<void>(async (resolve) => {
            const collections = await showCollection(db)

            console.log(collections)
            let childrens: DataNode[] = []

            collections.map((item, idx) => {
                let collection_item = {
                    id: item.name,
                    title: item.name,

                    key: `${key}-${idx}`,
                    collection: item,
                    isLeaf: true,
                }

                childrens.push(collection_item)
            })

            setTimeout(() => {
                setDbData((origin) => updateTreeData(origin, id, childrens))
                resolve()
            }, 100)
        })

    useEffect(() => {
        console.log('xxx')

        Client.init().then(() => {
            showDatabase(Client.account!.address, Client.instance!).then(
                (data) => {
                    console.log('data=>', data)
                    if (data) {
                        let items: any = []
                        for (let i = 0; i < data.length; i++) {
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
                        setDbData([...items])
                    }
                }
            )
        })
    }, [])

    useEffect(() => {
        console.log('yyy')

        if (dbData && dbData.length > 0) {
            navigateToDb(dbData[0])
        }
    }, [dbData])

    const [createDBForm] = Form.useForm()

    const onCreateDatabase = async () => {
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

            console.log(databases)
            setDbData(databases)

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
                const collection = dbItem.children.find(
                    (item) => item.key === key
                )
                if (collection)
                    navigateToCollection(dbItem, collection.collection)
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
                        style={{ marginBottom: 8 }}
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
                    <Tree
                        showLine={false}
                        showIcon={false}
                        defaultExpandedKeys={['0-0-0']}
                        onSelect={onSelect}
                        treeData={dbData}
                        loadData={onLoadData}
                    />
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 200px)',
                }}
            >
                <Outlet />
            </div>
        </div>
    )
}
