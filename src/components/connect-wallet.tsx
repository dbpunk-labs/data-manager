import { Button } from "antd";
import { ethers } from "ethers";
import React, { useEffect } from "react";
import { Wallet } from "../hooks/wallet";

export const ConnectWallet = () => {
  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    Wallet.setAddress(addr);
  };

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
};
