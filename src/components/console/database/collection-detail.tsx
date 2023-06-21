import { CopyOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Modal, Tabs, Input } from 'antd'
import React, { useEffect } from 'react'
import { DocumentView } from '../../views/document-view'
import { IndexesView } from '../../views/indexes-view'

import {
    createClient,
    showDatabase,
    createDocumentDatabase,
    createFromPrivateKey,
    syncAccountNonce,
    showCollection,
    addDoc,
    queryDoc,
} from 'db3.js'

import { useLocation } from 'react-router-dom'

function isJsonString(str) {
    try {
        var json = JSON.parse(str)
        return typeof json === 'object'
    } catch (e) {
        return false
    }
}

export const CollectionDetail = () => {
    const location = useLocation()

    // if (!location.state) {
    const { db, collection } = location.state
    // }

    let description: string[] = db.internal?.database?.docDb?.desc
        ?.toString()
        .split('#-#')

    const [db_0, setDb_0] = React.useState<any>({
        id: db.addr,
        name: description[0],
        addr: db.addr,
    })

    const [showInsertDocModal, setShowInsertDocModal] =
        React.useState<boolean>(false)
    const [doc, setDoc] = React.useState<any>({})
    const onInsertDoc = async () => {
        console.log(doc)

        if (isJsonString(doc)) {
            var json = JSON.parse(doc)
            let r = await addDoc(collection, json)
            console.log(r)

            setShowInsertDocModal(false)
        } else {
            alert('Invalid JSON')
        }
    }

    const [collection_0, setCollection_0] = React.useState<any>({
        id: `${db.addr}/${collection.name}`,
        name: collection.name,
        documents: [
            {
                content: 'document content...',
            },
            {
                content: 'document content2...',
            },
        ],
    })

    return (
        <div>
            <span>
                <h3
                    style={{
                        display: 'inline-block',
                        padding: '0 16px',
                        marginBottom: 0,
                    }}
                >
                    {db_0.name}.{collection_0.name}
                </h3>
                <span>
                    addr: {db_0.add}/{collection_0.name}
                </span>
                <CopyOutlined />
            </span>
            <Button
                style={{ marginBottom: 8, marginLeft: 180 }}
                size="small"
                onClick={() => setShowInsertDocModal(true)}
            >
                <PlusOutlined /> Insert Document
            </Button>
            <Modal
                title="Insert Doc"
                open={showInsertDocModal}
                onCancel={() => setShowInsertDocModal(false)}
                onOk={() => {
                    onInsertDoc()
                }}
                okText="Insert"
            >
                <span>{`target :  ${collection_0.id}`}</span>
                <Input.TextArea
                    value={doc}
                    onChange={(e) => {
                        setDoc(e.target.value)
                    }}
                />
            </Modal>
            <div style={{ padding: '0 16px' }}>
                <Tabs
                    items={[
                        {
                            key: 'documents',
                            label: 'Documents',
                            children: <DocumentView collection={collection} />,
                        },
                        {
                            key: 'indexes',
                            label: 'Indexes',
                            children: <IndexesView />,
                        },
                    ]}
                />
            </div>
        </div>
    )
}
