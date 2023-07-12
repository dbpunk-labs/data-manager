import React, { memo } from 'react'
import { Space, Typography, Alert } from 'antd'
import polygonSrc from '../../assets/polygon.png'

const { Paragraph } = Typography

const Account: React.FC<{}> = memo((props) => {
    return (
        <div className="account">
            <div className="db3-box">
                <div className="chain-account-info">
                    <div className="chain-account-info-item-left">
                        <div className="chain-account-info-item-title">
                            <Space>
                                <img src={polygonSrc} />
                                Polygon Mumbai
                            </Space>
                        </div>
                        <div className="chain-account-info-item-content">
                            <Paragraph copyable>0x1234567890</Paragraph>
                        </div>
                    </div>
                    <div className="chain-account-info-item-right">
                        <div className="chain-account-info-item-title">
                            Balance
                        </div>
                        <div className="chain-account-info-item-content">
                            0.0 Ar
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
            <div className="db3-box"></div>
        </div>
    )
})
export default Account
