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
import lineaSrc from '../assets/linea.svg'
import zkSyncSrc from '../assets/zksync.png'
import localhostSrc from '../assets/localhost.png'
import {
localhost,
lineaTestnet,
polygonMumbai,
scrollTestnet,
zkSyncTestnet
} from 'viem/chains'

export const AR_SCAN_URL: string = 'https://viewblock.io/arweave/tx/'
export const defaultChainId = 1337

export const chainToNodes = [
    {
        chainId: 1337,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Localtest',
        logo: localhostSrc,
        contractAddr: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        arScanUrl:'https://viewblock.io/arweave/tx/'
    },
    {
        chainId: 80001,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Mumbai',
        logo: polygonSrc,
        contractAddr: '0x0d33fD31b322e122FFd9d7a9725e813a2824D9D6',
        arScanUrl:'https://viewblock.io/arweave/tx/'
    },
    {
        chainId: 534353,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Scroll Testnet',
        logo: scrollSrc,
        contractAddr: '0x91B4BB6c2e6F70F93D89B04c049bFB2D36839d9A',
        arScanUrl:'https://viewblock.io/arweave/tx/'
    },
    {
        chainId: 59140,
        dataRollupUrl: 'http://127.0.0.1:26619',
        dataIndexUrl: 'http://127.0.0.1:26639',
        name: 'Linea Testnet',
        logo: lineaSrc,
        contractAddr: '0xfFe5128735D2EFC1bFDF2eD18A99D1eD8d096D94',
        arScanUrl:'https://viewblock.io/arweave/tx/'
    },
    {
        chainId: 280,
        dataRollupUrl: 'http://testnet.db3.network:26100',
        dataIndexUrl: 'http://testnet.db3.network:26101',
        name: 'ZkSync Testnet',
        logo: zkSyncSrc,
        contractAddr: '0xB4Ec19674A67dB002fFDeB83e14f9849DA3D1020',
        arScanUrl:'https://viewblock.io/arweave/tx/'
    },
]

export const chainList = [
    localhost, lineaTestnet, polygonMumbai, scrollTestnet, zkSyncTestnet
]
