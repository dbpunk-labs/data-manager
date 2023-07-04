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
    const [block, setBlock] = React.useState<string>('0')
    const [eventAbi, setEventAbi] = React.useState<string>('')
    const [eventEvmNodeUrl, setEventEvmNodeUrl] =
        React.useState<string>("")
    const [contractIndexName, setContractIndexName] = React.useState<string>('')
    const [contractAddress, setContractAddress] = React.useState<string>('')

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

    // const [allEvents, setAllEvents] = React.useState<string[]>([])

    // const parseEventTypes = () => {
    //     console.log(eventAbi)
    //     let all_events = get_event_types_from_abi(abi)
    //     setAllEvents(all_events)
    // }

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
                eventEvmNodeUrl,
                block
            )
            setIsCreating(false)
            setShowCreateIndexModal(false)
            loadData()
        }
    }, [client, dbName, dbDesc, eventTypes, block])

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
                                    label="Start Block"
                                    key="block"
                                >
                                    <Input
                                        value={block}
                                        onChange={(e) => {
                                            setBlock(e.target.value)
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
                                        {get_event_types_from_abi(eventAbi).map(
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
