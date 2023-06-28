import { Button, Typography } from 'antd'
import {
    addDoc,
    createClient,
    createCollection,
    createDocumentDatabase,
    createFromPrivateKey,
    IndexType,
    queryDoc,
    getDatabase,
    getCollection,
    syncAccountNonce,
} from 'db3.js'
import React, { memo, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

import Editor from '@monaco-editor/react'

export function defaultCode() {
    return `// create client
const private_key = '0xdc6f560254643be3b4e90a6ba85138017aadd78639fbbb43c57669067c3bbe76'
const account = createFromPrivateKey(private_key)
const client = createClient(
    'https://rollup.cloud.db3.network',
    'https://index.cloud.db3.network',
    account
)
await syncAccountNonce(client)

// create a database
// const { db } = await createDocumentDatabase(client, 'desc')
// const index = { path: '/name', indexType: IndexType.StringKey}

// use your database addr
const dbAddr = "0x127ff39de458fef51d1fa9f3d3b2388ee4c43578"
// use your collection name
const colName = "col"

// get the collection instance
const  collection = await getCollection(dbAddr, colName, client)

// add a document
const {id} = await addDoc(collection, {
    name: 'book1',
    author: 'db3 developers',
    tag: 'web3',
    time: 1686285013,
})

// query document
const query = '/[name = book1]'
const resultSet = await queryDoc(collection,query) 
return resultSet;
`
}

export const Playground: React.FC<{}> = memo((props) => {
    const [excuteResult, setExcuteResult] = useState<string>('')

    const [code, setCode] = useState(defaultCode())
    const runInsertDocCode = () => {
        const AsyncFunction = Object.getPrototypeOf(
            async function () {}
        ).constructor
        const fn = new AsyncFunction(
            'createFromPrivateKey',
            'createClient',
            'createDocumentDatabase',
            'createCollection',
            'addDoc',
            'queryDoc',
            'syncAccountNonce',
            'getCollection',
            'getDatabase',
            'IndexType',
            code
        )
        fn(
            createFromPrivateKey,
            createClient,
            createDocumentDatabase,
            createCollection,
            addDoc,
            queryDoc,
            syncAccountNonce,
            getCollection,
            getDatabase,
            IndexType
        ).then((data: any) => {
            setExcuteResult(JSON.stringify(data.docs, null, '\t'))
        })
    }

    return (
        <div className="code-view" style={{ padding: 24 }}>
            <div>
                <Typography.Text>
                    This table gives the most recent erc-20 token balance of an
                    address. The data refreshes every ETH block or 13s
                </Typography.Text>
            </div>
            <div>
                <Typography.Title level={5}>Code editor</Typography.Title>
            </div>
            <div>
                <Typography.Text>
                    Only table owner have the right to write table
                </Typography.Text>
            </div>
            <Editor
                theme="vs-dark"
                height="30vh"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value!)}
            />
            <Button
                style={{
                    backgroundColor: '#1677ff',
                    color: '#fff',
                }}
                type="primary"
                size="small"
                onClick={runInsertDocCode}
            >
                Run
            </Button>
            {excuteResult && (
                <SyntaxHighlighter language="json">
                    {excuteResult}
                </SyntaxHighlighter>
            )}
        </div>
    )
})
