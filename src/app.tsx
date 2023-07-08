import {
    RainbowKitProvider,
    connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { polygonMumbai } from 'viem/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import './App.scss'
import { Header } from './components/header'
import LeftSider from './components/LeftSider'
import Content from './components/Content'
import './styles/common.scss'
import { RecoilRoot } from 'recoil'

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

    const { chains, publicClient } = configureChains(
        [customeMumbai],
        [publicProvider()]
    )

    const connectors = connectorsForWallets([
        {
            groupName: 'Recommended',
            wallets: [injectedWallet({ chains })],
        },
    ])
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient,
    })
    return (
        <RecoilRoot>
            <WagmiConfig config={wagmiConfig}>
                <RainbowKitProvider chains={chains}>
                    <Header />
                    <div className="content">
                        <LeftSider />
                        <Content>
                            <Outlet />
                        </Content>
                    </div>
                </RainbowKitProvider>
            </WagmiConfig>
        </RecoilRoot>
    )
}

export default App
