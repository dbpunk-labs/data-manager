import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import App from './app';
import { CollectionDetail } from './components/console/database/collection-detail';
import { CollectionList } from './components/console/database/collection-list';
import { DatabaseManagement } from './components/console/database/database-management';
import { Playground } from './components/console/database/database-playground';
import { DatabaseTable } from './components/console/database/database-table';
import { EventDB } from './components/console/event-db/event-db';
import { EventDbList } from './components/console/event-db/event-db-list';
import { EventDbPlayground } from './components/console/event-db/event-db-playground';
import { EventDbTable } from './components/console/event-db/event-db-table';
import { EventDetail } from './components/console/event-db/event-detail';
import { Home } from './components/console/home';
import { NodeAccount } from './components/console/node/account';
import { MutationsTable } from './components/console/node/mutations-table';
import { NodeConsole } from './components/console/node/node';
import { RollupTable } from './components/console/node/rollup-table';
import { NodeSetting } from './components/console/node/setting';
import { ConsolePage } from './pages/console-page';
import { LaunchPage } from './pages/launch-page';
import { WelcomePage } from './pages/welcome-page';

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
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/console',
                element: <ConsolePage />,
                children: [
                    { path: '/console/home', element: <Home /> },
                    {
                        path: '/console/database',
                        element: <DatabaseManagement />,
                        children: [
                            {
                                path: '/console/database/db',
                                element: <DatabaseTable />,
                                children: [
                                    {
                                        path: '/console/database/db/:id',
                                        element: <CollectionList />,
                                    },
                                    {
                                        path: '/console/database/db/:dbId/:collectionId',
                                        element: <CollectionDetail />,
                                    },
                                ],
                            },
                            {
                                path: '/console/database/playground',
                                element: <Playground />,
                            },
                        ],
                    },
                    {
                        path: '/console/event-db',
                        element: <EventDB />,
                        children: [
                            {
                                path: '/console/event-db/events',
                                element: <EventDbTable />,
                                children: [
                                    {
                                        path: '/console/event-db/events/:id',
                                        element: <EventDbList />,
                                    },
                                    {
                                        path: '/console/event-db/events/:dbId/:collectionId',
                                        element: <EventDetail />,
                                    },
                                ],
                            },
                            {
                                path: '/console/event-db/playground',
                                element: <EventDbPlayground />,
                            },
                        ],
                    },
                    {
                        path: '/console/node',
                        element: <NodeConsole />,
                        children: [
                            {
                                path: '/console/node/rollup',
                                element: <RollupTable />,
                            },
                            {
                                path: '/console/node/mutations',
                                element: <MutationsTable />,
                            },
                            {
                                path: '/console/node/account',
                                element: <NodeAccount />,
                            },
                            {
                                path: '/console/node/setting',
                                element: <NodeSetting />,
                            },
                        ],
                    },
                ],
            },
            {
                path: '/launch',
                element: <LaunchPage />,
            },
            {
                path: '/welcome',
                element: <WelcomePage />,
            },
        ],
    },
])

createRoot(document.getElementById('root')).render(
    <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
            <RouterProvider router={router} />
        </RainbowKitProvider>
    </WagmiConfig>
)
