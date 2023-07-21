//
// context.ts
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
//

import React, { memo } from 'react'
import arbitrumSrc from '../assets/arbitrum.png'
import polygonSrc from '../assets/polygon.png'
import scrollSrc from '../assets/scroll.svg'

export const STORAGE_NODE_URL: string = 'http://127.0.0.1:26619'
export const INDEX_NODE_URL: string = 'http://127.0.0.1:26639'
//export const STORAGE_NODE_URL: string = 'https://rollup.cloud.db3.network'
//export const INDEX_NODE_URL: string = 'https://index.cloud.db3.network'
export const AR_SCAN_URL: string = 'https://viewblock.io/arweave/tx/'
export const EVM_SCAN_URL: string = 'https://mumbai.polygonscan.com/tx/'

export const chainToNodes = [
    {
        chainId: 31337,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Localtest',
        logo: polygonSrc,
        contractAddr: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    },
    {
        chainId: 80001,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Mumbai',
        logo: polygonSrc,
        contractAddr: '0x0d33fD31b322e122FFd9d7a9725e813a2824D9D6',
    },
    {
        chainId: 534353,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Scroll Testnet',
        logo: scrollSrc,
        contractAddr: '0x91B4BB6c2e6F70F93D89B04c049bFB2D36839d9A'
    }
]

export const chainList = [
    {
        id: 534353,
        name: 'scroll',
        network: 'scroll testnet',
        nativeCurrency: { name: 'test', symbol: 'test', decimals: 18 },
        rpcUrls: {
            default: {
                http: ['https://alpha-rpc.scroll.io/l2'],
                webSocket: ['wss://scroll-alpha.unifra.io/ws/8f98cfc6f5484d08bad532e3850e18b7'],
            },
            public: {
                http: ['https://alpha-rpc.scroll.io/l2'],
                webSocket: ['wss://scroll-alpha.unifra.io/ws/8f98cfc6f5484d08bad532e3850e18b7'],
            },
        },
        blockExplorers: {
            default: {
                name: 'Explorers',
                url: 'https://scroll.l2scan.co/'
            },
        },
        testnet: true,
    },

    {
        id: 31337,
        name: 'localnet',
        network: 'testnet',
        nativeCurrency: { name: 'test', symbol: 'test', decimals: 18 },
        rpcUrls: {
            default: {
                http: ['http://127.0.0.1:8545'],
                webSocket: ['ws://127.0.0.1:8545'],
            },
            public: {
                http: ['http://127.0.0.1:8545'],
                webSocket: ['ws://127.0.0.1:8545'],
            },
        },
        blockExplorers: {
            default: {
                name: 'Explorers',
                url: 'https://mumbai.polygonscan.com/',
            },
        },
        testnet: true,
    },
    {
        id: 80001,
        name: 'Polygon Mumbai',
        network: 'Polygon Mumbai',
        nativeCurrency: { name: 'matic', symbol: 'matic', decimals: 18 },
        rpcUrls: {
            default: {
                http: [
                    'https://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
                ],
                webSocket: [
                    'wss://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
                ],
            },
            public: {
                http: [
                    'https://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
                ],
                webSocket: [
                    'wss://polygon-mumbai.g.alchemy.com/v2/KIUID-hlFzpnLetzQdVwO38IQn0giefR',
                ],
            },
        },
        blockExplorers: {
            default: {
                name: 'Explorers',
                url: 'https://mumbai.polygonscan.com/',
            },
        },
        testnet: true,
    },
]
