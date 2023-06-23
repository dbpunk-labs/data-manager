// import { DB3Account } from "db3.js";
import { proxy } from 'valtio'

interface Wallet {
    address: string
    setAddress: (addr: string) => void
    account: {}
    setAccount: (account: {}) => void
    client: any
    setClient: (client: any) => void
}

export const Wallet = proxy<Wallet>({
    address: '',
    setAddress: (addr: string) => {
        Wallet.address = addr
    },
    account: {},
    setAccount: (account: {}) => {
        console.log('setAccount')

        console.log(account)

        Wallet.account = { ...account }
    },
    client: {},
    setClient: (client: any) => {
        Wallet.client = client
    },
})
