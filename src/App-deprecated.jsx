import './App.css'
import { Button, Form, Input, Space, Image, Select } from 'antd'

import {
    DB3Client,
    MetamaskWallet,
    collection,
    DB3Store,
    getDocs,
} from 'db3.js'
import { useEffect, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { Buffer } from 'buffer'
import DatabaseCard from './databaseCard'

globalThis.Buffer = Buffer
const wallet = new MetamaskWallet(window)
const defaultEndpoint = 'https://grpc.devnet.db3.network'

function App() {
    const [databaseAddr, setDatabaseAddr] = useState('')
    const [db3AccountAddr, setDb3AccountAddr] = useState('')
    const [evmAccountAddr, setEvmAccountAddr] = useState('')
    const [resultDoc, setResultDoc] = useState([])
    const [messages, setMessages] = useState('')
    const [height, setHeight] = useState('')
    const [client, setClient] = useState()

    const [databases, setDatabases] = useState([])

    const [endpoint, setEndpoint] = useState()
    useEffect(() => setEndpoint(defaultEndpoint), [])

    useEffect(() => {
        setClient(new DB3Client(endpoint, wallet))

        console.log(client)
    }, [endpoint, wallet])

    // Step1: connect Metamask wallet and get evm address
    const [res, connectWallet] = useAsyncFn(async () => {
        try {
            await wallet.connect()
            const addr = wallet.getAddress()
            setDb3AccountAddr(addr)
            const evmAddr = wallet.getEvmAddress()
            setEvmAccountAddr(evmAddr)
        } catch (e) {
            console.log(e)
        }
    }, [wallet])

    // Step2: Get or Create database

    useEffect(() => {
        if (client && db3AccountAddr) getDatabasesByAddr(db3AccountAddr)
    }, [db3AccountAddr, databaseAddr])

    const [, getDatabasesByAddr] = useAsyncFn(
        async (value) => {
            try {
                console.log('===>' + value)
                const dbs = await client.listDatabases(value)
                setDatabases(dbs)
            } catch (e) {
                console.log(e)
                alert(e.message)
            }
        },
        [client]
    )

    const [response, createDatabase] = useAsyncFn(
        async (values) => {
            try {
                const [dbid, txid] = await client.createDatabase(
                    values.description
                )

                await new Promise((r) => setTimeout(r, 1500))
                setDatabaseAddr(dbid)
            } catch (e) {
                console.log(e)
                alert(e.message)
            }
        },
        [client, db3AccountAddr]
    )

    // Step3: Create Collection under a database

    const onFinish = (values) => {
        console.log('Received values of form:', values)
    }

    const [res2, createCollectionHandle] = useAsyncFn(
        async (databaseAddr, colName, colIndexList) => {
            try {
                const db = new DB3Store(databaseAddr, client)
                // if the collection do not exist, the sdk will create it
                const collectionRef = await collection(
                    db,
                    colName,
                    colIndexList
                )
            } catch (e) {
                console.log(e)
                alert(e.message)
            }
        },
        [client]
    )

    function createCollection(values) {
        try {
            const idx = JSON.parse(values.colIndexList)
            createCollectionHandle(values.databaseAddr, values.colName, idx)
        } catch (e) {
            console.log(e)
            alert(e.message)
        }
    }
    const index_example = `[
    {
        "name": "timeIndex",
        "id": 1,
        "fields": [
            {
                "fieldPath": "time",
                "valueMode": {
                    "oneofKind": "order",
                    "order": 1
                }
            }
        ]
    }
]`

    const [res3, queryDocHandle] = useAsyncFn(
        async (databaseAddr, colName) => {
            try {
                console.log(colName)
                const db = new DB3Store(databaseAddr, client)

                const collectionRef = await collection(db, colName)

                const result = await getDocs(collectionRef)

                setResultDoc(result.docs)
            } catch (e) {
                console.log(e)
                alert(e.message)
            }
        },
        [client]
    )

    const [ctrl, subscribe] = useAsyncFn(async () => {
        try {
            return await client.subscribe(subscription_handle)
        } catch (e) {
            console.log(e)
            alert(e.message)
        }
    }, [client])

    const subscription_handle = (msg) => {
        if (msg.event.oneofKind === 'blockEvent') {
            setHeight(msg.event.blockEvent.height)
        } else {
            try {
                if (
                    msg.event.mutationEvent.to.length == 0 &&
                    msg.event.mutationEvent.collections.length == 0
                ) {
                    const new_messages = [
                        {
                            mtype: 'Create Database Done',
                            msg:
                                'create database at height ' +
                                msg.event.mutationEvent.height,
                            key: msg.event.mutationEvent.hash,
                        },
                    ]

                    setMessages(new_messages.concat(messages.slice(0, 10)))
                } else {
                    const new_messages = [
                        {
                            mtype: 'Apply Mutation to collection',
                            msg:
                                'apply crud opertaions to collections ' +
                                msg.event.mutationEvent.collections.join() +
                                ' at height ' +
                                msg.event.mutationEvent.height,
                            key: msg.event.mutationEvent.hash,
                        },
                    ]
                    setMessages(new_messages.concat(messages.slice(0, 10)))
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    function queryDoc(values) {
        queryDocHandle(values.databaseAddr, values.colName)
    }

    function changeEndpoint(value) {
        setEndpoint(value)
    }

    return (
        <div className="App">
            <h1>
                Data Manager base on{' '}
                <a href="https://db3.network"> DB3 Network</a>
            </h1>

            <Space direction="vertical">
                <Image
                    width={250}
                    style={{ padding: 'left' }}
                    src="../Logo_standard.png"
                ></Image>

                <Space>
                    <p>Choice Endpoint</p>
                    <Select
                        defaultValue={defaultEndpoint}
                        style={{ width: 320 }}
                        onChange={changeEndpoint}
                        options={[
                            {
                                value: 'https://grpc.devnet.db3.network',
                                label: 'https://grpc.devnet.db3.network',
                            },
                            {
                                value: 'http://127.0.0.1:26659',
                                label: 'http://127.0.0.1:26659',
                            },

                            {
                                value: 'http://18.162.230.6:26659',
                                label: 'http://18.162.230.6:26659',
                            },
                            {
                                value: 'http://16.163.108.68:26659',
                                label: 'http://16.163.108.68:26659',
                            },
                        ]}
                    />
                </Space>

                <Space direction="vertical">
                    <b>Block Height </b>
                    <h2>{height}</h2>
                </Space>

                <div>
                    <h2> Step1: Connect wallet</h2>
                    <p>DB3 account addr: {db3AccountAddr}</p>
                    <p>EVM account addr: {evmAccountAddr}</p>
                    <Button type="primary" onClick={connectWallet}>
                        Connect Wallet
                    </Button>
                </div>

                <span>Messages: {messages}</span>
                <Button type="primary" onClick={subscribe}>
                    Subscribe
                </Button>

                <div>
                    <h2> Step2: Get or Create a Database</h2>

                    <b>Database List</b>
                    <div>
                        <Input.Search
                            placeholder="creater db3 address"
                            allowClear
                            enterButton="Search"
                            onSearch={getDatabasesByAddr}
                            style={{ width: '50%' }}
                        />

                        <div style={{ paddingTop: '2em' }}>
                            {databases.map((item, i) => (
                                <Space style={{ paddingRight: '2em' }}>
                                    <DatabaseCard item={item} />
                                </Space>
                            ))}
                        </div>
                    </div>
                    <div style={{ paddingTop: '2em' }}>
                        <b>Create Database</b>

                        <Form
                            name="basic"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={createDatabase}
                            autoComplete="off"
                            style={{ width: 600 }}
                        >
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input database description!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={response.loading}
                            >
                                Create Database
                            </Button>
                        </Form>
                    </div>
                </div>
                <div>
                    <h2> Step3: Create collections under a database</h2>
                    <Form
                        name="basic"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 12 }}
                        onFinish={createCollection}
                        autoComplete="off"
                        style={{ width: 1000 }}
                    >
                        <Form.Item
                            label="Target Database"
                            name="databaseAddr"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input your Database address!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Collection Name"
                            name="colName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input your collection name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Indexes"
                            name="colIndexList"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your description!',
                                },
                            ]}
                        >
                            <Space align="start" size={20}>
                                <div>
                                    <Input.TextArea
                                        style={{ width: '100%' }}
                                        rows={15}
                                        placeholder="define index"
                                    />
                                </div>
                                <div>
                                    <b>Example index</b>
                                    <pre
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            border: '1px solid #ccc',
                                            borderRadius: 4,
                                            padding: 4,
                                            fontSize: 12,
                                            lineHeight: 'initial',
                                        }}
                                    >
                                        {index_example}{' '}
                                    </pre>
                                </div>
                            </Space>
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={res2.loading}
                        >
                            Create Collection
                        </Button>
                    </Form>
                </div>

                <div>
                    <h2> Step4: Preview a collection</h2>
                    <Space align="start">
                        <Form
                            name="basic"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={queryDoc}
                            autoComplete="off"
                            style={{ width: 600 }}
                        >
                            <Form.Item
                                label="Database Address"
                                name="databaseAddr"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your Database address!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Collection Name"
                                name="colName"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Please input your collection name!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Query doc
                            </Button>
                        </Form>
                        <div>
                            <h4 style={{ margin: 0 }}>View docs</h4>
                            <div>
                                {resultDoc.map((item, i) => (
                                    <Space>
                                        <span>
                                            {' '}
                                            {JSON.stringify(
                                                item.entry.doc
                                            )}{' '}
                                        </span>
                                        <span> {item.entry.owner}</span>
                                    </Space>
                                ))}
                            </div>
                        </div>
                    </Space>
                </div>
            </Space>
        </div>
    )
}

// export default App
