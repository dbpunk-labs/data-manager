import { Skeleton, Tabs } from 'antd'
import { showCollection, showDatabase } from 'db3.js'
import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import { CopyOutlined } from '@ant-design/icons'

import { Client } from '../../../data-context/client'
import { DocumentView } from '../../views/document-view'
import { IndexesView } from '../../views/indexes-view'

export const EventDetail = () => {
    const [db, setDataBase] = React.useState()
    const [collections, setCollections] = React.useState<any[]>([])

    const getDBInstance = async (addr: string) => {
        await Client.init()
        const dbs = await showDatabase(
            Client.account!.address,
            Client.instance!
        )
        return dbs.find((db) => db.addr === addr)
    }
    const [loading, setLoading] = useState<boolean>(false)

    const routeParams = useMatch(
        '/console/event-db/events/:dbId/:colName'
    )?.params
    const dbId = routeParams?.dbId
    const colName = routeParams?.colName
    const fetchData = async () => {
        if (!dbId) return
        setLoading(true)
        const db = await getDBInstance(dbId)
        if (!db) return
        setDataBase(db)

        const data = await showCollection(db)
        console.log('== fetch data>>>', db, data)

        // const collections = data.map((item: any, i: number) => ({
        //     name: item.name,
        //     documents: '-',
        //     size: '-',
        //     indexes: item.indexFields?.length,
        // }))

        setCollections(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [dbId])

    useEffect(() => {
        fetchData()
    }, [])

    const collection = collections.find((c) => c.name === colName)

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
