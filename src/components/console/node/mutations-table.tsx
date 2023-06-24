import { Pagination, Table, Typography } from 'antd'
import React, { useEffect } from 'react'
import { Client } from '../../../data-context/client'
import {
    scanMutationHeaders,
    getMutationBody,
    Client as ClientInstance,
} from 'db3.js'

interface MutationHeader {
    id: string
    block: string
    order: number
    time: string
    sender: string
    size: number
}
function toHEX(bytes: Uint8Array): string {
    return (
        '0x' +
        bytes.reduce(
            (str, byte) => str + byte.toString(16).padStart(2, '0'),
            ''
        )
    )
}
export const MutationsTable = () => {
    const [mutations, setMutations] = React.useState<any[]>([])

    const [page, setPage] = React.useState<number>(1)

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
            const mutations = records.map((item) => {
                return {
                    id: item.id,
                    block: item.blockId,
                    order: item.orderId,
                    sender: toHEX(item.sender),
                    time: item.time,
                    size: item.size,
                } as MutationHeader
            })
            setMutations(mutations)
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
                dataSource={mutations}
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
                        dataIndex: 'time',
                        title: 'Time',
                        width: 100,
                    },
                    {
                        dataIndex: 'block',
                        title: 'Block',
                        width: 100,
                    },
                    {
                        dataIndex: 'sender',
                        title: 'Sender',
                        width: 100,
                    },
                    {
                        dataIndex: 'order',
                        title: 'Order',
                        width: 100,
                    },
                    {
                        dataIndex: 'size',
                        title: 'Size',
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
