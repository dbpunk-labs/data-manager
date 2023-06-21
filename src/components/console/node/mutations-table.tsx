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
        const body = await getMutationBody(client, r.id)

        let item = {
            id: r.id,
            age: r.time ? new Date().getTime() / 1000 - parseInt(r.time) : 0,
            sender: '',
            type: body[1]?.bodies[0]?.body?.oneofKind,
            state: 'off chain',
            arBlock: '-',
        }
        return item
    }

    const fetchData = async () => {
        if (Client.instance) {
            const records = await scanMutationHeaders(
                Client.instance,
                (page - 1) * 10,
                10
            )
            let items: any[] = []
            for (let i = 0; i < records.length; i++) {
                let r = records[i]
                let item = getMutationItem(Client.instance!, r)
                items.push(item)
            }

            const values = await Promise.all(items)
            setCollections(values)
            console.log(values)
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
                        dataIndex: 'id',
                        title: 'Id',
                    },
                    {
                        dataIndex: 'age',
                        title: 'Age',
                    },
                    {
                        dataIndex: 'type',
                        title: 'Type',
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
                        dataIndex: 'arBlock',
                        title: 'Ar Block',
                    },
                ]}
            />
            {/* <Pagination
                style={{ paddingLeft: 800 }}
                current={page}
                onChange={onChangePage}
                total={100}
            /> */}
        </div>
    )
}
