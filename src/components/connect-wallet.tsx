import { Button } from 'antd'
import { ethers } from 'ethers'
import React, { useEffect } from 'react'
import { Wallet } from '../data-context/wallet'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import {
    createFromPrivateKey,
    createClient,
    syncAccountNonce,
    showDatabase,
    DB3Account,
} from 'db3.js'

const private_key =
    '0xdc6f560254643be3b4e90a6ba85138017aadd78639fbbb43c57669067c3bbe76'

const account = createFromPrivateKey(private_key)

// const client = createClient(
//     'http://127.0.0.1:26619',
//     'http://127.0.0.1:26639',
//     account
// )

export const ConnectWallet = () => {
    useEffect(() => {
        if (account) {
            Wallet.setAccount(account)
            // Wallet.setClient(client)
        }
        // const { address, isConnecting, isDisconnected } = useAccount()
        // Wallet.setAddress(address)
    }, [account])

    // const connect = async () => {

    //     const provider = new ethers.providers.Web3Provider(window.ethereum)
    //     const signer = provider.getSigner()
    //     const addr = await signer.getAddress()
    //     Wallet.setAddress(addr)
    // }

    return <ConnectButton />
}
