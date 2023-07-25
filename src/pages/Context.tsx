//
// Context.tsx
// Copyright (C) 2023 db3.network Author imotai <codego.me@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import React, { useState, useEffect } from 'react'

import {
    Client,
    ReadClient,
    createFromExternal,
    createClient,
    createReadonlyClient,
    syncAccountNonce,
    getStorageNodeStatus,
    getIndexNodeStatus,
    SystemStatus,
} from 'db3.js'

import { chainList, chainToNodes, defaultChainId } from '../data-context/Config'
import type { Chain } from '@wagmi/chains'
import { useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'
import { useAsyncFn } from 'react-use'

import { atom } from 'recoil'

const appDatabases = atom({
    key: 'appDatabases',
    default: [],
})

const appCurrentDatabase = atom({
    key: 'appCurrentDatabase',
    default: {},
})

interface IPageContext {
    // the db3 network read and write client
    client?: Client
    // the read client
    readClient?: ReadClient
    // the selected chain
    selectedChain?: Chain
    // the rollup node status
    rollupStatus?: SystemStatus
    // the index node status
    indexStatus?: SystemStatus
    // the network id
    networkId?: string
}

const PageContext = React.createContext({} as IPageContext)

function usePageContext() {
    return React.useContext(PageContext)
}

function PageContextProvider({ children }) {
    const [inited, setInited] = React.useState(false)
    const [pageContext, setPageContext] = React.useState<IPageContext>(
        {} as IPageContext
    )
    const { chain } = useNetwork()
    const [initState, initHandle] = useAsyncFn(async () => {
        const node = chainToNodes.find((item) => {
            return item.chainId == defaultChainId
        })
        if (node) {
            try {
                const client = createReadonlyClient(
                    node.dataRollupUrl,
                    node.dataIndexUrl
                )
                const rollupStatus = await getStorageNodeStatus(client)
                const indexStatus = await getIndexNodeStatus(client)
                setPageContext({
                    readClient: client,
                    client: undefined,
                    selectedChain: chainList.find(
                        (item) => item.id === defaultChainId
                    ),
                    rollupStatus,
                    indexStatus,
                    networkId: rollupStatus.hasInited
                            ? rollupStatus.config.networkId
                            : '0',
                } as IPageContext)
            } catch (e) {
                console.log(e)
            }
        }
    })

    const [doLoginState, doLogin] = useAsyncFn(async () => {
        if (chain) {
            const node = chainToNodes.find((item) => {
                return item.chainId == chain.id
            })
            if (
                pageContext.selectedChain &&
                pageContext.selectedChain.id == node.chainId
            ) {
                return
            }
            if (node) {
                try {
                    const account = await createFromExternal(chain)
                    const client = createClient(
                        node.dataRollupUrl,
                        node.dataIndexUrl,
                        account
                    )
                    await syncAccountNonce(client)
                    const rollupStatus = await getStorageNodeStatus(client)
                    const indexStatus = await getIndexNodeStatus(client)
                    setPageContext({
                        readClient: undefined,
                        client,
                        selectedChain: chain,
                        rollupStatus,
                        indexStatus,
                        networkId: rollupStatus.hasInited
                            ? rollupStatus.config.networkId
                            : '0',
                    } as IPageContext)
                } catch (e) {
                    console.log(e)
                }
            } else {
                // throw error
                console.log('no node to support chains', chain)
            }
        }
    }, [chain])

    const accountHandle = useAccount({
        onConnect({ address, connector, isReconnected }) {
            doLogin()
        },
        onDisconnect() {},
    })
    if (!inited) {
        setInited(true)
        initHandle()
    }
    return (
        <PageContext.Provider value={pageContext}>
            {children}
        </PageContext.Provider>
    )
}

export {
    PageContext,
    usePageContext,
    PageContextProvider,
    appDatabases,
    appCurrentDatabase,
}
