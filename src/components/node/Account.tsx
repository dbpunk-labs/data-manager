import React, { memo, useEffect } from 'react'
import { Space, Typography, Alert } from 'antd'
import { chainToNodes } from '../../data-context/Config'
import { usePageContext } from '../../pages/Context'
import arweaveSrc from '../../assets/arweave.png'
import { useAsyncFn } from 'react-use'
import { useBalance } from 'wagmi'

import { arToReadableNum } from '../../utils/utils'
const { Paragraph } = Typography

const Account: React.FC<{}> = memo((props) => {
    const { rollupStatus } = usePageContext()
    const evmBalance = useBalance(
        {
            address: rollupStatus?.evmAccount,
            chainId: rollupStatus?.config?.chainId,
        },
        [rollupStatus]
    )
    const [adminArBalance, setAdminArBalance] = React.useState<string>('')
    const [loadArBalanceState, loadArBalance] = useAsyncFn(async () => {
        if (rollupStatus && rollupStatus.config) {
            const url =
                rollupStatus.config.arNodeUrl +
                '/wallet/' +
                rollupStatus.arAccount +
                '/balance'
            const response = await fetch(url, {
                method: 'GEt',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.status == 200) {
                const body = await response.json()
                setAdminArBalance(arToReadableNum(body))
            }
        }
    }, [rollupStatus])
    useEffect(() => {
        loadArBalance()
    }, [rollupStatus])

    return (
        <div className="account">
            <div className="db3-box">
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img
                                    style={{
                                        width: 16,
                                    }}
                                    src={
                                        rollupStatus &&
                                        rollupStatus.hasInited &&
                                        chainToNodes.find(
                                            (item) =>
                                                item.chainId ===
                                                rollupStatus.config.chainId
                                        )?.logo
                                    }
                                />
                                {rollupStatus &&
                                    rollupStatus.hasInited &&
                                    chainToNodes.find(
                                        (item) =>
                                            item.chainId ===
                                            rollupStatus.config.chainId
                                    )?.name}
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>
                                {rollupStatus?.evmAccount}
                            </Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            {evmBalance.data?.formatted}{' '}
                            {evmBalance.data?.symbol}
                        </div>
                    </div>
                </div>
            </div>

            <div className="db3-box">
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img src={arweaveSrc} />
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>
                                {rollupStatus?.arAccount}
                            </Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            {adminArBalance} Ar
                        </div>
                    </div>
                </div>
            </div>
          <Alert
                showIcon
                message="Insufficient balance, please recharge promptly."
                type="warning"
                action={<a>Recharge Now</a>}
            />
        </div>
    )
})
export default Account
