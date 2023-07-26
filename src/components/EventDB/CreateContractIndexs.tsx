import {
    Breadcrumb,
    Button,
    Form,
    FormInstance,
    Input,
    Space,
    Steps,
    List,
    Alert,
} from 'antd'
import { useAsyncFn } from 'react-use'
import React, { memo, useEffect, useState } from 'react'
import activeSrc from '../../assets/event-active.svg'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { createPublicClient, webSocket, stringify } from 'viem'
import { localhost } from 'viem/chains'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../../pages/Context'
import { createEventDatabase } from 'db3.js'

const step1Form = atom({
    key: 'step1Form',
    default: {
        name: '',
        address: '',
        nodeUrl: '',
        abi: '',
    },
})

const contractEvents = atom({
    key: 'contractEvents',
    default: [],
})

const testOutput = atom({
    key: 'testOutput',
    default: {
        success: false,
        hasError: false,
        output: '',
    },
})

const ContractInfo: React.FC<{ form: FormInstance }> = memo((props) => {
    const [step1FormValue, setStep1Form] = useRecoilState(step1Form)
    return (
        <div className="contract-info">
            <Form layout="vertical">
                <Form.Item label="Name" name="name">
                    <Input
                        value={step1FormValue.name}
                        onChange={(e) =>
                            setStep1Form({
                                ...step1FormValue,
                                name: e.target.value,
                            })
                        }
                    />
                </Form.Item>

                <Form.Item label="Contract Address" name="address">
                    <Input
                        value={step1FormValue.address}
                        onChange={(e) =>
                            setStep1Form({
                                ...step1FormValue,
                                address: e.target.value,
                            })
                        }
                    />
                </Form.Item>

                <Form.Item label="Evm Node Websocket Url" name="evm_node_rpc">
                    <Input
                        value={step1FormValue.nodeUrl}
                        onChange={(e) =>
                            setStep1Form({
                                ...step1FormValue,
                                nodeUrl: e.target.value,
                            })
                        }
                    />
                </Form.Item>

                <Form.Item label="ABI" name="abi">
                    <Input.TextArea
                        value={step1FormValue.abi}
                        onChange={(e) =>
                            setStep1Form({
                                ...step1FormValue,
                                abi: e.target.value,
                            })
                        }
                    />
                </Form.Item>
            </Form>
        </div>
    )
})

const ChooseEvents: React.FC<{}> = memo((props) => {
    const testOutputValue = useRecoilValue(testOutput)
    const step1FormValue = useRecoilValue(step1Form)
    const [contractEventsValue, setContractEvents] =
        useRecoilState(contractEvents)
    const toggleSeleted = (name) => {
        const newContractEvents = contractEventsValue.map((item) => {
            if (item.name === name) {
                const selected = !item.selected
                return {
                    ...item,
                    selected,
                }
            }
            return item
        })
        setContractEvents(newContractEvents)
    }
    useEffect(() => {
        if (step1FormValue?.abi) {
            const abi = JSON.parse(step1FormValue.abi)
            const events = abi['abi']
                .filter((item) => item['type'] === 'event')
                .map((item) => {
                    return {
                        ...item,
                        selected: false,
                    }
                })
            setContractEvents(events)
        }
    }, [step1FormValue])
    return (
        <div className="choose-events">
            <Form layout="vertical">
                <Form.Item label="Select Event To Index" name="address">
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 4,
                            lg: 4,
                            xl: 6,
                            xxl: 3,
                        }}
                        dataSource={contractEventsValue}
                        renderItem={(item) => (
                            <List.Item>
                                {item.selected ? (
                                    <div
                                        name={`${item.name}`}
                                        className="event-checkbox event-active"
                                        onClick={(e) => {
                                            toggleSeleted(
                                                e.target.getAttribute('name')
                                            )
                                        }}
                                    >
                                        <img src={activeSrc} alt="" />
                                        {item.name}
                                    </div>
                                ) : (
                                    <div
                                        name={`${item.name}`}
                                        className="event-checkbox"
                                        onClick={(e) => {
                                            toggleSeleted(
                                                e.target.getAttribute('name')
                                            )
                                        }}
                                    >
                                        <img src={activeSrc} alt="" />
                                        {item.name}
                                    </div>
                                )}
                            </List.Item>
                        )}
                    />
                </Form.Item>

                <Form.Item label="Test output" name="output">
                    {testOutputValue.hasError && (
                        <Alert
                            showIcon
                            message="fail to test the contract"
                            type="warning"
                        />
                    )}
                    {testOutputValue.success && (
                        <Alert
                            showIcon
                            message="test the contract successfully"
                            type="success"
                        />
                    )}
                </Form.Item>
            </Form>
        </div>
    )
})

const CreateContractIndexs: React.FC<{}> = memo((props) => {
    const navigate = useNavigate()
    const step1FormValue = useRecoilValue(step1Form)
    const contractEventsValue = useRecoilValue(contractEvents)
    const [testOutputValue, setTestoutput] = useRecoilState(testOutput)
    const [current, setCurrent] = useState(0)
    const { client } = usePageContext()
    const next = () => {
        setCurrent(current + 1)
    }
    const prev = () => {
        setCurrent(current - 1)
    }

    const [testEventConfigState, testEventConfigHandle] =
        useAsyncFn(async () => {
            try {
                const transport = webSocket(step1FormValue.nodeUrl)
                const client = createPublicClient({
                    chain: localhost,
                    transport,
                })
                const blockNumber = await client.getBlockNumber()
                const firtEvent = contractEventsValue[0]
                const logs = await client.getLogs({
                    address: step1FormValue.address,
                    event: firtEvent,
                    fromBlock: blockNumber - 20n,
                    toBlock: blockNumber,
                })
                setTestoutput({
                    success: true,
                    hasError: false,
                    output: stringify(logs),
                })
            } catch (e) {
                console.log(e)
                setTestoutput({
                    success: false,
                    hasError: true,
                    output: e.message,
                })
            }
        }, [step1FormValue, contractEventsValue])

    const [createIndexState, createIndexHandle] = useAsyncFn(async () => {
        if (step1FormValue.address && testOutputValue.success) {
            try {
                const events = contractEventsValue
                    .filter((item) => item.selected)
                    .map((item) => item.name)
                if (events.length == 0) {
                    console.log('please select events')
                    return
                }
                const abi = JSON.parse(step1FormValue.abi)
                const { result } = await createEventDatabase(
                    client,
                    step1FormValue.name,
                    step1FormValue.address,
                    events,
                    stringify(abi.abi),
                    step1FormValue.nodeUrl,
                    '0'
                )
                //TODO
                //notify ok
            } catch (e) {
                console.log(e)
            }
        }
    }, [step1FormValue, contractEventsValue, testOutputValue, client])
    const items = [
        {
            key: '1',
            title: 'Fill up the contract information',
        },
        {
            key: '2',
            title: 'Choose the events',
        },
    ]

    return (
        <div className="create-contract-indexes">
            <Breadcrumb>
                <Breadcrumb.Item>EventDB</Breadcrumb.Item>
                <Breadcrumb.Item>Create Contract Indexes</Breadcrumb.Item>
            </Breadcrumb>
            <div className="create-title">Create Contract Indexes</div>
            <div className="create-step">
                <Steps current={current} items={items} />
                <div className="step-content">
                    {current === 0 ? <ContractInfo /> : <ChooseEvents />}
                    <div className="step-btn-toolbar">
                        <Space>
                            {current === 0 ? (
                                <>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={next}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        type="default"
                                        size="large"
                                        onClick={() => navigate('/home')}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={testEventConfigHandle}
                                        loading={testEventConfigState.loading}
                                    >
                                        Test
                                    </Button>

                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={createIndexState.loading}
                                        onClick={() => createIndexHandle()}
                                    >
                                        Create
                                    </Button>

                                    <Button
                                        type="default"
                                        size="large"
                                        onClick={prev}
                                    >
                                        Last
                                    </Button>
                                </>
                            )}
                        </Space>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default CreateContractIndexs
