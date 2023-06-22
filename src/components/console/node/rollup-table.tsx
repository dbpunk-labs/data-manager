import { Table } from 'antd'
import { scanRollupRecords } from 'db3.js'
import React, { useEffect } from 'react'
import { Client } from '../../../data-context/client'

export const RollupTable = () => {
    const [collections, setCollections] = React.useState<any[]>([
        {
            number: 100,
            id: 'dsshi',
            age: '1min',
            address: 'addrxxx',
            sender: 'xx',
            state: 'Off chain',
            block: '-',
        },
    ])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        Client.init().then(() => {
            console.log('client init')

            scanRollupRecords(Client.instance!, 1, 30)
                .then((records) => {
                    console.log(records)
                    setIsLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <Table
                size="small"
                loading={isLoading}
                dataSource={collections}
                columns={[
                    {
                        dataIndex: 'number',
                        title: 'Batch No.',
                    },
                    {
                        dataIndex: 'age',
                        title: 'Age',
                    },
                    {
                        dataIndex: 'originSize',
                        title: 'Origin Size',
                    },
                    {
                        dataIndex: 'batchSize',
                        title: 'Batch Size',
                    },
                    {
                        dataIndex: 'mutations',
                        title: 'Mutations',
                    },

                    {
                        dataIndex: 'block',
                        title: 'Ar Block',
                    },
                    {
                        dataIndex: 'fees',
                        title: 'Fees',
                    },
                    {
                        dataIndex: 'artx',
                        title: 'Ar tx',
                    },
                    {
                        dataIndex: 'evmtx',
                        title: 'Evm tx',
                    },
                ]}
            />
        </div>
    )
}
