import React, { memo, useEffect } from 'react'

import { useAsyncFn } from 'react-use'
import { Button, Input, Space, Tabs, TabsProps, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import sortSrc from '../../assets/sort.svg'
import { usePageContext } from '../../pages/Context'
import { useMatch, Link } from 'react-router-dom'
import {
    getCollection,
    queryDoc,
    showCollectionFromIndex,
    getDatabase,
} from 'db3.js'

const { Paragraph } = Typography

const EventList: React.FC<{}> = memo((props) => {
    const { client } = usePageContext()
    const routeParams = useMatch('/eventdb/:addr')?.params
    const [database, setDatabase] = React.useState({
        name: '',
        addr: '',
        contractAddr: '',
    })
    const [collections, setCollections] = React.useState<any[]>([])
    const [queryCollectionsState, queryCollections] = useAsyncFn(
        async (query: string) => {
            if (client && routeParams.addr) {
                try {
                    const db = await getDatabase(routeParams.addr, client)
                    setCollections(
                        (await showCollectionFromIndex(db)).map((item) => {
                            return {
                                key: item.name,
                                name: item.name,
                                documents: item.state.totalDocCount,
                                size: 0,
                                index: item.internal?.indexFields.length,
                            }
                        })
                    )
                    if (db.internal?.database?.oneofKind == 'eventDb') {
                        const desc = db.internal?.database?.eventDb?.desc
                        const parts = desc.split(':')
                        setDatabase({
                            name: parts[0],
                            addr: db.addr,
                            contractAddr:
                                db.internal?.database?.eventDb?.contractAddress,
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        [client, routeParams]
    )
    useEffect(() => {
        queryCollections()
    }, [client, routeParams])

    return (
        <div className="event-list">
            <div className="database-table-header">
                <div className="table-header-left">
                    <div className="table-header-title">
                        {database.name}
                        <Paragraph copyable>{database.addr}</Paragraph>
                    </div>
                </div>
            </div>
            <Table
                dataSource={collections}
                columns={[
                    {
                        dataIndex: 'name',
                        title: 'Event Name',
                        render: (text: string, record) => (
                            <Link
                                to={`/eventdb/${routeParams.addr}/${record.name}`}
                            >
                                {text}
                            </Link>
                        ),
                        sorter: true,
                        sortIcon: () => <img src={sortSrc} />,
                    },
                    {
                        dataIndex: 'documents',
                        title: 'Documents',
                        sorter: true,
                        sortIcon: () => <img src={sortSrc} />,
                    },
                    {
                        dataIndex: 'size',
                        title: 'Total Size',
                        sorter: true,
                        sortIcon: () => <img src={sortSrc} />,
                    },
                    {
                        dataIndex: 'index',
                        title: 'Indexes',
                        sorter: true,
                        sortIcon: () => <img src={sortSrc} />,
                    },
                ]}
            />
        </div>
    )
})
export default EventList
