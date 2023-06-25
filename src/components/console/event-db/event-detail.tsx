import { Skeleton, Tabs } from 'antd'
import { getCollection } from 'db3.js'
import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import { CopyOutlined } from '@ant-design/icons'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'

import { DocumentView } from '../../views/document-view'
import { IndexesView } from '../../views/indexes-view'

export const EventDetail = () => {
    const { client } = usePageContext()
    const [db, setDataBase] = React.useState()
    const [collection, setCollection] = React.useState({})
    const [loading, setLoading] = useState<boolean>(false)
    const routeParams = useMatch(
        '/console/event-db/events/:dbId/:colName'
    )?.params
    const dbId = routeParams?.dbId
    const colName = routeParams?.colName
    const [dbName, setDbName] = React.useState('')
    const [fetchDataRet, fetchData] = useAsyncFn(async () => {
        if (client) {
            try {
                setLoading(true)
                const data = await getCollection(dbId, colName, client)
                const dbName =
                    data.db?.internal?.database?.eventDb?.desc?.split('#-#')[0]
                setDataBase(data.db)
                setDbName(dbName)
                setCollection(data)
                setLoading(false)
            } catch (e) {
                console.log(e)
            }
        }
    }, [client, dbId, colName])

    useEffect(() => {
        fetchData()
    }, [dbId, client])

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
                        {db?.addr}/{collection?.name}
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
