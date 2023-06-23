import { Pagination, Table, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { Client } from '../../../data-context/client'
import { getContractSyncStatus, Client as ClientInstance } from 'db3.js'

interface ContractJobStatus {
    addr: string
    evmNodeUrl: string
    blockNumber: string
    eventNumber: string
}

export const EventsTable = () => {
    const [jobStatus, setJobStatus] = React.useState<ContractJobStatus[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [loadJobStatusRet, loadJobStatusFn] = useAsyncFn(async (client) => {
        const statusList = await getContractSyncStatus(client)
        setJobStatus(statusList as ContractJobStatus[])
    })

    const fetchData = async () => {
        setIsLoading(true)
        await Client.init()
        if (Client.instance) {
            loadJobStatusFn(Client.instance)
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
                dataSource={jobStatus}
                columns={[
                    {
                        dataIndex: 'addr',
                        title: 'addr',
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
                        dataIndex: 'evmNodeUrl',
                        title: 'evmNodeUrl',
                        width: 100,
                    },
                    {
                        dataIndex: 'blockNumber',
                        title: 'blockNumber',
                        width: 100,
                    },
                    {
                        dataIndex: 'eventNumber',
                        title: 'eventNumber',
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
