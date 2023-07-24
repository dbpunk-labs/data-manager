import React from 'react'
import logo from '../assets/logo.svg'
import help from '../assets/help.svg'
import btnLink from '../assets/btn-link.svg'
import { Button } from 'antd'
export const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <img style={{ width: 28 }} src={logo} />
                <div className="title">DB3 Network</div>
            </div>
            <div className="header-right">
                <img style={{ width: 20 }} src={help} />
                <Button
                    style={{ marginLeft: 10 }}
                    icon={<img style={{ width: 16 }} src={btnLink} />}
                >
                    ConnectWallet
                </Button>
            </div>
        </div>
    )
}
