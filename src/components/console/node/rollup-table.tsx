import { Table } from 'antd'
import { scanRollupRecords } from 'db3.js'
import React, { useEffect } from 'react'
import { Client } from '../../../data-context/client'
import { useAsyncFn } from 'react-use'

function bytesToReadableNum(bytes_size_str: string): string {
    const bytes_size = Number(bytes_size_str)
    const STORAGE_LABELS: string[] = [' ', 'K', 'M', 'G', 'T', 'P', 'E']
    const max_shift = 7
    var shift = 0
    var local_bytes_size = bytes_size
    var value = bytes_size
    local_bytes_size >>= 10
    while (local_bytes_size > 0 && shift < max_shift) {
        value /= 1024.0
        shift += 1
        local_bytes_size >>= 10
    }
    return value.toFixed(2) + STORAGE_LABELS[shift]
}

function unitsToReadableNum(units: string): string {
    return (Number(BigInt(units) / BigInt(1000_000)) / 1000_000.0).toFixed(6)
}

function evmUnitsToReadableNum(units: string): string {
    return (
        Number(BigInt(units) / BigInt(1000_000_000)) / 1000_000_000.0
    ).toFixed(6)
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

interface RollupRecord {
    startBlock: string
    endBlock: string
    rawDataSize: string
    compressDataSize: string
    arweaveTx: string
    mutationCount: string
    arCost: string
    time: string
    evmCost: string
    evmTx: string
}

export const RollupTable = () => {
    const [rollupRecords, setRollupRecords] = React.useState<RollupRecord[]>()
    const [inited, setInited] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [loadRecordsRef, loadRecordsFn] = useAsyncFn(async () => {
        await Client.init()
        const client = Client.instance
        const records = await scanRollupRecords(client!, 0, 20)
        const newRecords = records.map((record) => {
            return {
                startBlock: record.startBlock,
                endBlock: record.endBlock,
                rawDataSize: bytesToReadableNum(record.rawDataSize),
                compressDataSize: bytesToReadableNum(record.compressDataSize),
                mutationCount: record.mutationCount,
                arCost: unitsToReadableNum(record.cost),
                time: record.time,
                arweaveTx: record.arweaveTx,
                evmCost: evmUnitsToReadableNum(record.evmCost),
                evmTx: record.evmTx,
            } as RollupRecord
        })
        setRollupRecords(newRecords)
    })
    if (!inited) {
        setIsLoading(true)
        setInited(true)
        loadRecordsFn()
        setIsLoading(false)
    }

    return (
        <div style={{ padding: 20 }}>
            <Table
                size="small"
                loading={isLoading}
                dataSource={rollupRecords}
                columns={[
                    {
                        dataIndex: 'startBlock',
                        title: 'Start Block',
                    },
                    {
                        dataIndex: 'endBlock',
                        title: 'End Block',
                    },
                    {
                        dataIndex: 'rawDataSize',
                        title: 'Raw Data Size',
                    },
                    {
                        dataIndex: 'compressDataSize',
                        title: 'Compressed Data Size',
                    },
                    {
                        dataIndex: 'mutationCount',
                        title: 'Mutations',
                    },
                    {
                        dataIndex: 'arCost',
                        title: 'Ar Cost',
                    },
                    {
                        dataIndex: 'arweaveTx',
                        title: 'Ar tx',
                    },
                    {
                        dataIndex: 'evmCost',
                        title: 'Evm Cost',
                    },
                    {
                        dataIndex: 'evmTx',
                        title: 'Evm tx',
                    },
                    {
                        dataIndex: 'time',
                        title: 'Time',
                    },
                ]}
            />
        </div>
    )
}
