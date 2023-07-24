import React from 'react'

import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'

import App from './App'
import { CollectionDetail } from './components/console/database/collection-detail'
import { CollectionList } from './components/console/database/collection-list'
import { DatabaseManagement } from './components/console/database/database-management'
import { Playground } from './components/console/database/database-playground'
import { DatabaseTable } from './components/console/database/database-table'
// import { EventDB } from './components/console/event-db/event-db'
// import { EventDbList } from './components/console/event-db/event-db-list'
import { EventDbPlayground } from './components/console/event-db/event-db-playground'
import { EventDbTable } from './components/console/event-db/event-db-table'
import { EventDetail } from './components/console/event-db/event-detail'
import { NodeAccount } from './components/console/node/account'
import { MutationsTable } from './components/console/node/mutations-table'
import { NodeConsole } from './components/console/node/node'
import { RollupTable } from './components/console/node/rollup-table'
import { NodeSetting } from './components/console/node/setting'
import { EventsTable } from './components/console/node/events'
import Home from './pages/Home'
import EventDB from './pages/EventDB'
import Node from './pages/Node'
import Database from './pages/Database'
import Setup from './pages/Setup'

import './reset.scss'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'
import Collections from './components/database/Collections'
import DatabaseAccount from './components/database/DatabaseAccount'
import EventList from './components/EventDB/EventList'
import CreateContractIndexs from './components/EventDB/CreateContractIndexs'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'setup',
                element: <Setup />,
            },
            {
                path: '/database',
                element: <Database />,
                children: [
                    {
                        path: '/database/:addr',
                        element: <Collections />,
                    },
                    {
                        path: '/database/:addr/:name',
                        element: <DatabaseAccount />,
                    },
                ],
            },
            {
                path: '/eventdb',
                element: <EventDB />,
                children: [
                    {
                        path: '',
                        element: <EventList />,
                    },
                ],
            },
            {
                path: '/contract/create',
                element: <CreateContractIndexs />,
            },
            {
                path: '/node',
                element: <Node />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
