
import { proxy } from "valtio";

interface Wallet {
    address: string;
    setAddress: (addr: string) => void
}

export const Wallet = proxy<Wallet>({
    address: '',
    setAddress: (addr: string) => {
        Wallet.address = addr;
    }
});