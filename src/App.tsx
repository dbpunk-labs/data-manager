import {
    RainbowKitProvider,
    connectorsForWallets,
    darkTheme,
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
import { chainList } from './data-context/Config'
import { PageContextProvider } from './pages/Context'

export const App = () => {
    const { chains, publicClient } = configureChains(chainList, [
        publicProvider(),
    ])
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
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#7b3fe4',
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                    })}
                    chains={chains}
                >
                    <PageContextProvider>
                        <Header />
                        <div className="content">
                            <LeftSider />
                            <Content>
                                <Outlet />
                            </Content>
                        </div>
                    </PageContextProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </RecoilRoot>
    )
}
export default App
