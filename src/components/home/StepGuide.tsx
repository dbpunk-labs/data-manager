import React, { memo } from 'react'
import { Button, Input, Modal, Radio, Space, Steps, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import RequestTestTokenModal, {
    requestTestTokenVisibleState,
} from './RequestTestTokenModal'
import '../../styles/StepGuide.scss'
import arbitrumSrc from '../../assets/arbitrum.png'
import polygonSrc from '../../assets/polygon.png'

const { Paragraph } = Typography

const availableChainState = atom({
    key: 'availableChainState',
    default: 1,
})

const Signin: React.FC<{}> = memo((props) => {
    const [availableChain, setAvailableChain] =
        useRecoilState(availableChainState)
    const [modal, contextHolder] = Modal.useModal()
    const confirm = () => {
        modal.confirm({
            wrapClassName: 'db3-modal-confirm',
            // className: 'db3-modal-confirm',
            title: 'Connect Wallet First',
            icon: <ExclamationCircleOutlined />,
            content: (
                <Paragraph>
                    <ul className="confirm-paragraph">
                        <li>For signature purpose only</li>
                        <li>No gas fee at all</li>
                        <li>Metamask supported</li>
                        <li>Network: Polygon mumbai</li>
                    </ul>
                </Paragraph>
            ),
            okText: 'Connect',
            cancelText: 'Cancel',
        })
    }
    return (
        <div className="signin">
            <div className="step-content-item-desc">
                Connect wallet and sign in as the admin address of this node.
            </div>
            <Space>
                <div className="step-item-title require-label">
                    Available Chain
                </div>
                <div className="step-item-subtitle">
                    More available chain is on the way
                </div>
            </Space>
            <div style={{ margin: '8px 0 22px 0' }}>
                <Radio.Group
                    value={availableChain}
                    onChange={(e) => setAvailableChain(e.target.value)}
                >
                    <Radio value={1}>
                        <Space>
                            <img style={{ width: 16 }} src={arbitrumSrc} />
                            Arbitrum Nova
                        </Space>
                    </Radio>
                    <Radio value={2}>
                        <Space>
                            <img style={{ width: 16 }} src={polygonSrc} />
                            Polygon Mumbai
                        </Space>
                    </Radio>
                </Radio.Group>
            </div>
            <Button type="primary" onClick={confirm}>
                Sign in
            </Button>
            {contextHolder}
        </div>
    )
})
const DepositTestToken: React.FC<{}> = memo((props) => {
    const availableChain = useRecoilValue(availableChainState)
    return (
        <div className="request-test-token">
            <div className="step-content-item-desc">
                Since DB3 is a decentralized database, register this node info
                to a public contract is required. Interact with on-chain
                contract will need token. We currently support Polygon Mumbai.
                If you don’t have the request token on Polygon Mumbai, please
                don’t hesitate to request from us
            </div>
            <div className="step-content-item-desc">
                On the other hand, data-up will cost some tokens. That include
                Arweave native token $Ar and EVM token (currently will only
                support Polygon Mumbai). We’ve already generated the two
                addresses on your node when you install
            </div>
            <div className="step-item-title">Admin Address</div>
            <div className="desc-box">
                <div className="signin-tips">
                    After signing in, your address and balance information will
                    be displayed here.
                </div>
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img src={polygonSrc} />
                                {availableChain === 1
                                    ? 'Arbitrum Nova'
                                    : 'Polygon Mumbai'}
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>0x1234567890</Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            0.0 Ar
                        </div>
                    </div>
                </div>
            </div>
            <div className="step-content-item-desc">
                A wallet have generated for you, and private key is stored on
                your own machine that only you can access. You can find both
                addresses’ private key under the path : /usr/db3/.....
            </div>
            <div className="desc-box">
                <div className="signin-tips">
                    After signing in, your address and balance information will
                    be displayed here.
                </div>
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img src={polygonSrc} />
                                {availableChain === 1
                                    ? 'Arbitrum Nova'
                                    : 'Polygon Mumbai'}
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>0x1234567890</Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            0.0 Ar
                        </div>
                    </div>
                </div>
            </div>
            <div className="desc-box">
                <div className="signin-tips">
                    After signing in, your address and balance information will
                    be displayed here.
                </div>
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img src={polygonSrc} />
                                {availableChain === 1
                                    ? 'Arbitrum Nova'
                                    : 'Polygon Mumbai'}
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>0x1234567890</Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            0.0 Ar
                        </div>
                    </div>
                </div>
            </div>
            <RequestTestTokenModal />
        </div>
    )
})

const SetupDataRollupRules: React.FC<{}> = memo((props) => {
    return (
        <div className="steup-data-rules">
            <div className="step-content-item-desc">
                You can decide how the data on your node be roll-up to the
                Arweave system which will permanent store the data. For the
                underlying technical about why DB3 do that, please refer to the
                [doc]. If you don’t change anything, the node will use default
                or set up later
            </div>
            <div className="desc-box">
                <div className="step-box-item">
                    <div className="step-box-item-title">Size (Mb)</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input />
                            <div className="input-unit">Mb</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        Min. size recommended: 10Mb, AR requires 1Mb at min.,
                        DB3 will compress 10Mb to 1Mb.
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Time (min)</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input />
                            <div className="input-unit">Min</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        Min. 1 min, data size should be {'>'} 10Mb first.{' '}
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Longest Time</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input />
                            <div className="input-unit">Min</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        At least roll-up once before the period of time
                    </div>
                </div>
                <Button type="primary">Register</Button>
            </div>
        </div>
    )
})
const Register: React.FC<{}> = memo((props) => {
    const code = `Info: 
admin_address: 8AiVx-VNNV8NbEZ69qHfRDD27WbUZCndjEJp6COc,
    roll_up_endpoint: http://1234.52345:7212
    indexer_endpoint: {
        "public_read": true,
        "host_add": "http://18.162.230.6:26660 "
    }
    `
    const availableChain = useRecoilValue(availableChainState)
    return (
        <div className="register">
            <div className="step-item-title">
                Network :
                <img
                    style={{
                        width: 16,
                        marginLeft: 8,
                        marginRight: 5,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                    }}
                    src={availableChain === 2 ? polygonSrc : arbitrumSrc}
                />
                {availableChain === 2 ? 'Polygon Mumbai' : 'Arbitrum Nova'}
            </div>
            <div className="desc-box">
                <pre>
                    <code className="db3-code">{code}</code>
                </pre>
            </div>
            <Button type="primary" style={{ margin: '16px 0' }}>
                Register
            </Button>
            <div className="step-item-title">tx_id</div>
            <div className="desc-box">
                <Paragraph copyable>1234567458ijsddgsdgfhdfgn</Paragraph>
            </div>
        </div>
    )
})
const StepGuide: React.FC<{}> = memo((props) => {
    return (
        <>
            <div className="step-title">Few Steps to kick start</div>
            <div className="step-guide">
                <Steps
                    className="db3-steps"
                    direction="vertical"
                    items={[
                        {
                            title: 'Sign In',
                            description: <Signin />,
                        },
                        {
                            title: 'Deposit Test Token',
                            description: <DepositTestToken />,
                        },
                        {
                            title: 'Registe to Contract',
                            description: <Register />,
                        },
                        {
                            title: 'Setup data roll-rp rules',
                            description: <SetupDataRollupRules />,
                        },
                    ]}
                />
            </div>
            {/* <RequestTestTokenModal /> */}
        </>
    )
})

export default StepGuide
