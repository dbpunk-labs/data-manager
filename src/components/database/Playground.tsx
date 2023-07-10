import React, { memo } from 'react'
import doclink from '../../assets/doclink.svg'
import { Button, Col, Form, Row, Select } from 'antd'

const Playground: React.FC<{}> = memo((props) => {
    return (
        <div className="playground">
            <div className="db3-box">
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Database Address">
                                <Select>
                                    <Select.Option value="demo">
                                        DEMO
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Collection">
                                <Select></Select>
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
                    <div className="db3-box-title-large">Write Data</div>
                    <a className="docs-link">
                        <img src={doclink} />
                        Docs
                    </a>
                </div>
                <div className="db3-box-title">Code</div>
                <div className="db3-box-code">
                    <pre>
                        <code>
                            {
                                'const result = await doc_store.insertDocs(doc_index, [transacion], _sign, 1);'
                            }
                        </code>
                    </pre>
                </div>
                <Button type="primary" style={{ marginBottom: 32 }}>
                    Run
                </Button>
                <div className="db3-box-title">Result</div>
                <div className="db3-box-code">
                    <pre>
                        <code>
                            {
                                'const result = await doc_store.insertDocs(doc_index, [transacion], _sign, 1);'
                            }
                        </code>
                    </pre>
                </div>
            </div>
            <div className="db3-box">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                    }}
                >
                    <div className="db3-box-title-large">Write Data</div>
                    <a className="docs-link">
                        <img src={doclink} />
                        Docs
                    </a>
                </div>
                <div className="db3-box-title">Code</div>
                <div className="db3-box-code">
                    <pre>
                        <code>
                            {
                                'const result = await doc_store.insertDocs(doc_index, [transacion], _sign, 1);'
                            }
                        </code>
                    </pre>
                </div>
                <Button type="primary" style={{ marginBottom: 32 }}>
                    Run
                </Button>
                <div className="db3-box-title">Result</div>
                <div className="db3-box-code">
                    <pre>
                        <code>
                            {
                                'const result = await doc_store.insertDocs(doc_index, [transacion], _sign, 1);'
                            }
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
})
export default Playground
