import { PlusOutlined } from '@ant-design/icons'

import { Collapse, Input } from 'antd'
import { queryDoc } from 'db3.js'
import React, { useEffect } from 'react'

export const DocumentView = (props) => {
    const [docs, setDocs] = React.useState<any[]>([])
    const [queryStr, setQueryStr] = React.useState<string>('/* | limit 10')

    const fetchData = async () => {
        console.log(queryStr)

        const resultSet = await queryDoc(props.collection, queryStr)
        if (resultSet) {
            setDocs(resultSet.docs)
        }
    }
    useEffect(() => {
        fetchData()
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
                <h4 style={{ display: 'inline-block', margin: 0 }}>
                    View Docs
                </h4>
                <Input.Search
                    style={{ marginBottom: 8, width: 300 }}
                    size="small"
                    placeholder="/[field=value] | limit 10]"
                    onPressEnter={(e) => {
                        setQueryStr(e.target.value)
                    }}
                />
            </div>
            {/* <Divider type="horizontal" /> */}
            <Collapse size="small">
                {docs.map((item, index) => {
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
    )
}
