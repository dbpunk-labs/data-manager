import { Table } from 'antd'
import React from 'react'

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
