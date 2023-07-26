import React, { memo, useEffect } from 'react'
import { useAsyncFn } from 'react-use'
import {
    Collapse,
    Button,
    Input,
    Space,
    Tabs,
    TabsProps,
    Typography,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import sortSrc from '../../assets/sort.svg'
import { usePageContext } from '../../pages/Context'
import { useMatch, Link } from 'react-router-dom'
import { getCollection, queryDoc, showCollection, getDatabase } from 'db3.js'
import ReactJson from 'react-json-view'
const { Paragraph } = Typography

const DocumentList: React.FC<{}> = memo((props) => {
    const { client } = usePageContext()
    const routeParams = useMatch('/eventdb/:addr/:name')?.params
    const [database, setDatabase] = React.useState({
        name: '',
        addr: '',
    })
    const [docs, setDocs] = React.useState<any[]>([])
    const [queryCollectionsState, queryCollections] = useAsyncFn(
        async (query: string) => {
            if (client && routeParams.addr) {
                try {
                    const db = await getDatabase(routeParams.addr, client)
                    const collections = await showCollection(db)
                    const col = collections.find(
                        (item) => item.name == routeParams.name
                    )
                    if (db.internal?.database?.oneofKind == 'eventDb') {
                        const desc = db.internal?.database?.eventDb?.desc
                        const parts = desc.split(':')
                        setDatabase({
                            name: parts[0],
                            addr: db.addr,
                        })
                    }
                    if (col) {
                        const docs = await queryDoc<any>(col, query)
                        setDocs(docs?.docs)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        [client, routeParams]
    )

    useEffect(() => {
        queryCollections('/* | limit 10')
    }, [client, routeParams])

    return (
        <div className="event-list">
            <div className="database-table-header">
                <div className="table-header-left">
                    <div className="table-header-title">
                        {database.name}/{routeParams.name}
                        <Paragraph copyable>{database.addr}</Paragraph>
                    </div>
                </div>
            </div>
            <div className="db3-box-title">Result Docs</div>
            <Collapse className="db3-collapse" bordered={false}>
                {docs?.map((item, index) => {
                    return (
                        <Collapse.Panel
                            key={index}
                            header={item.id}
                            children={
                                <ReactJson
                                    name={false}
                                    theme="tomorrow"
                                    displayDataTypes={false}
                                    displayObjectSize={false}
                                    enableClipboard={false}
                                    src={item.doc}
                                />
                            }
                        />
                    )
                })}
            </Collapse>
        </div>
    )
})
export default DocumentList
