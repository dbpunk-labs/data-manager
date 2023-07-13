import React, { memo, useEffect } from 'react'
import { Button, Input, Modal, Radio, Space, Steps, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import RequestTestTokenModal, {
    requestTestTokenVisibleState,
} from './RequestTestTokenModal'
import '../../styles/StepGuide.scss'
import arbitrumSrc from '../../assets/arbitrum.png'
import polygonSrc from '../../assets/polygon.png'
import arweaveSrc from '../../assets/arweave.png'
import btnLink from '../../assets/btn-link.svg'
import { chainToNodes } from '../../data-context/Config'
import {
    useContractEvent,
    useAccount,
    useContractWrite,
    useBalance,
    useNetwork,
    useSwitchNetwork,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { usePageContext } from '../../pages/Context'
import { useAsyncFn } from 'react-use'
import { stringToHex } from 'viem'
import {
    getStorageNodeStatus,
    getIndexNodeStatus,
    SystemStatus,
    db3MetaStoreContractConfig,
    setup,
} from 'db3.js'
import ReactJson from 'react-json-view'

const { Paragraph } = Typography

const availableChainState = atom({
    key: 'availableChainState',
    default: 31337,
})

const dataRollupNodeStatus = atom({
    key: 'dataRollupNodeStatus',
    default: {},
})

const dataIndexNodeStatus = atom({
    key: 'dataIndexNodeStatus',
    default: {},
})

const dataNetwork = atom({
    key: 'dataNetwork',
    default: {},
})

const networkId = atom({
    key: 'networkId',
    default: '0',
})

function rollupIntervalReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(1000)) / 60.0).toFixed(0)
}

function rollupMaxIntervalReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(60 * 60 * 1000)) / 24.0).toFixed(0)
}

function minRollupSizeReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(1024)) / 1024.0).toFixed(0)
}

const Signin: React.FC<{}> = memo((props) => {
    const [availableChain, setAvailableChain] =
        useRecoilState(availableChainState)
    const [modal, contextHolder] = Modal.useModal()
    const { address, isConnecting, isDisconnected } = useAccount()
    const { openConnectModal } = useConnectModal()
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
                Connect wallet and sign in as the admin
            </div>
            <Space>
                <div className="step-item-title require-label">
                    Available Public Chains
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
                    {chainToNodes.map((item) => {
                        return (
                            <Radio value={item.chainId} key={item.chainId}>
                                <Space>
                                    <img
                                        style={{ width: 16 }}
                                        src={item.logo}
                                    />
                                    {item.name}
                                </Space>
                            </Radio>
                        )
                    })}
                </Radio.Group>
            </div>
            {openConnectModal && (
                <Button onClick={openConnectModal} type="primary">
                    ConnectWallet
                </Button>
            )}
            {contextHolder}
        </div>
    )
})
const Register: React.FC<{}> = memo((props) => {
    const [rollupNodeStatus, setRollupNodeStatus] =
        useRecoilState(dataRollupNodeStatus)
    const [indexNodeStatus, setIndexNodeStatus] =
        useRecoilState(dataIndexNodeStatus)
    const [dataNetworkValue, setDataNetwork] = useRecoilState(dataNetwork)
    const [networkIdValue, setNetworkId] = useRecoilState(networkId)
    const { chain } = useNetwork()
    const { client } = usePageContext()
    const { address } = useAccount()
    const unwatch = useContractEvent(
        {
            address: db3MetaStoreContractConfig.address,
            abi: db3MetaStoreContractConfig.abi,
            eventName: 'CreateNetwork',
            listener(log) {
                if (log[0].args.sender === address) {
                    unwatch?.()
                    setNetworkId(log[0].args.networkId.toString())
                }
            },
        },
        [address]
    )
    const registerDataNetworkHandle = useContractWrite({
        ...db3MetaStoreContractConfig,
        functionName: 'registerDataNetwork',
    })
    const [getSystemStatusState, getSystemStatus] = useAsyncFn(async () => {
        if (client) {
            const rollupStatus = await getStorageNodeStatus(client)
            setRollupNodeStatus(rollupStatus)
            const indexStatus = await getIndexNodeStatus(client)
            setIndexNodeStatus(indexStatus)
            setDataNetwork({
                rollupAddress: rollupStatus.evmAccount,
                rollupNodeUrl: rollupStatus.nodeUrl,
                indexAddresses: [indexStatus.evmAccount],
                indexUrls: [indexStatus.nodeUrl],
            })
            if (rollupStatus.hasInited) {
                setNetworkId(rollupStatus.config.networkId)
            }
        }
    }, [client])
    useEffect(() => {
        getSystemStatus()
    }, [client])

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
                    src={
                        chain &&
                        chainToNodes.find((item) => item.chainId == chain.id)
                            ?.logo
                    }
                />
                {chain &&
                    chainToNodes.find((item) => item.chainId == chain.id)?.name}
            </div>
            <div className="desc-box">
                <pre>
                    <code className="db3-code">
                        <ReactJson
                            src={dataNetworkValue}
                            theme="tomorrow"
                            displayDataTypes={false}
                            displayObjectSize={false}
                            enableClipboard={false}
                        />
                    </code>
                </pre>
            </div>
            <Button
                disabled={
                    !registerDataNetworkHandle || rollupNodeStatus.hasInited
                }
                type="primary"
                style={{ margin: '16px 0' }}
                loading={registerDataNetworkHandle?.isLoading}
                onClick={() =>
                    registerDataNetworkHandle.write({
                        args: [
                            rollupNodeStatus.nodeUrl,
                            rollupNodeStatus.evmAccount,
                            [indexNodeStatus.nodeUrl],
                            [indexNodeStatus.evmAccount],
                            stringToHex('data network desc', { size: 32 }),
                        ],
                    })
                }
            >
                Register
            </Button>

            <div className="step-item-title">Transaction</div>
            <div className="desc-box">
                {registerDataNetworkHandle.data && (
                    <Paragraph copyable>
                        {registerDataNetworkHandle.data.hash}
                    </Paragraph>
                )}
            </div>
            <div className="step-item-title">Network</div>
            <div className="desc-box">
                {networkIdValue != '0' && (
                    <Paragraph copyable>{networkIdValue}</Paragraph>
                )}
            </div>
        </div>
    )
})

const FundYourNode: React.FC<{}> = memo((props) => {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const adminBalance = useBalance({ address }, [address])
    const rollupNodeStatus = useRecoilValue(dataRollupNodeStatus)
    const rollupNodeEvmBalance = useBalance(
        { address: rollupNodeStatus.evmAccount },
        [rollupNodeStatus]
    )

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
                {address && chain ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img
                                        src={
                                            chainToNodes.find(
                                                (item) =>
                                                    item.chainId == chain.id
                                            )?.logo
                                        }
                                    />
                                    {
                                        chainToNodes.find(
                                            (item) => item.chainId == chain.id
                                        )?.name
                                    }
                                </Space>
                            </div>
                            <div className="chain-account-info-item-content">
                                <Paragraph copyable>{address}</Paragraph>
                            </div>
                        </div>
                        <div className="chain-account-info-item-right">
                            <div className="chain-account-info-item-title">
                                Balance
                            </div>
                            <div className="chain-account-info-item-content">
                                {adminBalance.data?.formatted}{' '}
                                {adminBalance.data?.symbol}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="signin-tips">
                        After signing in, your address and balance information
                        will be displayed here.
                    </div>
                )}
            </div>
            <div className="step-content-item-desc">
                A wallet have generated for you, and private key is stored on
                your own machine that only you can access. You can find both
                addresses’ private key under the path : /usr/db3/.....
            </div>
            <div className="desc-box">
                {rollupNodeStatus && chain ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img
                                        src={
                                            chainToNodes.find(
                                                (item) =>
                                                    item.chainId == chain.id
                                            )?.logo
                                        }
                                    />
                                    {
                                        chainToNodes.find(
                                            (item) => item.chainId == chain.id
                                        )?.name
                                    }
                                </Space>
                            </div>
                            <div className="chain-account-info-item-content">
                                <Paragraph copyable>
                                    {rollupNodeStatus?.evmAccount}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="chain-account-info-item-right">
                            <div className="chain-account-info-item-title">
                                Balance
                            </div>
                            <div className="chain-account-info-item-content">
                                {rollupNodeEvmBalance.data?.formatted}{' '}
                                {rollupNodeEvmBalance.data?.symbol}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="signin-tips">
                        After signing in, your address and balance information
                        will be displayed here.
                    </div>
                )}
            </div>
            <div className="desc-box">
                {rollupNodeStatus ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img src={arweaveSrc} />
                                </Space>
                            </div>
                            <div className="chain-account-info-item-content">
                                <Paragraph copyable>
                                    {rollupNodeStatus.arAccount}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="chain-account-info-item-right">
                            <div className="chain-account-info-item-title">
                                Balance
                            </div>
                            <div className="chain-account-info-item-content">
                                0.0 AR
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="signin-tips">
                        After signing in, your address and balance information
                        will be displayed here.
                    </div>
                )}
            </div>
        </div>
    )
})

const SetupDataRollupRules: React.FC<{}> = memo((props) => {
    const [systemConfig, setSystemConfig] = React.useState<SystemConfig>({
        rollupInterval: (10 * 60 * 1000).toString(),
        rollupMaxInterval: (2 * 24 * 60 * 60 * 1000).toString(),
        minRollupSize: (1024 * 1024).toString(),
    })

    const rollupNodeStatus = useRecoilValue(dataRollupNodeStatus)
    useEffect(() => {
        if (rollupNodeStatus.hasInited) {
            setSystemConfig(rollupNodeStatus.config)
        }
    }, [rollupNodeStatus])

    const networkIdValue = useRecoilValue(networkId)
    const { chain } = useNetwork()
    const { client } = usePageContext()
    const [setupState, setupHandle] = useAsyncFn(async () => {
        if (client && chain) {
            try {
                console.log(client.account)
                const address = chainToNodes.find(
                    (item) => item.chainId == chain.id
                ).contractAddr
                console.log(address)
                const config: SystemConfig = {
                    ...systemConfig,
                    chainId: chain.id.toString(),
                    networkId: networkIdValue,
                    contractAddr: address,
                    minGcOffset: (10 * 24 * 60 * 60).toString(),
                }
                console.log(config)
                const response = await setup(client, config)
                console.log(response)
            } catch (e) {
                console.log(e.message)
            }
        }
    }, [client, chain, networkIdValue, systemConfig])

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
                    <div className="step-box-item-title">Data Network</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input value={networkIdValue} disabled />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        The data network that you have created
                    </div>
                </div>

                <div className="step-box-item">
                    <div className="step-box-item-title">Evm Node Rpc</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={systemConfig.evmNodeUrl}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        evmNodeUrl: e.target.value,
                                    })
                                }
                            />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the data rollup node needs a node to interact the
                        blockchain
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Arweave Node Url</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={systemConfig.arNodeUrl}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        arNodeUrl: e.target.value,
                                    })
                                }
                            />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the data rollup node needs a arweave node to send data
                        tansaction
                    </div>
                </div>

                <div className="step-box-item">
                    <div className="step-box-item-title">
                        Min Rollup Data Size
                    </div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={minRollupSizeReadableNum(
                                    systemConfig.minRollupSize
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        minRollupSize: (
                                            BigInt(e.target.value) *
                                            BigInt(1024 * 1024)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">MB</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the min data rollup size and 10MB is recommended
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Rollup Interval</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={rollupIntervalReadableNum(
                                    systemConfig.rollupInterval
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        rollupInterval: (
                                            BigInt(e.target.value) *
                                            BigInt(60000)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">Min</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        Min. 1 min, data size should be {'>'} 10MB first.{' '}
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">
                        Rollup Max Interval
                    </div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={rollupMaxIntervalReadableNum(
                                    systemConfig.rollupMaxInterval
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        rollupMaxInterval: (
                                            BigInt(e.target.value) *
                                            BigInt(24 * 60 * 60 * 1000)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">Day</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        At least roll-up once before the period of time
                    </div>
                </div>
            </div>
            <Button
                type="primary"
                loading={setupState.loading}
                onClick={() => setupHandle()}
            >
                Setup
            </Button>
        </div>
    )
})
const StepGuide: React.FC<{}> = memo((props) => {
    return (
        <>
            <div className="step-title">Setup your node</div>
            <div className="step-guide">
                <Steps
                    className="db3-steps"
                    direction="vertical"
                    items={[
                        {
                            title: 'Sign in as admin',
                            description: <Signin />,
                        },
                        {
                            title: 'Register a new data network',
                            description: <Register />,
                        },
                        {
                            title: 'Fund your node',
                            description: <FundYourNode />,
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
