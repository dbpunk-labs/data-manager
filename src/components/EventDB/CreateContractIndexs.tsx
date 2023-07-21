import {
    Breadcrumb,
    Button,
    Form,
    FormInstance,
    Input,
    Space,
    Steps,
} from 'antd'
import React, { memo, useState } from 'react'
import activeSrc from '../../assets/event-active.svg'

const ContractInfo: React.FC<{ form: FormInstance }> = memo((props) => {
    return (
        <div className="contract-info">
            <Form layout="vertical">
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Contract Address" name="address">
                    <Input />
                </Form.Item>
                <Form.Item label="Provider " name="Provider">
                    <Input />
                </Form.Item>
                <Form.Item label="evm_node_rpc" name="evm_node_rpc">
                    <Input />
                </Form.Item>
                <Form.Item label="ABI" name="abi">
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </div>
    )
})

const ChooseEvents: React.FC<{}> = memo((props) => {
    return (
        <div className="choose-events">
            <Form layout="vertical">
                <Form.Item label="Contracts Info" name="name">
                    <div className="db3-box"></div>
                </Form.Item>
                <Form.Item label="Select Event To Index" name="address">
                    <Space>
                        <div className="event-checkbox">
                            <img src={activeSrc} alt="" />
                            Event_name 01
                        </div>
                        <div className="event-checkbox event-active">
                            <img src={activeSrc} alt="" />
                            Event_name 01
                        </div>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    )
})

const CreateContractIndexs: React.FC<{}> = memo((props) => {
    const [current, setCurrent] = useState(0)

    const next = () => {
        setCurrent(current + 1)
    }

    const prev = () => {
        setCurrent(current - 1)
    }
    const [form] = Form.useForm()
    const items = [
        {
            key: '1',
            title: 'Fill up Contracts Info',
        },
        {
            key: '2',
            title: 'Choose Events',
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
                    {current === 0 ? (
                        <ContractInfo form={form} />
                    ) : (
                        <ChooseEvents />
                    )}
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
                                    <Button type="default" size="large">
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={next}
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
