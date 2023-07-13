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
} from 'db3.js'

import { chainToNodes } from '../data-context/Config'
import type { Chain } from '@wagmi/chains'
import { useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'
import { useAsyncFn } from 'react-use'

interface IPageContext {
    // the db3 network read and write client
    client: Client | undefined
    // the read client
    readClient: ReadClient | undefined
    // the selected chain
    selectedChain: Chain | undefined
}

const PageContext = React.createContext({} as IPageContext)

function usePageContext() {
    return React.useContext(PageContext)
}

function PageContextProvider({ children }) {
    const [pageContext, setPageContext] = React.useState<IPageContext>({
        client: undefined,
        readClient: undefined,
        selectedChain: undefined,
    } as IPageContext)

    const { chain } = useNetwork()
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
                    setPageContext({
                        readClient: undefined,
                        client,
                        selectedChain: chain,
                    } as IPageContext)
                } catch (e) {
                    console.log(e)
                }
            } else {
                // throw error
                console.log('no node to support chains', chain)
            }
        }
    }, [chain, pageContext])

    const accountHandle = useAccount({
        onConnect({ address, connector, isReconnected }) {
            doLogin()
        },
        onDisconnect() {
            // return the login page
        },
    })

    return (
        <PageContext.Provider value={pageContext}>
            {children}
        </PageContext.Provider>
    )
}
export { PageContext, usePageContext, PageContextProvider }
