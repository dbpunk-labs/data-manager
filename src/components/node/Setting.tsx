import React, { memo, useEffect } from 'react'
import { usePageContext } from '../../pages/Context'
import '../../styles/Settings.scss'
import {
    Descriptions,
    Typography,
    Table,
    Input,
    Form,
    Space,
    Button,
} from 'antd'
import {
    rollupIntervalReadableNum,
    rollupMaxIntervalReadableNum,
    minRollupSizeReadableNum,
    arToReadableNum,
} from '../../utils/utils'
import { useAsyncFn } from 'react-use'

import { SystemConfig, setup } from 'db3.js'
const { Paragraph } = Typography

const Setting: React.FC<{}> = memo((props) => {
    const { client, rollupStatus, indexStatus, networkId } = usePageContext()
    const [systemConfig, setSystemConfig] = React.useState<SystemConfig>({
        rollupInterval: (10 * 60 * 1000).toString(),
        rollupMaxInterval: (2 * 24 * 60 * 60 * 1000).toString(),
        minRollupSize: (10 * 1024 * 1024).toString(),
        evmNodeUrl: '',
        arNodeUrl: '',
    })
    useEffect(() => {
        if (rollupStatus?.hasInited) {
            setSystemConfig(rollupStatus.config)
        }
    }, [rollupStatus])

    const [setupState, setupHandle] = useAsyncFn(async () => {
        if (client && rollupStatus) {
            try {
                const config: SystemConfig = {
                    ...systemConfig,
                    minGcOffset: (10 * 24 * 60 * 60).toString(),
                }
                const response = await setup(client, config)
                return response
            } catch (e) {
                console.log(e.message)
                return [1, 1]
            }
        }
        return [1, 1]
    }, [client, systemConfig])

    return (
        <div className="setting">
            <div className="db3-box">
                <Descriptions
                    className="db3-descriptions"
                    column={1}
                    layout="vertical"
                >
                    <Descriptions.Item label="System">
                        <Descriptions
                            className="db3-descriptions"
                            layout="vertical"
                        >
                            <Descriptions.Item label="Admin Addr">
                                <Paragraph copyable>
                                    {rollupStatus?.adminAddr}
                                </Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Network Id">
                                <Paragraph copyable>{networkId}</Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Version">
                                <Paragraph copyable>
                                    {rollupStatus?.version?.versionLabel}@
                                    {rollupStatus?.version?.buildTime}
                                </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </Descriptions.Item>
                    <Descriptions.Item label="Rollup Node" span={2}>
                        <Descriptions
                            className="db3-descriptions"
                            layout="vertical"
                        >
                            <Descriptions.Item label="Evm Addr">
                                <Paragraph copyable>
                                    {rollupStatus?.evmAccount}
                                </Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Arweave Addr">
                                <Paragraph copyable>
                                    {rollupStatus?.arAccount}
                                </Paragraph>
                            </Descriptions.Item>
                            <Descriptions.Item label="Endpoint">
                                <Paragraph copyable>
                                    {rollupStatus?.nodeUrl}{' '}
                                </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </Descriptions.Item>
                    <Descriptions.Item label="Index Node" span={2}>
                        <Descriptions
                            className="db3-descriptions"
                            layout="vertical"
                        >
                            <Descriptions.Item label="Endpoint">
                                <Paragraph copyable>
                                    {indexStatus?.nodeUrl}{' '}
                                </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <div className="db3-box">
                <div className="db3-box-title">Rollup Settings</div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Data Network</div>
                    <div className="step-box-item-content">
                        <Space size="large">
                            <Input value={networkId} disabled />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        The data network that you have created
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Evm Node Rpc</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={systemConfig.evmNodeUrl}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        evmNodeUrl: e.target.value,
                                    })
                                }
                            />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the data rollup node needs a node to interact the
                        blockchain
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Arweave Node Url</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                value={systemConfig.arNodeUrl}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        arNodeUrl: e.target.value,
                                    })
                                }
                            />
                            <div className="input-unit"></div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the data rollup node needs a arweave node to send data
                        tansaction
                    </div>
                </div>

                <div className="step-box-item">
                    <div className="step-box-item-title">
                        Min Rollup Data Size
                    </div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                defaultValue={minRollupSizeReadableNum(
                                    rollupStatus?.config?.minRollupSize
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        minRollupSize: (
                                            BigInt(e.target.value) *
                                            BigInt(1024 * 1024)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">MB</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        the min data rollup size and 10MB is recommended
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">Rollup Interval</div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                defaultValue={rollupIntervalReadableNum(
                                    rollupStatus?.config?.rollupInterval
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        rollupInterval: (
                                            BigInt(e.target.value) *
                                            BigInt(60000)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">Min</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        Min. 1 min, data size should be {'>'} 10MB first.{' '}
                    </div>
                </div>
                <div className="step-box-item">
                    <div className="step-box-item-title">
                        Rollup Max Interval
                    </div>
                    <div className="step-box-item-content">
                        <Space>
                            <Input
                                defaultValue={rollupMaxIntervalReadableNum(
                                    rollupStatus?.config?.rollupMaxInterval
                                )}
                                onChange={(e) =>
                                    setSystemConfig({
                                        ...systemConfig,
                                        rollupMaxInterval: (
                                            BigInt(e.target.value) *
                                            BigInt(24 * 60 * 60 * 1000)
                                        ).toString(),
                                    })
                                }
                            />
                            <div className="input-unit">Day</div>
                        </Space>
                    </div>
                    <div className="step-box-item-tips">
                        At least roll-up once before the period of time
                    </div>
                    <Button
                        type="primary"
                        loading={setupState.loading}
                        onClick={() => setupHandle()}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
})
export default Setting
