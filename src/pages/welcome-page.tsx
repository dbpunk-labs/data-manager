import React, { useState, useEffect } from 'react'
import { Header } from '../components/header'
import { Button, Form, Input, Modal, message, Card, Space } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { STORAGE_NODE_URL, INDEX_NODE_URL } from '../data-context/config'
import { Alert } from 'antd'
import {
    createClient,
    getStorageNodeStatus,
    getIndexNodeStatus,
    createFromExternal,
    createRandomAccount,
    syncAccountNonce,
    DB3Account,
    Client,
    db3MetaStoreContractConfig,
    setupStorageNode,
} from 'db3.js'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAsyncFn } from 'react-use'
import { useAccount } from 'wagmi'
import { useContractWrite } from 'wagmi'
import { useBalance } from 'wagmi'
import { useSignTypedData } from 'wagmi'
import { useNetwork } from 'wagmi'

function unitsToReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(1000_000)) / 1000_000.0).toFixed(6)
}

export const WelcomePage = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const copiedNotify = () => {
        messageApi.open({
            type: 'success',
            content: 'copied',
        })
    }
    const [networkId, setNetworkId] = React.useState(
        parseInt(new Date().getTime() / 1000)
    )
    const { chain, chains } = useNetwork()
    const [context, updateContext] = React.useState({
        adminAddress: '',
        storageNodeEvmAddress: '',
        storageNodeArAddress: '',
        storageNodeArBalance: '',
        storageNodeUrl: '',
        rollupInterval: '10',
        minRollSize: '10',
        indexNodeUrl: '',
        indexNodeEvmAddress: '',
        hasInited: false,
        networkId: 0,
    })
    const [client, setClient] = React.useState<Client>()
    const [inited, setInited] = React.useState(false)
    const [initFnRet, initFn] = useAsyncFn(async () => {
        if (chain) {
            try {
                const account = await createFromExternal(chain)
                const c = createClient(
                    STORAGE_NODE_URL,
                    INDEX_NODE_URL,
                    account
                )
                await syncAccountNonce(c)
                setClient(c)
                const status = await getStorageNodeStatus(c)
                const indexStatus = await getIndexNodeStatus(c)
                updateContext({
                    ...context,
                    storageNodeArAddress: status.arAccount,
                    storageNodeEvmAddress: status.evmAccount,
                    storageNodeArBalance: status.arBalance,
                    storageNodeUrl: status.nodeUrl,
                    indexNodeUrl: indexStatus.nodeUrl,
                    indexNodeEvmAddress: indexStatus.evmAccount,
                    hasInited: status.hasInited,
                    networkId: status.hasInited ? status.config.networkId : 0,
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('no chain')
        }
    }, [chain, context])
    const accountHandle = useAccount({
        onConnect({ address, connector, isReconnected }) {
            initFn()
        },
    })
    const [msg, setMsg] = React.useState('')

    const storageNodeEvmBalance = useBalance(
        {
            address: context.storageNodeEvmAddress,
            formatUnits: 'matic',
        },
        [context]
    )

    const [setupRollupNodeRet, setupRollupNodeHandle] = useAsyncFn(async () => {
        try {
            const rollupInterval = parseInt(context.rollupInterval) * 60 * 1000
            const minRollSize = parseInt(context.minRollSize) * 1024 * 1024
            console.log(rollupInterval)
            console.log(minRollSize)
            const response = await setupStorageNode(
                client,
                networkId.toString(),
                rollupInterval.toString(),
                minRollSize.toString()
            )
            if (response.code == 0) {
                setMsg('config rollup done!')
            }
        } catch (e) {
            console.log(e)
            setMsg('config rollup failed!')
        }
    }, [client, context, networkId])
    const registerNetwork = useContractWrite({
        ...db3MetaStoreContractConfig,
        functionName: 'registerNetwork',
    })

    return (
        <div>
            <Header />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    padding: '0px 120px',
                }}
            >
                <h1>Welcome </h1>
                {context.hasInited ? (
                    <Alert
                        message="Setup Done!"
                        description="This node has be initialized by admin"
                        type="success"
                        showIcon
                    />
                ) : (
                    <p></p>
                )}
                <div>
                    You’ve done fantastic job, we’ll almost finished to
                    self-host your DB3 node. Just few steps to kick start.
                </div>

                <Space direction="vertical" size="small">
                    <h2>#1 Sign In</h2>
                    <p>
                        Connect wallet and sign in as the admin address of this
                        node and the address must be the same with node admin
                        address
                    </p>
                    <ConnectButton />
                </Space>

                <Space direction="vertical" size="small">
                    <h2>#2 Register Metadata</h2>
                    <div
                        style={{
                            background: 'lightgray',
                            border: '1px solid black',
                        }}
                    >
                        <h3>Metadata Contract Address</h3>
                        <p>{db3MetaStoreContractConfig.address}</p>
                        <h3>Network Id </h3>
                        <p>
                            {context.hasInited ? context.networkId : networkId}
                        </p>
                        <h3>Your Admin Address</h3>
                        <p>{accountHandle.address}</p>
                        <h3>rollup node</h3>{' '}
                        <p>addr:{context.storageNodeEvmAddress}</p>
                        <p>url:http://{context.storageNodeUrl}</p>
                        <h3>index node</h3>{' '}
                        <p>addr:{context.indexNodeEvmAddress}</p>
                        <p>url:http://{context.indexNodeUrl}</p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        disabled={!registerNetwork || context.hasInited}
                        onClick={() =>
                            registerNetwork.write({
                                args: [
                                    networkId,
                                    context.storageNodeUrl,
                                    context.storageNodeEvmAddress,
                                    [context.indexNodeUrl],
                                    [context.indexNodeEvmAddress],
                                ],
                            })
                        }
                    >
                        Register
                    </Button>
                    {registerNetwork.isLoading && <div>Check Wallet</div>}
                    {registerNetwork.isSuccess && (
                        <div>
                            Transaction: {JSON.stringify(registerNetwork.data)}
                        </div>
                    )}
                </Space>

                <Space direction="vertical" size="small">
                    <h2>#3 The Account status of Data Rollup Node</h2>
                    <div>
                        <p>
                            Data Rollup Node will cost some tokens. That include
                            Arweave native token $Ar and EVM token (currently
                            will only support Polygon Mumbai). We’ve already
                            generated the two addresses on your node when you
                            install{' '}
                        </p>
                        <div
                            style={{
                                background: 'lightgray',
                                border: '1px solid black',
                            }}
                        >
                            <p>
                                A wallet have generated for you, and private key
                                is stored on your own machine that only you can
                                access.
                            </p>
                            <div>
                                <h3>Admin address</h3>
                                <p>{accountHandle.address}</p>
                            </div>
                            <div>
                                <h3>Arweave address</h3>{' '}
                                <span>Public wallet address</span>{' '}
                                <input
                                    defaultValue={context.storageNodeArAddress}
                                />
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(
                                                context.storageNodeArAddress
                                            )
                                        }
                                    }}
                                >
                                    <CopyOutlined />
                                </a>
                                <p>
                                    balance:{' '}
                                    {unitsToReadableNum(
                                        context.storageNodeArBalance
                                    )}{' '}
                                    ar
                                </p>
                            </div>
                            <div>
                                <h3>Polygon (Mumbai)</h3>
                                <span>Public wallet address</span>
                                <input
                                    defaultValue={context.storageNodeEvmAddress}
                                />
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(
                                                context.storageNodeEvmAddress
                                            )
                                        }
                                    }}
                                >
                                    <CopyOutlined />
                                </a>
                                <p>
                                    balance:{' '}
                                    {storageNodeEvmBalance.data?.formatted}{' '}
                                    {storageNodeEvmBalance.data?.symbol}{' '}
                                </p>
                            </div>
                            <div></div>
                            <div>
                                <a
                                    href="https://faucet.polygon.technology/"
                                    target="blank"
                                >
                                    Go to Polygon Mumbai Faucet
                                </a>
                            </div>
                        </div>
                    </div>
                </Space>

                <Space direction="vertical" size="small">
                    <h2>#4 Setup Rollup Node</h2>
                    <p>
                        You can decide how the data on your node be roll-up to
                        the Arweave system which will permanent store the data.
                        For the underlying technical about why DB3 do that,
                        please refer to the [doc]. If you don’t change anything,
                        the node will use default or set up later
                    </p>
                    <div
                        style={{
                            background: 'lightgray',
                            border: '1px solid black',
                        }}
                    >
                        <h3>Network Id</h3>
                        <input
                            defaultValue={
                                context.hasInited
                                    ? context.networkId
                                    : networkId
                            }
                            disabled={context.hasInited}
                        />
                        {''}
                        <h3>Min Rollup Size (Mb):</h3>
                        <input
                            defaultValue="10"
                            onChange={(e) =>
                                updateContext({
                                    ...context,
                                    minRollSize: e.target.value,
                                })
                            }
                        />{' '}
                        <p>
                            Min. size recommended: 10Mb, AR requires 1Mb at
                            min., DB3 will compress 10Mb to 1Mb.
                        </p>
                        <h3>Rollup Interval (min):</h3>
                        <input
                            defaultValue="10"
                            onChange={(e) =>
                                updateContext({
                                    ...context,
                                    rollupInterval: e.target.value,
                                })
                            }
                        />
                        <p>{`Min. 1 min, data size > 10Mb is recommended.`}</p>
                        {msg}
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => setupRollupNodeHandle()}
                    >
                        Setup
                    </Button>
                </Space>
            </div>
        </div>
    )
}
