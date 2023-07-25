import React, { memo } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined, RightOutlined } from '@ant-design/icons'
import '../../styles/Welcome.scss'

const Welcome: React.FC<{}> = memo((props) => {
    return (
        <div className="welcome">
            <div className="welcome-wall">
                <div className="wall-left">
                    <div className="welcome-wall-title">
                        Welcome to DB3 Network.
                    </div>
                    <div className="welcome-wall-content">
                        Here are some sentence to introduce this products long
                        or short.Here are some sentence to introduce this
                        products long or shortHere are some sentence to
                        introduce this products long or short Here are some
                        sentence to introduce this products long or short
                    </div>
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                        Create Dabase
                    </Button>
                </div>
                <div className="wall-right">
                    {/* <img style={{ width: 283 }} src={videoImg} /> */}
                </div>
            </div>
            <div className="example-tile">Example Application</div>
            <div className="example-list">
                <div className="example-item example1">
                    <div className="example-item-title">
                        A short introduction for this example
                    </div>
                    <Button className="db3-ghost" type="ghost">
                        Try Hello World
                    </Button>
                </div>
                <div className="example-item ">
                    <div className="example2">
                        <div className="example-item-title">
                            A short introduction for this example
                        </div>
                        <Button className="db3-ghost" type="ghost">
                            Try Todo MVC
                        </Button>
                    </div>
                </div>
            </div>
            <div className="build-title">Build</div>
            <div className="build-desc-container">
                <div className="build-desc-item">
                    <div className="build-icon build-db3js">
                    </div>
                    <div className="build-desc">
                        <div className="build-db3js-title">DB3.js Library</div>
                        <div className="build-db3js-content">
                            <div>
                                Here are some sentence to introduce this
                                products long or short.Here are some sentence
                                Here…
                            </div>
                            <RightOutlined />
                        </div>
                    </div>
                </div>
                <div className="build-desc-item">
                    <div className="build-icon build-db3js-document"></div>
                    <div className="build-desc">
                        <div className="build-db3js-title">Document</div>
                        <div className="build-db3js-content">
                            <div>
                                Here are some sentence to introduce this
                                products long or short.Here are some sentence
                                Here…
                            </div>
                            <RightOutlined />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default Welcome
