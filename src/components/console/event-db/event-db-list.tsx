import { Button, Form, Input, Modal, Table } from 'antd';
import { createEventDatabase } from 'db3.js';
// import { getContractSyncStatus } from 'db3.js';
import React from 'react';
import { Link } from 'react-router-dom';

import { CopyOutlined, PlusOutlined } from '@ant-design/icons';

import { Client } from '../../../data-context/client';

type Database = {
    id: string
    name: string
    address: string
}
export const EventDbList = () => {
    const [database, setDataBase] = React.useState<Database>({
        id: 'db-id-1',
        name: 'db-name',
        address: '0x123abadfa12345231',
    })

    const [showCreateCollectionModal, setShowCreateContractModal] =
        React.useState<boolean>(false)
    const [createCollectionForm] = Form.useForm()
    const abi = `
        [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
        `
    const evmNodeUrl =
        'wss://polygon-mainnet.g.alchemy.com/v2/EH9ZSJ0gS7a1DEIohAWMbhP33lK6qHj9'

    const onCreateCollection = async () => {
        // TODO
        // const values = createCollectionForm.getFieldsValue()
        await Client.init()

        const response = await createEventDatabase(
            Client.instance!,
            'desc',
            '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
            ['Transfer', 'Deposit', 'Approval', 'Withdrawal'],
            abi,
            evmNodeUrl
        )
        console.log(response)
        await new Promise((r) => setTimeout(r, 10000))
        // console.log(await getContractSyncStatus(Client.instance!))

        // setShowCreateContractModal(false)
    }

    const [collections, setCollections] = React.useState<any[]>([
        {
            name: 'test-collection',
            documents: 10,
            size: 100,
            indexes: 2,
        },
        {
            name: 'test-collectio-2',
            documents: 10,
            size: 100,
            indexes: 2,
        },
    ])

    return (
        <div style={{ padding: '12px 24px' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h3 style={{ display: 'inline-block' }}>{database.name}</h3>
                    <span>addr： {database.address}</span>
                    <CopyOutlined />
                </div>
                <div>
                    <Button onClick={() => setShowCreateContractModal(true)}>
                        <PlusOutlined /> Create Event Collection
                    </Button>
                    <Modal
                        title="Create Target Event Collection"
                        open={showCreateCollectionModal}
                        onCancel={() => setShowCreateContractModal(false)}
                        onOk={() => {
                            onCreateCollection()
                        }}
                    >
                        <Form form={createCollectionForm}>
                            <Form.Item required={true} label="Name" key="name">
                                <Input />
                            </Form.Item>
                            <Form.Item
                                required={true}
                                label="Event Id"
                                key="id"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                required={true}
                                label="Start block"
                                key="block"
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
            <div>
                <Table
                    dataSource={collections}
                    columns={[
                        {
                            dataIndex: 'name',
                            title: 'Indexer Name',
                            render: (value, record, index) => {
                                return (
                                    <Link
                                        to={`/console/event-db/events/${database.id}/${record.id}`}
                                    >
                                        {record.name}
                                    </Link>
                                )
                            },
                        },
                        { dataIndex: 'documents', title: 'Documents' },
                        { dataIndex: 'size', title: 'Total Size' },
                        { dataIndex: 'indexes', title: 'Indexes' },
                    ]}
                />
            </div>
        </div>
    )
}
