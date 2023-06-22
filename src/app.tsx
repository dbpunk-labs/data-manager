import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { polygonMumbai } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

export const App = () => {
    // TODO
    // if first enter, go to welcome page, else console page
    const customeMumbai = {
        id: 80001,
        name: 'local Testnet',
        network: 'local-testnet',
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
                name: 'localhost',
                url: 'https://mumbai.polygonscan.com/',
            },
        },
        testnet: true,
    }

    const myTestnet = {
        id: 9125,
        name: 'my network',
        network: 'localtestnet',
        nativeCurrency: { name: 'matic', symbol: 'matic', decimals: 18 },
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
                name: 'localhost',
                url: '',
            },
        },
        testnet: true,
    }

    const { chains, publicClient } = configureChains(
        [customeMumbai, polygonMumbai],
        [publicProvider()]
    )

    const { connectors } = getDefaultWallets({
        appName: 'db3 network',
        projectId: '169f8d0376c922533256a707b401c6ce',
        chains,
    })

    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient,
    })
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <div style={{ height: '100%' }}>{<Outlet />}</div>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

export default App
