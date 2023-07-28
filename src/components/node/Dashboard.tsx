import React, { memo, useEffect } from 'react'
import { Col, Descriptions, Typography, List, Row, Space, Table } from 'antd'
import { usePageContext } from '../../pages/Context'
import { AR_SCAN_URL } from '../../data-context/Config'
import { useAsyncFn } from 'react-use'
import Icon from '@ant-design/icons'
import type { MutationHeader, RollupRecord, Dashboard } from './Types'
import { Link } from 'react-router-dom'

import {
    timeDifference,
    bytesToReadableNum,
    bytesToReadableNumRaw,
    unitsToReadableNum,
    evmUnitsToReadableNum,
    shortString,
    getGBCost,
    getCompressRatio,
    toHEX,
    getSingleRollupCost,
} from '../../utils/utils'

import {
    scanRollupRecords,
    scanMutationHeaders,
    getMutationBody,
    MutationAction,
    getMutationState,
    MutationStateView,
} from 'db3.js'

const { Paragraph } = Typography
const ProgressIcon = () => (
    <svg
        className="progress-icon"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="progress-mini">
            <circle
                id="progress-circle-path"
                cx="6"
                cy="6"
                r="5"
                stroke="#94BFFF"
                strokeWidth="2"
            />
            <path
                id="progress-circle-trail"
                d="M6 1C6.78905 1 7.5669 1.18675 8.26995 1.54497C8.973 1.90319 9.58129 2.42272 10.0451 3.06107C10.5089 3.69943 10.815 4.43849 10.9384 5.21783C11.0619 5.99716 10.9991 6.79465 10.7553 7.54508"
                stroke="#165DFF"
                strokeWidth="2"
            />
        </g>
    </svg>
)

const NodeDashboard: React.FC<{}> = memo((props) => {
    const { client, readClient, selectedChain } = usePageContext()
    const [dashboard, setDashboard] = React.useState<Dashboard>({
        mutationCount: '0',
        rollupCount: '0',
        mutationBytesNum: 0,
        mutationBytesLabel: 'B',
        rollupBytesNum: 0,
        rollupBytesLabel: 'B',
        mutationAvgCost: '0',
        rollupAvgCost: '0',
        compressRatio: '0',
        totalCostInUsd: '0',
    })
    const [mutations, setMutations] = React.useState<MutationHeader[]>([])
    const [rollupRecords, setRollupRecords] = React.useState<RollupRecord[]>()
    const [buildDashboardState, buildDashboardHandle] = useAsyncFn(
        async (clientInstance) => {
            if (clientInstance) {
                try {
                    const response = await fetch(
                        'https://api.tokeninsight.com/api/v1/simple/price?ids=ethereum%2Carweave%2Cpolygon',
                        {
                            method: 'GET',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                TI_API_KEY: 'e18963690634400785f0ecb1841b6291',
                            },
                        }
                    )
                    const { data } = await response.json()
                    const view = await getMutationState(clientInstance)
                    const [mutationBytesNum, mutationBytesLabel] =
                        bytesToReadableNumRaw(view.totalMutationBytes)
                    const [rollupBytesNum, rollupBytesLabel] =
                        bytesToReadableNumRaw(view.totalRollupBytes)
                    var totalCostInUsd = 0
                    if (selectedChain.id == 137 || selectedChain.id == 80001) {
                        totalCostInUsd =
                            data[1].price[0].price_latest *
                                Number(view.totalStorageCost) +
                            data[2].price[0].price_latest *
                                Number(view.totalEvmCost)
                    } else {
                        totalCostInUsd =
                            data[1].price[0].price_latest *
                                Number(view.totalStorageCost) +
                            data[0].price[0].price_latest *
                                Number(view.totalEvmCost)
                    }
                    const mutationAvgCost =
                        view.mutationCount == 0
                            ? 0
                            : (totalCostInUsd / view.mutationCount).toFixed(8)
                    const rollupAvgCost = getGBCost(
                        view.totalRollupRawBytes,
                        totalCostInUsd
                    )
                    const compressRatio = getCompressRatio(
                        view.totalRollupBytes,
                        view.totalRollupRawBytes
                    )

                    setDashboard({
                        mutationCount: view.mutationCount,
                        rollupCount: view.rollupCount,
                        mutationBytesNum,
                        mutationBytesLabel,
                        rollupBytesNum,
                        rollupBytesLabel,
                        mutationAvgCost,
                        rollupAvgCost,
                        compressRatio,
                        totalCostInUsd: totalCostInUsd.toFixed(2),
                    } as Dashboard)

                    const records = await scanMutationHeaders(
                        clientInstance,
                        0,
                        10
                    )
                    const current = new Date().getTime() / 1000
                    const mutations = records.map((item) => {
                        return {
                            key: item.id,
                            id: item.id,
                            sender: toHEX(item.sender),
                            time: timeDifference(current, item.time),
                            size: bytesToReadableNum(item.size),
                            action: MutationAction[item.action],
                        } as MutationHeader
                    })
                    const rollupRecords = await scanRollupRecords(
                        clientInstance,
                        0,
                        10
                    )
                    const newRecords = rollupRecords.map((record) => {
                        var cost = 0
                        if (
                            selectedChain.id == 137 ||
                            selectedChain.id == 80001
                        ) {
                            cost = getSingleRollupCost(
                                data[1].price[0].price_latest,
                                data[2].price[0].price_latest,
                                record.cost,
                                record.evmCost
                            )
                        } else {
                            cost = getSingleRollupCost(
                                data[1].price[0].price_latest,
                                data[0].price[0].price_latest,
                                record.cost,
                                record.evmCost
                            )
                        }
                        return {
                            key: record.startBlock + '_' + record.endBlock,
                            startBlock: record.startBlock,
                            endBlock: record.endBlock,
                            rawDataSize: bytesToReadableNum(record.rawDataSize),
                            compressDataSize: bytesToReadableNum(
                                record.compressDataSize
                            ),
                            mutationCount: record.mutationCount,
                            time: timeDifference(current, record.time),
                            arweaveTx: record.arweaveTx,
                            cost,
                            evmTx: record.evmTx,
                            pending: record.arweaveTx.length == 0,
                        } as RollupRecord
                    })
                    setRollupRecords(newRecords)
                    setMutations(mutations)
                } catch (e) {
                    console.log(e)
                }
            }
        },
        [selectedChain]
    )
    useEffect(() => {
        if (client) {
            buildDashboardHandle(client)
        } else {
            buildDashboardHandle(readClient)
        }
    }, [client, readClient])

    return (
        <div className="node-database">
            <div className="db3-box">
                <Descriptions
                    className="db3-banner-descriptions"
                    layout="vertical"
                    column={4}
                >
                    <Descriptions.Item label={`${dashboard.mutationCount}`}>
                        Mutations
                    </Descriptions.Item>
                    <Descriptions.Item label={`${dashboard.rollupCount}`}>
                        Rollups
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${dashboard.mutationBytesNum} ${dashboard.mutationBytesLabel}`}
                    >
                        Mutation Storage
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${dashboard.rollupBytesNum} ${dashboard.rollupBytesLabel}`}
                    >
                        Rollup Storage
                    </Descriptions.Item>
                    <Descriptions.Item label={`$${dashboard.mutationAvgCost}`}>
                        Mutation Avg Cost
                    </Descriptions.Item>
                    <Descriptions.Item label={`$${dashboard.rollupAvgCost}/GB`}>
                        Rollup Avg Cost
                    </Descriptions.Item>
                    <Descriptions.Item label={`${dashboard.compressRatio}%`}>
                        Compress Avg Ratio
                    </Descriptions.Item>
                    <Descriptions.Item label={`$${dashboard.totalCostInUsd}`}>
                        Rollup Total Cost
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <Row gutter={16}>
                <Col span={12}>
                    <List
                        header={
                            <div className="list-header">
                                <div className="list-header-title">
                                    Mutaitions
                                </div>
                                <Link to="/node/mutations">View all </Link>
                            </div>
                        }
                        dataSource={mutations}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="list-item">
                                    <div className="list-item-account">
                                        <div style={{ color: '#fff' }}>
                                            {shortString(item.id, 20)}
                                        </div>

                                        <div>{`${
                                            item.action
                                        } from ${shortString(
                                            item.sender,
                                            18
                                        )}`}</div>
                                    </div>
                                    <div className="list-item-info">
                                        <Space>
                                            <div className="list-item-size">
                                                {item.size}
                                            </div>
                                            <div className="list-item-time">
                                                {item.time}
                                            </div>
                                        </Space>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <List
                        header={
                            <div className="list-header">
                                <div className="list-header-title">Rollups</div>
                                <Link to="/node/rollup">View all </Link>
                            </div>
                        }
                        dataSource={rollupRecords}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="list-item">
                                    <div className="list-item-account">
                                        {item.pending ? (
                                            <Space className="pedding">
                                                <div>
                                                    Current Pending Rollup
                                                </div>
                                                <Icon
                                                    component={ProgressIcon}
                                                    spin={true}
                                                />
                                            </Space>
                                        ) : (
                                            <Space size="large">
                                                <Link
                                                    target="_blank"
                                                    to={`${AR_SCAN_URL}/${item.arweaveTx}`}
                                                >
                                                    {shortString(
                                                        item.arweaveTx,
                                                        12
                                                    )}
                                                </Link>
                                                <Link
                                                    target="_blank"
                                                    to={`${selectedChain?.blockExplorers?.default?.url}/tx/${item.evmTx}`}
                                                >
                                                    {shortString(
                                                        item.evmTx,
                                                        12
                                                    )}
                                                </Link>
                                            </Space>
                                        )}
                                    </div>
                                    <div className="list-item-info">
                                        <Space size="small">
                                            <div className="list-item-size">
                                                ${item.cost}
                                            </div>
                                            <div className="list-item-size">
                                                {item.rawDataSize}
                                            </div>
                                            <div className="list-item-time">
                                                {item.time}
                                            </div>
                                        </Space>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
})
export default NodeDashboard
