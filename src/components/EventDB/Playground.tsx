import React, { memo, useEffect } from 'react'
import { Form, Row, Col, Select, Input, Tree, Button } from 'antd'
import doclink from '../../assets/doclink.svg'
import { usePageContext } from '../../pages/Context'
import { chainToNodes } from '../../data-context/Config'
import { useAccount, useNetwork } from 'wagmi'
import {
    createRandomAccount,
    createClient,
    getCollection,
    addDoc,
    showDatabase,
    showCollection,
    Database,
    syncAccountNonce,
    Collection,
    queryDoc,
} from 'db3.js'
import { useAsyncFn } from 'react-use'
import Editor from '@monaco-editor/react'
import ReactJson from 'react-json-view'

interface CollectionRecord {
    value: string
    label: string
    collection: Collection
}
interface DatabaseRecord {
    value: string
    label: string
    db: Database
    collections: CollectionRecord[]
}
function generateQueryCode(addr, col, rollup, index) {
    return `
const account = createRandomAccount()
const client = createClient("${rollup}", 
                           "${index}",
                           account)
const collection = await getCollection("${addr}", "${col}", client)
const result = await queryDoc(collection, '/* | limit 2')
return result.docs
   `
}

const EventsPlayground: React.FC<{}> = memo((props) => {
    const editorOptions = {
        selectOnLineNumbers: false,
        lineNumbers: 'off',
        roundedSelection: false,
        scrollBeyondLastLine: false,
    }
    const { chain } = useNetwork()
    const { client } = usePageContext()
    const { address, isConnecting, isDisconnected } = useAccount()
    const [colName, setCurrentColName] = React.useState('')
    const [record, setCurrentRecords] = React.useState<DatabaseRecord>({})
    const [records, setRecords] = React.useState<DatabaseRecord[]>([])
    const [queryCode, setQueryCode] = React.useState('')
    const [queryCodeResult, setRunQueryCodeResult] = React.useState({})
    const [runQueryCodeState, runQueryCode] = useAsyncFn(async () => {
        if (queryCode && record && colName.length > 0) {
            try {
                const AsyncFunction = Object.getPrototypeOf(
                    async function () {}
                ).constructor
                const fn = new AsyncFunction(
                    'createRandomAccount',
                    'createClient',
                    'getCollection',
                    'queryDoc',
                    queryCode
                )
                const data = await fn(
                    createRandomAccount,
                    createClient,
                    getCollection,
                    queryDoc
                )
                setRunQueryCodeResult(data)
            } catch (e) {
                console.log(e)
            }
        }
    }, [queryCode, record, colName])

    const [getRecordsState, getRecords] = useAsyncFn(async () => {
        if (client && address) {
            try {
                const databases = await showDatabase(address, client)
                const eventDatabases = databases.filter(
                    (item) => item.internal?.database?.oneofKind === 'eventDb'
                )
                const records = await Promise.all(
                    eventDatabases.map(async (item) => {
                        try {
                            const collections = await showCollection(item)
                            const desc = item.internal?.database?.eventDb?.desc
                            const name = desc.split(':')[0]
                            return {
                                value: item.addr,
                                label: name,
                                db: item,
                                collections: collections.map((item) => {
                                    return {
                                        value: item.name,
                                        lable: item.name,
                                        collection: item,
                                    } as CollectionRecord
                                }),
                            } as DatabaseRecord
                        } catch (e) {
                            console.log(e)
                        }
                    })
                )
                setRecords(records)
                if (records.length > 0) {
                    setCurrentRecords(records[0])
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, [client, address])
    const updateCurrentRecord = (value: string) => {
        const currentRecord = records.find((item) => item.value === value)
        setCurrentRecords(currentRecord)
    }

    const updateAllCode = (value: string) => {
        if (chain && record && value) {
            const node = chainToNodes.find((item) => {
                return item.chainId == chain?.id
            })
            const queryCode = generateQueryCode(
                record.value,
                value,
                node.dataRollupUrl,
                node.dataIndexUrl
            )
            setQueryCode(queryCode)
        }
    }

    useEffect(() => {
        getRecords()
    }, [client, address])

    return (
        <div className="events-playground">
            <div className="db3-box">
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Database Address">
                                <Select
                                    options={records}
                                    onChange={(value) =>
                                        updateCurrentRecord(value)
                                    }
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Collection">
                                <Select
                                    options={record?.collections}
                                    onChange={(value) => {
                                        setCurrentColName(value)
                                        updateAllCode(value)
                                    }}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="db3-box">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                    }}
                >
                    <div className="db3-box-title-large">Query documents</div>
                    <a
                        className="docs-link"
                        href="https://docs.db3.network/functions/queryDoc.html"
                        target="_blank"
                    >
                        <img src={doclink} />
                        Docs
                    </a>
                </div>
                <div className="db3-box-title">Code</div>
                <div className="db3-box-code">
                    {colName && colName.length > 0 && (
                        <Editor
                            theme="vs-dark"
                            height="12vh"
                            defaultLanguage="typescript"
                            value={queryCode}
                            options={editorOptions}
                            onChange={(value) => setQueryCode(value!)}
                        />
                    )}
                </div>
                <Button
                    type="primary"
                    style={{ marginBottom: 32 }}
                    disabled={!(colName && colName.length > 0)}
                    onClick={(e) => runQueryCode()}
                    loading={runQueryCodeState.loading}
                >
                    Run
                </Button>
                <div className="db3-box-title">Result</div>
                <div className="db3-box-code">
                    {queryCodeResult &&
                        Object.keys(queryCodeResult).length > 0 && (
                            <ReactJson
                                name={false}
                                theme="tomorrow"
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={false}
                                src={queryCodeResult}
                            />
                        )}
                </div>
            </div>
        </div>
    )
})
export default EventsPlayground
