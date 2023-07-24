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
import { SystemStatus, db3MetaStoreContractConfig, setup } from 'db3.js'
import ReactJson from 'react-json-view'
import { arToReadableNum } from '../../utils/utils'

const { Paragraph } = Typography

const dataNetwork = atom({
    key: 'dataNetwork',
    default: {},
})
const newNetworkId = atom({
    key: 'newNetwork',
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
    const [modal, contextHolder] = Modal.useModal()
    const { address, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const switchNetworkHandle = useSwitchNetwork()
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
                    value={chain ? chain.id : 31337}
                    onChange={(e) => {
                        if (chain && chain.id != e.target.value) {
                            switchNetworkHandle?.switchNetwork(e.target.value)
                        }
                    }}
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
    const [dataNetworkValue, setDataNetwork] = useRecoilState(dataNetwork)
    const [newNetworkIdValue, setNewNetworkId] = useRecoilState(newNetworkId)
    const { chain } = useNetwork()
    const { rollupStatus, indexStatus } = usePageContext()
    const { address } = useAccount()
    const unwatch = useContractEvent(
        {
            address: chainToNodes.find((item) => item.chainId === chain.id)
                ?.contractAddr,
            abi: db3MetaStoreContractConfig.abi,
            eventName: 'CreateNetwork',
            listener(log) {
                if (log[0].args.sender === address) {
                    unwatch?.()
                    setNewNetworkId(log[0].args.networkId.toString())
                }
            },
        },
        [address, chain]
    )
    const registerDataNetworkHandle = useContractWrite(
        {
            address: chainToNodes.find((item) => item.chainId === chain.id)
                ?.contractAddr,
            abi: db3MetaStoreContractConfig.abi,
            functionName: 'registerDataNetwork',
        },
        [chain]
    )

    useEffect(() => {
        if (rollupStatus && indexStatus) {
            setDataNetwork({
                rollupAddress: rollupStatus.evmAccount,
                rollupNodeUrl: rollupStatus.nodeUrl,
                indexAddresses: [indexStatus.evmAccount],
                indexUrls: [indexStatus.nodeUrl],
            })
        }
    }, [rollupStatus, indexStatus])

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
                        chainToNodes.find((item) => item.chainId === chain.id)
                            ?.logo
                    }
                />
                {chain &&
                    chainToNodes.find((item) => item.chainId === chain.id)
                        ?.name}
            </div>
            <div className="desc-box">
                <pre>
                    <code className="db3-code">
                        <ReactJson
                            src={dataNetworkValue}
                            theme="tomorrow"
                            name={false}
                            displayDataTypes={false}
                            displayObjectSize={false}
                            enableClipboard={false}
                        />
                    </code>
                </pre>
            </div>
            <Button
                disabled={!registerDataNetworkHandle || rollupStatus?.hasInited}
                type="primary"
                style={{ margin: '16px 0' }}
                loading={registerDataNetworkHandle?.isLoading}
                onClick={() =>
                    registerDataNetworkHandle.write({
                        args: [
                            rollupStatus?.nodeUrl,
                            rollupStatus?.evmAccount,
                            [indexStatus?.nodeUrl],
                            [indexStatus?.evmAccount],
                            stringToHex('data network desc', { size: 32 }),
                        ],
                    })
                }
            >
                Register
            </Button>
            {!rollupStatus?.hasInited && (
                <>
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
                        {newNetworkIdValue != '0' && (
                            <Paragraph copyable>{newNetworkIdValue}</Paragraph>
                        )}
                    </div>
                </>
            )}
        </div>
    )
})

const FundYourNode: React.FC<{}> = memo((props) => {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [adminArBalance, setAdminArBalance] = React.useState<string>('')
    const { rollupStatus } = usePageContext()
    const [loadArBalanceState, loadArBalance] = useAsyncFn(async () => {
        if (rollupStatus && rollupStatus.config) {
            const url =
                rollupStatus.config.arNodeUrl +
                '/wallet/' +
                rollupStatus.arAccount +
                '/balance'
            const response = await fetch(url, {
                method: 'GEt',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.status == 200) {
                const body = await response.json()
                setAdminArBalance(arToReadableNum(body))
            }
        }
    }, [rollupStatus])
    const adminBalance = useBalance({ address }, [address])
    const rollupNodeEvmBalance = useBalance(
        { address: rollupStatus?.evmAccount },
        [rollupStatus]
    )
    useEffect(() => {
        loadArBalance()
    }, [rollupStatus])
    return (
        <div className="request-test-token">
            <div className="step-content-item-desc"></div>
            <div className="step-content-item-desc">
                On the other hand, will cost some tokens. That include Arweave
                native token $Ar and EVM token (currently will only support
                Polygon Mumbai). We’ve already generated the two addresses on
                your node when you install
            </div>
            <div className="step-item-title">Admin Address</div>
            <div className="desc-box">
                {address && chain ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img
                                        style={{ width: 16 }}
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
                your own machine that only you can access.
            </div>
            <div className="desc-box">
                {rollupStatus && chain ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img
                                        style={{ width: 16 }}
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
                                    {rollupStatus?.evmAccount}
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
                {rollupStatus ? (
                    <div className="chain-account-info">
                        <div className="chain-account-info-item-left">
                            <div className="chain-account-info-item-title">
                                <Space>
                                    <img src={arweaveSrc} />
                                </Space>
                            </div>
                            <div className="chain-account-info-item-content">
                                <Paragraph copyable>
                                    {rollupStatus.arAccount}
                                </Paragraph>
                            </div>
                        </div>
                        <div className="chain-account-info-item-right">
                            <div className="chain-account-info-item-title">
                                Balance
                            </div>
                            <div className="chain-account-info-item-content">
                                {adminArBalance} AR
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
    const newNetworkIdValue = useRecoilValue(newNetworkId)
    const [systemConfig, setSystemConfig] = React.useState<SystemConfig>({
        rollupInterval: (10 * 60 * 1000).toString(),
        rollupMaxInterval: (2 * 24 * 60 * 60 * 1000).toString(),
        minRollupSize: (10 * 1024 * 1024).toString(),
    })
    const { client, rollupStatus, networkId } = usePageContext()

    useEffect(() => {
        if (rollupStatus?.hasInited) {
            setSystemConfig(rollupStatus.config)
        }
    }, [rollupStatus, newNetworkIdValue])
    const { chain } = useNetwork()
    const [setupState, setupHandle] = useAsyncFn(async () => {
        if (client && chain) {
            try {
                const address = chainToNodes.find(
                    (item) => item.chainId == chain.id
                ).contractAddr
                const config: SystemConfig = {
                    ...systemConfig,
                    chainId: chain.id.toString(),
                    networkId: rollupStatus.hasInited
                        ? networkId
                        : newNetworkIdValue,
                    contractAddr: address,
                    minGcOffset: (10 * 24 * 60 * 60).toString(),
                }
                const response = await setup(client, config)
                return response
            } catch (e) {
                console.log(e.message)
                return [1, 1]
            }
        }
        return [1, 1]
    }, [
        client,
        chain,
        networkId,
        systemConfig,
        newNetworkIdValue,
        rollupStatus,
    ])

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
                            <Input
                                value={
                                    rollupStatus?.hasInited
                                        ? networkId
                                        : newNetworkIdValue
                                }
                                disabled
                            />
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
                            title: 'Sign in',
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
