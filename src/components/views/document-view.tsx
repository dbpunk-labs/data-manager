import { Button, Collapse, Input, Modal } from 'antd'
import { addDoc, queryDoc } from 'db3.js'
import React, { useEffect } from 'react'
import { usePageContext } from '../../../data-context/page-context'
import { useAsyncFn } from 'react-use'

import { PlusOutlined } from '@ant-design/icons'

export const DocumentView = (props) => {
    if (!props.collection) {
        return null
    }
    const [docs, setDocs] = React.useState<any[]>()
    const [queryStr, setQueryStr] = React.useState<string>('/* | limit 10')
    function isJsonString(str) {
        try {
            var json = JSON.parse(str)
            return typeof json === 'object'
        } catch (e) {
            return false
        }
    }
    const [loadingSearch, setLoadingSearch] = React.useState<boolean>(false)
    const onSearch = async (value: string) => {
        setLoadingSearch(true)
        await fetchData(value)
        setLoadingSearch(false)
    }

    const fetchData = async (search: string) => {
        if (!props.collection?.db) {
            return
        }
        if (!search || search.length == 0) {
            search = '/* | limit 10'
        }
        const resultSet = await queryDoc(props.collection, search)
        if (resultSet) {
            setDocs(resultSet.docs)
        }
    }
    const [showInsertDocModal, setShowInsertDocModal] =
        React.useState<boolean>(false)
    const [doc, setDoc] = React.useState<any>()
    const onInsertDoc = async () => {
        if (isJsonString(doc)) {
            var json = JSON.parse(doc)
            let r = await addDoc(props.collection, json)
            fetchData('')
            setShowInsertDocModal(false)
        } else {
            alert('Invalid JSON')
        }
    }

    useEffect(() => {
        fetchData('')
    }, [props.collection])

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    height: 36,
                }}
            >
                <div>
                    <h4
                        style={{
                            display: 'inline-block',
                            margin: 0,
                            width: 120,
                        }}
                    >
                        View Docs
                    </h4>
                    <Modal
                        title="Insert Doc"
                        open={showInsertDocModal}
                        onCancel={() => setShowInsertDocModal(false)}
                        onOk={() => {
                            onInsertDoc()
                        }}
                        okText="Insert"
                    >
                        <span>{`target :  ${props.collection?.name}`}</span>
                        <Input.TextArea
                            value={doc}
                            placeholder='{"name":"John","age":30,"cities":["New York","Beijing"]}'
                            onChange={(e) => {
                                setDoc(e.target.value)
                            }}
                        />
                    </Modal>
                    <Input.Search
                        style={{ marginBottom: 8, width: 300 }}
                        size="small"
                        placeholder="/[field = value] | limit 10"
                        loading={loadingSearch}
                        onSearch={onSearch}
                    />
                </div>
                {props.collection?.db?.internal?.database?.oneofKind ===
                    'docDb' && (
                    <>
                        <Button
                            style={{
                                marginBottom: 8,
                                backgroundColor: '#1677ff',
                                color: '#fff',
                            }}
                            size="small"
                            onClick={() => setShowInsertDocModal(true)}
                        >
                            <PlusOutlined /> Insert Document
                        </Button>
                    </>
                )}
            </div>

            {/* <Divider type="horizontal" /> */}
            <div style={{ height: '100%' }}>
                <Collapse size="small">
                    {docs?.map((item, index) => {
                        return (
                            <Collapse.Panel
                                key={index}
                                header={item.id}
                                children={
                                    <pre style={{ fontSize: 12 }}>
                                        {JSON.stringify(item, undefined, 4)}
                                    </pre>
                                }
                            />
                        )
                    })}
                </Collapse>
            </div>
        </div>
    )
}
