



import { createClient, createFromPrivateKey, syncAccountNonce, Client as ClientInstance, DB3Account } from "db3.js";
// import { DB3Account } from "db3.js";
import { proxy } from "valtio";


interface IClient {
    init: () => Promise<void>;
    account?: DB3Account;
    instance?: ClientInstance;
}

export const Client = proxy<IClient>({
    instance: undefined,
    account: undefined,
    init: async () => {
        const private_key =
            '0xdc6f560254643be3b4e90a6ba85138017aadd78639fbbb43c57669067c3bbe76'

        const account = createFromPrivateKey(private_key)

        const client = createClient(
            'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26619',
            'http://ec2-18-162-230-6.ap-east-1.compute.amazonaws.com:26639',
            account
        )
        await syncAccountNonce(client)
        Client.instance = client;
        Client.account = account;
    }
});