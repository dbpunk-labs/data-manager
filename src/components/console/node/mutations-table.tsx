import { Pagination, Table, Typography } from 'antd'
import React, { useEffect } from 'react'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'
import { scanMutationHeaders, getMutationBody } from 'db3.js'

interface MutationHeader {
    id: string
    block: string
    order: number
    time: string
    sender: string
    size: number
    key: string
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
    const { client } = usePageContext()
    const [mutations, setMutations] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [fetchDataRet, fetchDataFn] = useAsyncFn(async () => {
        if (client) {
            try {
                setIsLoading(true)
                const records = await scanMutationHeaders(client, 0, 10)
                const mutations = records.map((item) => {
                    return {
                        key: item.id,
                        id: item.id,
                        block: item.blockId,
                        order: item.orderId,
                        sender: toHEX(item.sender),
                        time: item.time,
                        size: item.size,
                    } as MutationHeader
                })
                setIsLoading(false)
                setMutations(mutations)
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('no client')
        }
    }, [client])

    useEffect(() => {
        fetchDataFn()
    }, [client])

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
