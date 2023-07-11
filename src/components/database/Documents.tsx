import { Button, Collapse, Form, Input, Modal, Select, Space } from 'antd'
import React, { memo } from 'react'
import ReactJson from 'react-json-view'

const Documents: React.FC<{}> = memo((props) => {
    const json = {
        name: 'muran',
        time: 1999,
        content: 'hello world',
        followers: ['a', 'b', 'c'],
        map: { k1: 'v1', k2: 'v2' },
    }
    return (
        <>
            <div className="documents">
                <div className="db3-box">
                    <div className="db3-space">
                        <div className="db3-label">Filter</div>
                        <Input className="db3-input" />
                        <Button type="ghost" className="db3-ghost">
                            Query
                        </Button>
                    </div>
                </div>
                <div className="db3-box-title">Result Docs</div>
                <Collapse
                    className="db3-collapse"
                    bordered={false}
                    items={[
                        {
                            key: '1',
                            label: 'id_124',
                            children: (
                                <ReactJson
                                    displayDataTypes={false}
                                    displayObjectSize={false}
                                    src={json}
                                    theme="monokai"
                                />
                            ),
                        },
                        {
                            key: '2',
                            label: 'id_1245',
                            children: <ReactJson src={json} theme="monokai" />,
                        },
                    ]}
                />
            </div>
        </>
    )
})
export default Documents
