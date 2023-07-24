import { Button, Collapse, Form, Input, Modal, Select, Space } from 'antd'
import React, { memo } from 'react'
import ReactJson from 'react-json-view'

const Documents: React.FC<{}> = memo((props) => {
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
                <Collapse className="db3-collapse" bordered={false}>
                    {props.docs?.map((item, index) => {
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
        </>
    )
})
export default Documents
