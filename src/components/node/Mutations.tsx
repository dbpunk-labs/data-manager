import React, { memo, useEffect } from 'react'
import { Table, Tag } from 'antd'
import sortSrc from '../../assets/sort.svg'
import { usePageContext } from '../../pages/Context'
import { useAsyncFn } from 'react-use'
import { toHEX, timeDifference, bytesToReadableNum } from '../../utils/utils'

import { MutationAction, scanMutationHeaders } from 'db3.js'

const MutaitionsTable: React.FC<{}> = memo((props) => {
    const { client, readClient, selectedChain } = usePageContext()
    const [mutations, setMutations] = React.useState<MutationHeader[]>([])
    const [getMutationState, getMutationHandle] = useAsyncFn(
        async (clientInstance) => {
            if (clientInstance) {
                try {
                    const records = await scanMutationHeaders(
                        clientInstance,
                        0,
                        20
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
                            block: item.blockId
                        } as MutationHeader
                    })
                    setMutations(mutations)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    )

    useEffect(() => {
        if (client) {
            getMutationHandle(client)
        } else {
            getMutationHandle(readClient)
        }
    }, [client, readClient])

    return (
        <div className="mutations-table">
            <Table dataSource={mutations}>
                <Table.Column title="No." dataIndex="id" sorter={true} />
                <Table.Column title="Block" dataIndex="block" sorter={true} />
                <Table.Column title="Type" dataIndex="action" sorter={true} />
                <Table.Column title="Time" dataIndex="time" sorter={true} />
                <Table.Column title="Sender" dataIndex="sender" />
                <Table.Column title="Size" dataIndex="size" />
            </Table>
        </div>
    )
})
export default MutaitionsTable
