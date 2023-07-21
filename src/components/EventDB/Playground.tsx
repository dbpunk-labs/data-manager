import React, { memo } from 'react'
import { Input, Tree, Button } from 'antd'
import doclink from '../../assets/doclink.svg'

const EventsPlayground: React.FC<{}> = memo((props) => {
    return (
        <div className="events-playground">
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
                    <div className="db3-box-title-large">Read Data</div>
                    <a className="docs-link">
                        <img src={doclink} />
                        Docs
                    </a>
                </div>
                <div className="db3-box-title">Typescript Code</div>
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
export default EventsPlayground
