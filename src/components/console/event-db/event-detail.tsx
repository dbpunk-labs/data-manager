import { Skeleton, Tabs } from 'antd'
import { getCollectione } from 'db3.js'
import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import { CopyOutlined } from '@ant-design/icons'

import { Client } from '../../../data-context/client'
import { DocumentView } from '../../views/document-view'
import { IndexesView } from '../../views/indexes-view'

export const EventDetail = () => {
    const [db, setDataBase] = React.useState()
    const [collection, setCollection] = React.useState<any[]>([])

    const [loading, setLoading] = useState<boolean>(false)

    const routeParams = useMatch(
        '/console/event-db/events/:dbId/:colName'
    )?.params
    const dbId = routeParams?.dbId
    const colName = routeParams?.colName
    const fetchData = async () => {
        if (!dbId) return
        setLoading(true)
        await Client.init()
        const collection = await getCollection(dbId, colName, Client.instance)
        // const collections = data.map((item: any, i: number) => ({
        //     name: item.name,
        //     documents: '-',
        //     size: '-',
        //     indexes: item.indexFields?.length,
        // }))
        setCollection(collection)
        setDataBase(collection.db)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [dbId])

    useEffect(() => {
        fetchData()
    }, [])

    const dbName = db?.internal?.database?.eventDb?.desc
        ?.toString()
        .split('#-#')[0]

    return (
        <div>
            <Skeleton loading={loading}>
                <span>
                    <h3
                        style={{
                            display: 'inline-block',
                            padding: '0 16px',
                            marginBottom: 0,
                        }}
                    >
                        {dbName}.{collection?.name}
                    </h3>
                    <span>
                        addr: {db?.addr}/{collection?.name}
                    </span>
                    <CopyOutlined />
                </span>
                <div style={{ padding: '0 16px' }}>
                    <Tabs
                        defaultActiveKey={'documents'}
                        items={[
                            {
                                key: 'documents',
                                label: 'Documents',
                                children: (
                                    <DocumentView collection={collection} />
                                ),
                            },
                            {
                                key: 'indexes',
                                label: 'Indexes',
                                children: <IndexesView />,
                            },
                        ]}
                    />
                </div>
            </Skeleton>
        </div>
    )
}
