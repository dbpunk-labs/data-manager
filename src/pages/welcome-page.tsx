import React, { useState } from 'react'
import { Header } from '../components/header'
import { Button, Form, Input, Modal } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
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
    const [networkId, setNetworkId] = React.useState(
        parseInt(new Date().getTime() / 1000)
    )
    const { chain, chains } = useNetwork()
    const [msg, setMsg] = React.useState('')
    const { address, isConnecting, isDisconnected } = useAccount()
    const [client, setClient] = React.useState<Client>()
    const [inited, setInited] = React.useState(false)
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
    })

    const storageNodeEvmBalance = useBalance(
        {
            address: context.storageNodeEvmAddress,
            formatUnits: 'matic',
        },
        [context]
    )

    const [setupRollupNodeRet, setupRollupNodeHandle] = useAsyncFn(async () => {
        try {
            console.log(context)
            console.log(context.rollupInterval)
            console.log(context.minRollSize)
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

    const [initFnRet, initFn] = useAsyncFn(async () => {
        if (chain) {
            try {
                console.log(chain)
                const account = await createFromExternal(chain)
                const c = createClient(
                    'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26619',
                    'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26639',
                    //"http://127.0.0.1:26619",
                    //"http://127.0.0.1:26639",
                    account
                )
                console.log(account)
                await syncAccountNonce(c)
                setClient(c)
                const status = await getStorageNodeStatus(c)
                console.log(status)
                const indexStatus = await getIndexNodeStatus(c)
                console.log(indexStatus)
                updateContext({
                    ...context,
                    storageNodeArAddress: status.arAccount,
                    storageNodeEvmAddress: status.evmAccount,
                    storageNodeArBalance: status.arBalance,
                    storageNodeUrl: status.nodeUrl,
                    indexNodeUrl: indexStatus.nodeUrl,
                    indexNodeEvmAddress: indexStatus.evmAccount,
                })
            } catch (e) {
                console.log(e)
            }
        }
    }, [chain, context])
    const [showRequestModal, setShowRequestModal] =
        React.useState<boolean>(false)

    const [token, setToken] = useState<string>('')
    const [tx_id, setTx_id] = useState<string>('')
    if (!inited) {
        initFn()
        setInited(true)
    }

    const registerNetwork = useContractWrite({
        ...db3MetaStoreContractConfig,
        functionName: 'registerNetwork',
    })
    const onRequestToken = () => {
        // TODO
    }

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
                <div>
                    You’ve done fantastic job, we’ll almost finished to
                    self-host your DB3 node. Just few steps to kick start.
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#1</h2>
                    </div>
                    <div>
                        <h2>Sign in</h2>
                        <p>
                            Connect wallet and sign in as the admin address of
                            this node
                        </p>
                        <ConnectButton />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#2</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2>Register</h2>
                        <div
                            style={{
                                background: 'lightgray',
                                border: '1px solid black',
                            }}
                        >
                            <p>
                                Target contract:
                                {db3MetaStoreContractConfig.address}
                            </p>
                            <h3>Network Id </h3> <p>{networkId}</p>
                            <h3>Admin </h3> <p>addr:{address}</p>
                            <h3>rollup node</h3>{' '}
                            <p>addr:{context.storageNodeEvmAddress}</p>
                            <p>url:http://{context.storageNodeUrl}</p>
                            <h3>index node</h3>{' '}
                            <p>addr:{context.indexNodeEvmAddress}</p>
                            <p>url:http://{context.indexNodeUrl}</p>
                        </div>
                        <Button
                            style={{
                                backgroundColor: '#1677ff',
                                color: '#fff',
                            }}
                            disabled={!registerNetwork}
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
                                Transaction:{' '}
                                {JSON.stringify(registerNetwork.data)}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#3</h2>
                    </div>
                    <div>
                        <h2>Request Test Token for Rollup Node</h2>
                        <p>
                            Since DB3 is a decentralized database, register this
                            node info to a public contract is required. Interact
                            with on-chain contract will need token. We currently
                            support Polygon Mumbai. If you don’t have the
                            request token on Polygon Mumbai, please don’t
                            hesitate to request from us
                        </p>
                        <p>
                            On the other hand, data-up will cost some tokens.
                            That include Arweave native token $Ar and EVM token
                            (currently will only support Polygon Mumbai). We’ve
                            already generated the two addresses on your node
                            when you install{' '}
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
                                <p>{address}</p>
                            </div>
                            <div>
                                <h3>Arweave address</h3>{' '}
                                <p>
                                    <span>Public wallet address</span>{' '}
                                    <input
                                        defaultValue={
                                            context.storageNodeArAddress
                                        }
                                    />
                                    <a
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (navigator.clipboard) {
                                                // TODO
                                                navigator.clipboard.writeText(
                                                    `**`
                                                )
                                            }
                                        }}
                                    >
                                        Copy
                                    </a>
                                    <p>
                                        balance:{' '}
                                        {unitsToReadableNum(
                                            context.storageNodeArBalance
                                        )}{' '}
                                        ar
                                    </p>
                                </p>
                            </div>
                            <div>
                                <h3>Polygon (Mumbai)</h3>
                                <p>
                                    <span>Public wallet address</span>
                                    <input
                                        defaultValue={
                                            context.storageNodeEvmAddress
                                        }
                                    />
                                    <a
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (navigator.clipboard) {
                                                navigator.clipboard.writeText(
                                                    `**`
                                                )
                                            }
                                        }}
                                    >
                                        Copy
                                    </a>
                                    <p>
                                        balance:{' '}
                                        {storageNodeEvmBalance.data?.formatted}{' '}
                                        {storageNodeEvmBalance.data?.symbol}{' '}
                                    </p>
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
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#3</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2>Node Setup</h2>
                        <p>
                            You can decide how the data on your node be roll-up
                            to the Arweave system which will permanent store the
                            data. For the underlying technical about why DB3 do
                            that, please refer to the [doc]. If you don’t change
                            anything, the node will use default or set up later
                        </p>
                        <div
                            style={{
                                background: 'lightgray',
                                border: '1px solid black',
                            }}
                        >
                            <p>
                                <b>Network Id:</b>
                                <input defaultValue={networkId} />
                                {''}
                            </p>
                            <p>
                                <b>Min Rollup Size (Mb):</b>
                                <input
                                    defaultValue="10"
                                    onChange={(e) =>
                                        updateContext({
                                            ...context,
                                            minRollSize: e.target.value,
                                        })
                                    }
                                />{' '}
                                Min. size recommended: 10Mb, AR requires 1Mb at
                                min., DB3 will compress 10Mb to 1Mb.
                            </p>
                            <p>
                                <b>Rollup Interval (min):</b>
                                <input
                                    defaultValue="10"
                                    onChange={(e) =>
                                        updateContext({
                                            ...context,
                                            rollupInterval: e.target.value,
                                        })
                                    }
                                />
                                {`Min. 1 min, data size should be > 10Mb first.`}
                            </p>
                            <Button
                                style={{
                                    backgroundColor: '#1677ff',
                                    color: '#fff',
                                }}
                                onClick={() => setupRollupNodeHandle()}
                            >
                                setup
                            </Button>
                            {msg}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
