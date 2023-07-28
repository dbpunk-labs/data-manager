import React from 'react'
import logo from '../assets/logo.svg'
import help from '../assets/help.svg'
import btnLink from '../assets/btn-link.svg'
import { Button } from 'antd'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header = () => {
    const { openConnectModal } = useConnectModal()
    return (
        <div className="header">
            <div className="logo">
                <img style={{ width: 28 }} src={logo} />
                <div className="title">DB3 Network</div>
            </div>
            <div className="header-right">
                <img style={{ width: 20 }} src={help} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            mounted,
                        }) => {
                            return (
                                <div
                                    {...(!mounted && {
                                        'aria-hidden': true,
                                        style: {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}
                                >
                                    {(() => {
                                        if (!mounted || !account || !chain) {
                                            return (
                                                <Button
                                                    style={{ marginLeft: 10 }}
                                                    icon={
                                                        <img
                                                            style={{
                                                                width: 16,
                                                            }}
                                                            src={btnLink}
                                                        />
                                                    }
                                                    onClick={openConnectModal}
                                                >
                                                    ConnectWallet
                                                </Button>
                                            )
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <Button
                                                    style={{ marginLeft: 10 }}
                                                    onClick={openChainModal}
                                                >
                                                    Wrong network
                                                </Button>
                                            )
                                        }

                                        return (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: 12,
                                                }}
                                            >
                                                <Button
                                                    onClick={openChainModal}
                                                    style={{
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {chain.name}
                                                </Button>

                                                <Button
                                                    onClick={openAccountModal}
                                                >
                                                    {account.displayName}
                                                    {account.displayBalance
                                                        ? ` (${account.displayBalance})`
                                                        : ''}
                                                </Button>
                                            </div>
                                        )
                                    })()}
                                </div>
                            )
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </div>
    )
}
