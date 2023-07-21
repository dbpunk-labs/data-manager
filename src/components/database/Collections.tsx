import React, { memo, useEffect } from 'react'
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Table,
    Tree,
    Typography,
} from 'antd'

import { PlusCircleOutlined } from '@ant-design/icons'
import sortSrc from '../../assets/sort.svg'
import { usePageContext } from '../../pages/Context'
import {
    useNetwork,
    useContractWrite,
    useAccount,
    useContractEvent,
} from 'wagmi'
import { useAsyncFn } from 'react-use'
import { stringToHex } from 'viem'
import {
    showDatabase,
    showCollection,
    db3MetaStoreContractConfig,
    Collection,
} from 'db3.js'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { chainToNodes } from '../../data-context/Config'
const { Option } = Select

interface DatabaseNameAddress {
    label: string
    value: string
    desc: string
}

const { Paragraph } = Typography
const Collections: React.FC<{}> = memo((props) => {
    const { address, isConnecting, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const routeParams = useMatch('/database/:addr')?.params
    const createCollectionHandle = useContractWrite(
        {
            address: chainToNodes.find((item) => item.chainId === chain.id)
                ?.contractAddr,
            abi: db3MetaStoreContractConfig.abi,
            functionName: 'createCollection',
        },
        [chain]
    )
    const [collections, setCollections] = React.useState<any[]>([])
    const [currentDatabaseName, setCurrentDatabaseName] = React.useState({})
    const [databaseNames, setDatabaseNames] = React.useState<
        DatabaseNameAddress[]
    >([])
    const [databaseStatus, setDatabaseStatus] = React.useState({})
    const [collectionForm, setCollectionForm] = React.useState({
        name: '',
        addr: '',
        licence: '',
        licenceUrl: '',
    })
    const { client, networkId } = usePageContext()
    const [queryDatabaseStatusState, queryDatabaseStatus] =
        useAsyncFn(async () => {
            if (client && routeParams.addr) {
                try {
                    const databases = await showDatabase(address, client)
                    const db = databases.find(
                        (item) => item.addr === routeParams.addr
                    )
                    setCollections(
                        (await showCollection(db)).map((item) => {
                            return {
                                key: item.name,
                                name: item.name,
                                documents: item.state.totalDocCount,
                                size: 0,
                                index: item.internal?.indexFields.length,
                            }
                        })
                    )
                    const docDatabases = databases.filter(
                        (item) => item.internal?.database?.oneofKind === 'docDb'
                    )
                    const dbNames = docDatabases.map((item) => {
                        const desc = item.internal?.database?.docDb?.desc
                        const parts = desc.split(':')
                        return {
                            label: parts[0],
                            value: item.addr,
                            desc: parts[1],
                        }
                    })
                    const currentName = dbNames.find(
                        (item) => item.value === routeParams.addr
                    )
                    setDatabaseNames(dbNames)
                    setCurrentDatabaseName(currentName)
                    setCollectionForm({
                        name: '',
                        addr: routeParams.addr,
                        licence: 'udl',
                        licenceUrl: 'udl_url',
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }, [client, routeParams, address])

    useEffect(() => {
        queryDatabaseStatus()
    }, [client, routeParams])

    const [visible, setVisible] = React.useState(false)
    function tableOnChange(
        pagination,
        filters,
        sorter,
        extra: { currentDataSource: []; action: 'paginate' | 'sort' | 'filter' }
    ) {
        // 分页
        // 排序
    }
    return (
        <>
            <div className="collections">
                <div className="database-table-header">
                    <div className="table-header-left">
                        <div className="table-header-title">
                            {currentDatabaseName.label}
                            <Paragraph copyable>
                                {currentDatabaseName.value}
                            </Paragraph>
                        </div>
                        <div className="table-header-desc">
                            {currentDatabaseName.desc}
                        </div>
                    </div>
                    <div className="table-header-right">
                        <Button
                            type="ghost"
                            className="db3-ghost"
                            icon={<PlusCircleOutlined />}
                            onClick={() => setVisible(true)}
                        >
                            Create Collection
                        </Button>
                    </div>
                </div>
                <Table dataSource={collections} onChange={tableOnChange}

                   columns= {[
                            {
                                dataIndex: 'name',
                                title: 'Collection Name',
                                render: (text: string, record) => (
                                    <Link
                                        to={`/database/${routeParams.addr}/${record.name}`}
                                    >
                                        {text}
                                    </Link>
                                ),
                                sorter: true,
                                sortIcon: ()=> <img src={sortSrc} />
                            },
                            {
                                dataIndex: 'documents',
                                title: 'Documents',
                                sorter: true,
                                sortIcon: ()=> <img src={sortSrc} />
                            },
                            {
                                dataIndex: 'size',
                                title: 'Total Size',
                                sorter: true,
                                sortIcon: ()=> <img src={sortSrc} />
                            },
                            {
                                dataIndex: 'index',
                                title: 'Indexes',
                                sorter: true,
                                sortIcon: ()=> <img src={sortSrc} />
                            }


                   ]}
                />
            </div>
            <Modal
                className="db3-modal"
                title="Create Collection"
                open={visible}
                onCancel={() => setVisible(false)}
                confirmLoading={createCollectionHandle?.isLoading}
                onOk={() => {
                    createCollectionHandle.write({
                        args: [
                            networkId,
                            collectionForm.addr,
                            stringToHex(collectionForm.name, { size: 32 }),
                            stringToHex(collectionForm.licence, { size: 32 }),
                            stringToHex(collectionForm.licenceUrl, {
                                size: 32,
                            }),
                        ],
                    })
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="Database">
                        <Select
                            options={databaseNames}
                            defaultValue={currentDatabaseName}
                            onChange={(value) =>
                                setCollectionForm({
                                    ...collectionForm,
                                    addr: value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Collection Name">
                        <Input
                            value={collectionForm.name}
                            onChange={(e) =>
                                setCollectionForm({
                                    ...collectionForm,
                                    name: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
})
export default Collections
