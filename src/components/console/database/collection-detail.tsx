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
import { Client } from '../../../data-context/client'

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

    const [collection_0, setCollection_0] = React.useState<any>({
        id: `${db.addr}/${collection.name}`,
        name: collection.name,
        documents: [],
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
