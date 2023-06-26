import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    Skeleton,
    Space,
    Steps,
    Tree,
} from 'antd'
import {
    createDocumentDatabase,
    createEventDatabase,
    showDatabase,
} from 'db3.js'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { PlusOutlined } from '@ant-design/icons'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useMatch } from 'react-router-dom'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'

interface DataNode {
    title: string
    id: string
    key: string
    isLeaf?: boolean
    db?: any
    collection?: any
    children?: DataNode[]
}

export const EventDbTable = (props) => {
    const { client } = usePageContext()
    const [showCreateIndexModal, setShowCreateIndexModal] =
        React.useState<boolean>(false)
    const dbId = useMatch('console/event-db/:id')
    const [currentDb, setCurrentDb] = React.useState<any>(null)
    const [currentCollection, setCurrentCollection] = React.useState<any>(null)
    const navigate = useNavigate()
    const navigateToCollection = (dbItem, collectionItem) => {
        setCurrentDb(dbItem)
        setCurrentCollection(collectionItem)
        navigate(`/console/event-db/events/${dbItem.id}/${collectionItem.id}`)
    }
    const [dbName, setDbName] = React.useState<string>('')
    const [dbDesc, setDbDesc] = React.useState<string>('')
    const navigateToDb = (dbItem: DataNode) => {
        setCurrentDb(dbItem)
        setCurrentCollection(null)
        navigate(`/console/event-db/events/${dbItem.id}`)
    }
    const [dbData, setDbData] = React.useState<any[]>([])
    const updateTreeData = (
        list: DataNode[],
        id: React.Key,
        children: DataNode[]
    ): DataNode[] =>
        list.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    children,
                }
            }
            return node
        })
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [loadDataRet, loadData] = useAsyncFn(async () => {
        setIsLoading(true)
        const data = await showDatabase(client.account.address, client)
        let items: any = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].internal?.database?.oneofKind === 'eventDb') {
                let desc = data[i].internal?.database?.eventDb?.desc
                    ?.toString()
                    .split('#-#')[0]
                let db_item = {
                    id: data[i].addr,
                    title: desc,
                    isLeaf: false,
                    key: data[i].addr,
                    db: data[i],
                }
                items.push(db_item)
            }
        }
        setIsLoading(false)
        setDbData(items)
        if (items.length > 0) {
            navigateToDb(items[0])
        }
    }, [client])
    useEffect(() => {
        loadData()
    }, [client])

    const [createDBForm] = Form.useForm()
    const [isCreating, setIsCreating] = React.useState<boolean>(false)
    const [currentStep, setCurrentStep] = React.useState<number>(0)

    const abi = `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]`
    const evmNodeUrl =
        'wss://polygon-mainnet.g.alchemy.com/v2/EH9ZSJ0gS7a1DEIohAWMbhP33lK6qHj9'

    const [eventAbi, setEventAbi] = React.useState<string>(abi)
    const [eventEvmNodeUrl, setEventEvmNodeUrl] =
        React.useState<string>(evmNodeUrl)
    const [contractIndexName, setContractIndexName] = React.useState<string>('')
    const [contractAddress, setContractAddress] = React.useState<string>(
        '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    )

    function get_event_types_from_abi(abi: string): string[] {
        let abi_ob = JSON.parse(abi)

        const event_types: string[] = []

        for (const item of abi_ob) {
            if (item.type === 'event') {
                event_types.push(item.name)
            }
        }
        return event_types
    }

    const [eventTypes, setEventTypes] = React.useState<string[]>()

    const onSelectEvents = (checkedValues: CheckboxValueType[]) => {
        setEventTypes(checkedValues as string[])
    }

    const [createDBRet, createDBFn] = useAsyncFn(async () => {
        setIsCreating(true)
        // const values = createDBForm.getFieldsValue()
        if (eventTypes === undefined || eventTypes.length === 0) {
            alert('Please select at least one event type')
            return
        }
        if (!contractIndexName || contractIndexName === '') {
            alert('Please enter a database name')
        } else {
            let the_desc = `${contractIndexName}#-#${dbDesc}`
            const { db, result } = await createEventDatabase(
                client,
                the_desc,
                contractAddress,
                eventTypes,
                eventAbi,
                eventEvmNodeUrl
            )
            setIsCreating(false)
            setShowCreateIndexModal(false)
            loadData()
        }
    }, [client, dbName, dbDesc, eventTypes])

    const [onSelectRet, onSelectFn] = useAsyncFn(
        async (e) => {
            const key = e[0]
            const dbItem = dbData.find((item) => item.key === key)
            if (dbItem) {
                navigateToDb(dbItem)
            } else {
                dbData.map((dbItem) => {
                    const collection = dbItem?.children?.find(
                        (item) => item.key === key
                    )
                    if (collection) navigateToCollection(dbItem, collection)
                })
            }
        },
        [client, dbData]
    )
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 200,
                    padding: '20px 12px',
                    minHeight: '100%',
                    borderRight: '1px solid rgba(5, 5, 5, 0.06)',
                }}
            >
                <div>
                    <Button
                        style={{
                            backgroundColor: '#1677ff',
                            color: '#fff',
                            marginBottom: 8,
                        }}
                        size="small"
                        onClick={() => {
                            setShowCreateIndexModal(true)
                        }}
                    >
                        <PlusOutlined /> Create Contract Indexing
                    </Button>
                    <Input.Search style={{ marginBottom: 8 }} size="small" />
                    <Modal
                        title="Create Contract Indexer"
                        open={showCreateIndexModal}
                        cancelText={currentStep === 0 ? 'Cancel' : 'Back'}
                        okText={currentStep === 0 ? 'Next' : 'Create'}
                        onOk={() => {
                            if (currentStep === 0) {
                                setCurrentStep(1)
                            } else {
                                createDBFn()
                            }
                        }}
                        onCancel={() => {
                            if (currentStep === 1) {
                                setCurrentStep(0)
                            } else {
                                setShowCreateIndexModal(false)
                            }
                        }}
                    >
                        <Steps
                            style={{ borderBottom: 1 }}
                            items={[
                                {
                                    title: 'Step1: Fill up Contracts info',
                                },
                                {
                                    title: 'Step2: choose events',
                                },
                            ]}
                            current={currentStep}
                        />
                        {currentStep === 0 && (
                            <Form form={createDBForm}>
                                <Form.Item
                                    required={true}
                                    label="Name"
                                    key="name"
                                >
                                    <Input
                                        value={contractIndexName}
                                        onChange={(e) => {
                                            setContractIndexName(e.target.value)
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    required={true}
                                    label="Contract address"
                                    key="address"
                                >
                                    <Input
                                        value={contractAddress}
                                        onChange={(e) => {
                                            setContractAddress(e.target.value)
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    required={true}
                                    label="ABI"
                                    key="abi"
                                >
                                    <Input.TextArea
                                        value={eventAbi}
                                        onChange={(e) => {
                                            setEventAbi(e.target.value)
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    required={true}
                                    label="Chain Provider"
                                    key="provider"
                                >
                                    <Input
                                        value={eventEvmNodeUrl}
                                        onChange={(e) => {
                                            setEventEvmNodeUrl(e.target.value)
                                        }}
                                    />
                                </Form.Item>
                            </Form>
                        )}
                        {currentStep === 1 && (
                            <div>
                                <p>
                                    <b>Select Event To Index</b>
                                </p>
                                <Checkbox.Group onChange={onSelectEvents}>
                                    <Space direction="vertical">
                                        {get_event_types_from_abi(abi).map(
                                            (item) => (
                                                <Checkbox
                                                    value={item}
                                                    key={item}
                                                >
                                                    {item}
                                                </Checkbox>
                                            )
                                        )}
                                    </Space>
                                </Checkbox.Group>
                            </div>
                        )}
                    </Modal>
                </div>

                <div>
                    <Skeleton loading={isLoading}>
                        <Tree
                            showLine={false}
                            showIcon={false}
                            defaultExpandedKeys={['0-0-0']}
                            onSelect={onSelectFn}
                            treeData={dbData}
                        />
                    </Skeleton>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 200px)',
                }}
            >
                <Outlet
                    context={{ db: currentDb, collection: currentCollection }}
                />
            </div>
        </div>
    )
}
