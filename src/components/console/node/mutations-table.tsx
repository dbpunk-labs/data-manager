import { Pagination, Table } from 'antd'
import React, { useEffect } from 'react'
import { Client } from '../../../data-context/client'
import {
    scanMutationHeaders,
    getMutationBody,
    Client as ClientInstance,
} from 'db3.js'
import { MutationHeader } from 'db3.js/dist/proto/db3_mutation_v2'

export const MutationsTable = () => {
    const [collections, setCollections] = React.useState<any[]>([])

    const [page, setPage] = React.useState<number>(1)

    const getMutationItem = async (
        client: ClientInstance,
        r: MutationHeader
    ) => {
        getMutationBody(client, r.id).then((body) => {
            let item = {
                id: r.id,
                age: r.time
                    ? new Date().getTime() / 1000 - parseInt(r.time)
                    : 0,
                sender: '',
                type: body[1]?.bodies[0]?.body?.oneofKind,
                state: 'off chain',
                arBlock: '-',
            }
            return item
        })
    }

    const fetchData = () => {
        if (Client.instance) {
            scanMutationHeaders(Client.instance, (page - 1) * 10, 10)
                .then((records) => {
                    let items: any[] = []
                    for (let i = 0; i < records.length; i++) {
                        let r = records[i]
                        let item = getMutationItem(Client.instance!, r)
                        items.push(item)
                    }

                    Promise.all(items).then((values) => {
                        setCollections(values)
                        console.log(values)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        Client.init().then(() => {
            fetchData()
        })
    }, [])
    const onChangePage = (page: number) => {
        setPage(page)
        fetchData()
    }

    return (
        <div style={{ padding: 20 }}>
            <Table
                dataSource={collections}
                columns={[
                    {
                        dataIndex: 'number',
                        title: 'No.',
                    },
                    {
                        dataIndex: 'id',
                        title: 'Id',
                    },
                    {
                        dataIndex: 'age',
                        title: 'Age',
                    },
                    {
                        dataIndex: 'address',
                        title: 'DB Address',
                    },
                    {
                        dataIndex: 'sender',
                        title: 'Sender',
                    },
                    {
                        dataIndex: 'state',
                        title: 'State',
                    },
                    {
                        dataIndex: 'block',
                        title: 'Ar Block',
                    },
                ]}
            />
            <Pagination
                style={{ paddingLeft: 800 }}
                current={page}
                onChange={onChangePage}
                total={100}
            />
        </div>
    )
}
