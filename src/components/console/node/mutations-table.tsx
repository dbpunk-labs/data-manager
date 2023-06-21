import { Table } from 'antd'
import React, { useEffect } from 'react'
import { Client } from '../../../data-context/client'
import { createClient, createFromPrivateKey, scanMutationHeaders } from 'db3.js'
const private_key =
    '0xdc6f560254643be3b4e90a6ba85138017aadd78639fbbb43c57669067c3bbe76'

const account = createFromPrivateKey(private_key)

const client = createClient(
    'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26619',
    'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26639',
    account
)

export const MutationsTable = () => {
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
        {
            number: 110,
            id: 'wwwdj',
            age: '1min2s',
            address: 'addrxxx',
            sender: 'xx',
            state: 'On chain',
            block: '122',
        },
    ])

    useEffect(() => {
        console.log('xxx')

        const fetchData = async () => {
            // await Client.init()
            console.log('client init')

            const records = await scanMutationHeaders(client, 1, 1000)

            console.log(records)
        }
        fetchData()

        // Client.init().then(() => {
        //     console.log('client init')

        //     scanMutationHeaders(Client.instance!, 1, 1000)
        //         .then((records) => {
        //             console.log(records)
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //         })
        // })
    }, [])

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
        </div>
    )
}
