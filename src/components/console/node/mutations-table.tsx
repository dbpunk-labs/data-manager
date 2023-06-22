import { Pagination, Table, Typography } from 'antd'
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

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const fetchData = async () => {
        setIsLoading(true)

        await Client.init()
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

        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const onChangePage = (page: number) => {
        setPage(page)
        fetchData()
    }

    return (
        <div style={{ padding: 20 }}>
            <Table
                loading={isLoading}
                size="small"
                dataSource={collections}
                columns={[
                    {
                        dataIndex: 'id',
                        title: 'Id',
                        width: 200,
                        render: (text: string) => {
                            return (
                                <Typography.Paragraph
                                    ellipsis={{
                                        rows: 1,
                                        expandable: true,
                                        symbol: 'more',
                                    }}
                                    style={{ maxWidth: 200 }}
                                >
                                    {text}
                                </Typography.Paragraph>
                            )
                        },
                    },
                    {
                        dataIndex: 'age',
                        title: 'Age',
                        width: 100,
                    },
                    {
                        dataIndex: 'type',
                        title: 'Type',
                        width: 100,
                    },
                    {
                        dataIndex: 'sender',
                        title: 'Sender',
                        width: 100,
                    },
                    {
                        dataIndex: 'state',
                        title: 'State',
                        width: 100,
                    },
                    {
                        dataIndex: 'arBlock',
                        title: 'Ar Block',
                        width: 100,
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
