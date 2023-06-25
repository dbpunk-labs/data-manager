import { Pagination, Table, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import { getContractSyncStatus } from 'db3.js'
import { usePageContext } from '../../../data-context/page-context'

interface ContractJobStatus {
    addr: string
    evmNodeUrl: string
    blockNumber: string
    eventNumber: string
}

export const EventsTable = () => {
    const { client } = usePageContext()
    const [jobStatus, setJobStatus] = React.useState<ContractJobStatus[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [loadJobStatusRet, loadJobStatusFn] = useAsyncFn(async (client) => {
        const statusList = await getContractSyncStatus(client)
        setJobStatus(statusList as ContractJobStatus[])
    })
    const [fetchDataRet, fetchDataFn] = useAsyncFn(async () => {
        setIsLoading(true)
        loadJobStatusFn(client)
        setIsLoading(false)
    }, [client])
    useEffect(() => {
        fetchDataFn()
    }, [client])
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
