import React, { useState } from 'react'
import { Header } from '../components/header'
import { Button, Form, Input, Modal } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import {
    createClient,
    // getStorageNodeStatus,
    createRandomAccount,
    syncAccountNonce,
    DB3Account,
    Client,
    configRollup,
} from 'db3.js'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAsyncFn } from 'react-use'
import { useAccount } from 'wagmi'

export const WelcomePage = () => {
    const [account, setAccount] = React.useState<DB3Account>(
        createRandomAccount()
    )
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
    })

    const [setRollupRet, setRollupFn] = useAsyncFn(async () => {}, [
        client,
        context,
    ])
    const [initFnRet, initFn] = useAsyncFn(async () => {
        if (account) {
            try {
                const c = createClient(
                    'http://127.0.0.1:26619',
                    'http://127.0.0.1:26639',
                    account
                )
                await syncAccountNonce(c)
                setClient(c)
                const status = await getStorageNodeStatus(c)
                console.log(status)
                updateContext({
                    ...context,
                    storageNodeArAddress: status.arAccount,
                    storageNodeEvmAddress: status.evmAccount,
                    storageNodeArBalance: status.arBalance,
                    storageNodeUrl: status.nodeUrl,
                    rollupInterval: status.rollupInterval,
                    minRollSize: status.minRollupSize,
                })
            } catch (e) {
                console.log(e)
            }
        }
    }, [account, context])

    const [showRequestModal, setShowRequestModal] =
        React.useState<boolean>(false)

    const [token, setToken] = useState<string>('')
    const [tx_id, setTx_id] = useState<string>('')
    if (!inited) {
        initFn()
        setInited(true)
    }
    const onRequestToken = () => {
        // TODO
    }

    const onRegister = () => {
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
                    <div>
                        <h2>Request Test Token</h2>
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
                                                // TODO
                                                navigator.clipboard.writeText(
                                                    `**`
                                                )
                                            }
                                        }}
                                    >
                                        Copy
                                    </a>
                                </p>
                            </div>
                            <div>
                                <p>
                                    You can find both addresses’ private key
                                    under the path : /usr/db3/.....
                                </p>
                            </div>
                            <div>
                                <Button
                                    onClick={() => setShowRequestModal(true)}
                                >
                                    Request test token
                                </Button>
                                <Modal
                                    title="Request Test Token"
                                    open={showRequestModal}
                                    okText="Request token"
                                    onOk={() => {
                                        onRequestToken()
                                    }}
                                    onCancel={() => setShowRequestModal(false)}
                                >
                                    <p>
                                        Step1： Post a tweet to your Twitter
                                        account, the content is as follows:
                                    </p>
                                    <div style={{ border: '1px solid black' }}>
                                        <div>
                                            I’m testing db3 network as my dApp
                                            database, and get some test token,
                                            my Ar address is 0x1012314121412415.
                                            My Polygon address is 0x1231455. My
                                            endpoint node code is : 902133erq Go
                                            and get more info about db3.network
                                        </div>
                                        <CopyOutlined
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                if (navigator.clipboard) {
                                                    navigator.clipboard.writeText(
                                                        `**`
                                                    )
                                                }
                                            }}
                                        />
                                    </div>
                                    <p>
                                        Step2： Paste your twitter url contains
                                        above info and get some token
                                    </p>
                                    <Input
                                        value={token}
                                        onChange={(e) =>
                                            setToken(e.target.value)
                                        }
                                    />
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#3</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2>Setup data roll-up rules</h2>
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
                                <b>Size (Mb):</b>
                                <input
                                    defaultValue="10"
                                    onChange={(e) =>
                                        updateRollupSettings({
                                            ...rollupSettings,
                                            minRollSize: e.target.value,
                                        })
                                    }
                                />{' '}
                                Min. size recommended: 10Mb, AR requires 1Mb at
                                min., DB3 will compress 10Mb to 1Mb.
                            </p>
                            <p>
                                <b>Time (min):</b>
                                <input
                                    defaultValue="10"
                                    onChange={(e) =>
                                        updateRollupSettings({
                                            ...rollupSettings,
                                            rollupInterval: e.target.value,
                                        })
                                    }
                                />
                                {`Min. 1 min, data size should be > 10Mb first.`}
                            </p>
                            <Button onClick={() => setShowRequestModal(true)}>
                                Set the Rollup
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <h2>#4</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2>Register</h2>
                        <p>
                            Target contract:
                            0x61e613F27b8B48144fbf93DFdBcC5B2BEa6eb7DD
                        </p>
                        <p>
                            tx_id: <a>{tx_id}</a>
                        </p>
                        <Button onClick={() => onRegister()}>Register</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
