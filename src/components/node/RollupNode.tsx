import React, { memo, useEffect } from 'react'
import { Descriptions, Input, Table } from 'antd'
import sortSrc from '../../assets/sort.svg'
import { scanRollupRecords, getMutationState } from 'db3.js'
import { useAsyncFn } from 'react-use'
import { usePageContext } from '../../pages/Context'
import { AR_SCAN_URL } from '../../data-context/Config'
import type { RollupRecord } from './Types'
import {
    getSingleRollupCost,
    bytesToReadableNum,
    bytesToReadableNumRaw,
    timeDifference,
    getGBCost,
} from '../../utils/utils'

const RollupNode: React.FC<{}> = memo((props) => {
    const { client, readClient, selectedChain } = usePageContext()
    const [rollupRecords, setRollupRecords] = React.useState<RollupRecord[]>()
    const [rollupState, setRollupState] = React.useState({
        mutationBytesNum: '0',
        mutationBytesLabel: 'B',
        rollupBytesNum: '0',
        rollupBytesLabel: 'B',
        rollupAvgCost: '0',
        totalCostInUsd: '0',
    })
    const [buildRollupRecordsState, buildRollupRecordsHandle] = useAsyncFn(
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
                    var totalCostInUsd = 0
                    if (selectedChain.id == 137 || selectedChain.id == 80001) {
                        totalCostInUsd = (
                            data[1].price[0].price_latest *
                                Number(view.totalStorageCost) +
                            data[2].price[0].price_latest *
                                Number(view.totalEvmCost)
                        ).toFixed(2)
                    } else {
                        totalCostInUsd = (
                            data[1].price[0].price_latest *
                                Number(view.totalStorageCost) +
                            data[0].price[0].price_latest *
                                Number(view.totalEvmCost)
                        ).toFixed(2)
                    }
                    const [mutationBytesNum, mutationBytesLabel] =
                        bytesToReadableNumRaw(view.totalMutationBytes)
                    const [rollupBytesNum, rollupBytesLabel] =
                        bytesToReadableNumRaw(view.totalRollupBytes)
                    const rollupAvgCost = getGBCost(
                        view.totalRollupRawBytes,
                        totalCostInUsd
                    )
                    setRollupState({
                        mutationBytesNum,
                        mutationBytesLabel,
                        rollupBytesNum,
                        rollupBytesLabel,
                        rollupAvgCost,
                        totalCostInUsd,
                    })
                    const rollupRecords = await scanRollupRecords(
                        clientInstance,
                        0,
                        10
                    )
                    const current = new Date().getTime() / 1000
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
                            cost: '$' + cost.toString(),
                            evmTx: record.evmTx,
                            pending: record.arweaveTx.length == 0,
                        } as RollupRecord
                    })
                    console.log(newRecords)
                    setRollupRecords(newRecords)
                } catch (e) {
                    console.log(e)
                }
            } else {
                console.log('no client')
            }
        },
        [selectedChain]
    )
    useEffect(() => {
        if (client) {
            buildRollupRecordsHandle(client)
        } else {
            buildRollupRecordsHandle(readClient)
        }
    }, [client, readClient])

    return (
        <div className="rollup-node">
            <div className="db3-box">
                <Descriptions
                    className="db3-banner-descriptions"
                    layout="vertical"
                    column={4}
                >
                    <Descriptions.Item
                        label={`${rollupState?.mutationBytesNum} ${rollupState?.mutationBytesLabel}`}
                    >
                        Mutation Storage
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`${rollupState?.rollupBytesNum} ${rollupState?.rollupBytesLabel}`}
                    >
                        Rollup Storage
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`$${rollupState?.totalCostInUsd}`}
                    >
                        Total Fees
                    </Descriptions.Item>
                    <Descriptions.Item
                        label={`$${rollupState?.rollupAvgCost}/GB`}
                    >
                        Rollup Avg Cost
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <div className="table-toobar">
                <div className="table-title">Rollups</div>
                <Input.Search placeholder="Search" />
            </div>
            <Table dataSource={rollupRecords}>
                <Table.Column
                    title="Batch No."
                    dataIndex="key"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Age"
                    dataIndex="time"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Raw Size"
                    dataIndex="rawDataSize"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Compressed Size"
                    dataIndex="compressDataSize"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Mutation"
                    dataIndex="mutationCount"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Fees"
                    dataIndex="cost"
                    sorter={true}
                    sortIcon={() => <img src={sortSrc} />}
                />
                <Table.Column
                    title="Arweave Transaction"
                    dataIndex="arweaveTx"
                />
                <Table.Column
                    title={`${selectedChain?.name}`}
                    dataIndex="evmTx"
                />
            </Table>
        </div>
    )
})
export default RollupNode
