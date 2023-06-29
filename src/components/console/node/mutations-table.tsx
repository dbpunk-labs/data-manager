import { Pagination, Table, Typography } from 'antd'
import CountUp from 'react-countup'
import { Avatar, List } from 'antd'
import {
    LoadingOutlined,
    FieldTimeOutlined,
    TransactionOutlined,
    DatabaseOutlined,
    LikeOutlined,
    MessageOutlined,
    StarOutlined,
    DollarOutlined
} from '@ant-design/icons'

import { Space, Col, Row, Statistic } from 'antd'
import React, { useEffect } from 'react'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'
import {
    timeDifference,
    bytesToReadableNum,
    bytesToReadableNumRaw,
    unitsToReadableNum,
    evmUnitsToReadableNum,
    shortString,
} from '../../../utils/utils'
import {
    scanRollupRecords,
    scanMutationHeaders,
    getMutationBody,
    MutationAction,
    getMutationState,
    MutationStateView,
} from 'db3.js'
import { AR_SCAN_URL, EVM_SCAN_URL } from '../../../data-context/config'

interface MutationHeader {
    id: string
    time: string
    sender: string
    size: number
    key: string
    action: string
}

interface RollupRecord {
    startBlock: string
    endBlock: string
    rawDataSize: string
    compressDataSize: string
    arweaveTx: string
    mutationCount: string
    time: string
    evmTx: string
    key: string
    pending: boolean
    cost: string
}

interface Dashboard {
    mutationCount: string
    rollupCount: string
    mutationBytesNum: number
    mutationBytesLabel: string
    rollupBytesNum: number
    rollupBytesLabel: string
    mutationAvgCost: string
    rollupStorageCost: string
    compressRatio: string
    totalCostInUsd: string
}

function toHEX(bytes: Uint8Array): string {
    return (
        '0x' +
        bytes.reduce(
            (str, byte) => str + byte.toString(16).padStart(2, '0'),
            ''
        )
    )
}

function getCompressRatio(totalRollupBytes: string, totalRawDataBytes: string) {
    const totalRollupBytesNum = new Number(totalRollupBytes)
    const totalRollupRawBytesNum = new Number(totalRawDataBytes)
    if (totalRollupRawBytesNum == 0 || totalRollupBytesNum == 0) return 0
    return ((totalRollupBytes * 100.0) / totalRollupRawBytesNum).toFixed(2)
}

function getGBCost(totalBytes: string, totalCostInUsd: number) {
    const totalBytesNum = new Number(totalBytes)
    if (totalCostInUsd == 0 || totalBytesNum == 0) return 0
    const gb = 1024 * 1024 * 1024
    if (totalBytesNum < gb) {
        return (((gb * 1.0) / totalBytesNum) * totalCostInUsd).toFixed(4)
    } else {
        return (totalCostInUsd / ((totalBytesNum * 1.0) / gb)).toFixed(4)
    }
}

function getSingleRollupCost(arPrice:number, evmTokenPrice:number,
                             arUnits:string, evmUnits:string) {
    return ((Number(BigInt(arUnits) / BigInt(1000_000)) / 1000_000.0) * arPrice
    + 
        (Number(BigInt(evmUnits) / BigInt(1000_000_000)) / 1000_000_000.0) * evmTokenPrice).toFixed(6)
}

export const MutationsTable = () => {
    const { client } = usePageContext()
    const [dashboard, setDashboard] = React.useState<Dashboard>({})
    const [mutations, setMutations] = React.useState<any[]>([])
    const [rollupRecords, setRollupRecords] = React.useState<RollupRecord[]>()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [fetchDataRet, fetchDataFn] = useAsyncFn(async () => {
        if (client) {
            try {
                const response = await fetch(
                    'https://api.tokeninsight.com/api/v1/simple/price?ids=arweave%2Cpolygon',
                    {
                        method: 'GEt',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            TI_API_KEY: 'e18963690634400785f0ecb1841b6291',
                        },
                    }
                )
                const { data } = await response.json()
                setIsLoading(true)
                const view = await getMutationState(client)

                const [mutationBytesNum, mutationBytesLabel] =
                    bytesToReadableNumRaw(view.totalMutationBytes)

                const [rollupBytesNum, rollupBytesLabel] =
                    bytesToReadableNumRaw(view.totalRollupBytes)

                const totalCostInUsd =
                    data[0].price[0].price_latest *
                        Number(view.totalStorageCost) +
                    data[1].price[0].price_latest * Number(view.totalEvmCost)

                console.log(totalCostInUsd)
                const mutationAvgCost = (
                    totalCostInUsd / view.mutationCount
                ).toFixed(8)
                const rollupStorageCost = getGBCost(
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
                    rollupStorageCost,
                    compressRatio,
                    totalCostInUsd: totalCostInUsd.toFixed(2)
                } as Dashboard)
                const records = await scanMutationHeaders(client, 0, 10)
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
                const rollupRecords = await scanRollupRecords(client, 0, 20)
                const newRecords = rollupRecords.map((record) => {
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
                        cost: getSingleRollupCost(data[0].price[0].price_latest, 
                                                  data[1].price[0].price_latest,
                                                  record.cost, record.evmCost),
                        evmTx: record.evmTx,
                        pending: record.arweaveTx.length == 0,
                    } as RollupRecord
                })
                setRollupRecords(newRecords)
                setIsLoading(false)
                setMutations(mutations)
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('no client')
        }
    }, [client])

    useEffect(() => {
        fetchDataFn()
    }, [client])

    const formatter = (value: number) => <CountUp end={value} separator="," />
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    )

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={[32, 32]}>
                <Col span={6}>
                    <Statistic
                        title="Mutations"
                        value={dashboard.mutationCount}
                    />
                </Col>

                <Col span={6}>
                    <Statistic title="Rollups" value={dashboard.rollupCount} />
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Mutation Storage"
                        value={dashboard.mutationBytesNum}
                        suffix={dashboard.mutationBytesLabel}
                    />
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Rollup Storage"
                        value={dashboard.rollupBytesNum}
                        suffix={dashboard.rollupBytesLabel}
                    />
                </Col>
            </Row>

            <Row gutter={[32, 32]}>
                <Col span={6}>
                    <Statistic
                        title="Mutation Avg Cost"
                        value={dashboard.mutationAvgCost}
                        prefix="$"
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Rollup Avg Cost"
                        prefix="$"
                        value={dashboard.rollupStorageCost}
                        suffix="/GB"
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Compress Avg Ratio"
                        value={dashboard.compressRatio}
                        suffix="%"
                    />
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Rollup Total Cost"
                        prefix="$"
                        value={dashboard.totalCostInUsd}
                    />

                </Col>
            </Row>

            <Row gutter={[32, 32]}>
                <Col span={12}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Mutations
                    </Typography.Title>

                    <List
                        itemLayout="horizontal"
                        dataSource={mutations}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    <IconText
                                        icon={DatabaseOutlined}
                                        text={item.size}
                                        key="list-vertical-star-o"
                                    />,
                                    <IconText
                                        icon={FieldTimeOutlined}
                                        text={item.time}
                                        key="list-vertical-star-o"
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <a href={`${item.id}`}>
                                            {shortString(item.id, 20)}
                                        </a>
                                    }
                                    description={`${
                                        item.action
                                    } from ${shortString(item.sender, 18)}`}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Rollups
                    </Typography.Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={rollupRecords}
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[
                                    <IconText
                                        icon={DatabaseOutlined}
                                        text={`${item.compressDataSize}/${item.rawDataSize}`}
                                        key="list-vertical-star-o"
                                    />,
                                    <IconText
                                        icon={DollarOutlined}
                                        text={item.cost}
                                        key="list-vertical-like-o"
                                    />,
                                    <IconText
                                        icon={FieldTimeOutlined}
                                        text={item.time}
                                        key="list-vertical-star-o"
                                    />,
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        item.pending ? (
                                            <Space size="large">
                                                Current Pending Rollup{' '}
                                                <LoadingOutlined />
                                            </Space>
                                        ) : (
                                            <Space size="large">
                                                <a
                                                    href={`${AR_SCAN_URL}${item.arweaveTx}`}
                                                >
                                                    {shortString(
                                                        item.arweaveTx,
                                                        12
                                                    )}
                                                </a>
                                                <a
                                                    href={`${EVM_SCAN_URL}${item.evmTx}`}
                                                >
                                                    {shortString(
                                                        item.evmTx,
                                                        12
                                                    )}
                                                </a>
                                            </Space>
                                        )
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
}
