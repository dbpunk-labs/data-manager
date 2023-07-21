import React, { memo } from 'react'
import { Col, Descriptions, List, Row, Space, Table } from 'antd'

const NodeDashboard: React.FC<{}> = memo((props) => {
    const items = [
        {
            account: 'AddDocument from Oxefe5c7d...9ea051c82',
            size: '1.2 KB',
            time: '9 min ago',
        },
        {
            account: 'AddDocument from Oxefe5c7d...9ea051c82',
            size: '1.2 KB',
            time: '9 min ago',
        },
        {
            account: 'AddDocument from Oxefe5c7d...9ea051c82',
            size: '1.2 KB',
            time: '9 min ago',
        },
    ]

    return (
        <div className="node-database">
            <div className="db3-box">
                <Descriptions
                    className="db3-banner-descriptions"
                    layout="vertical"
                    column={4}
                >
                    <Descriptions.Item label="26,978">
                        Mutations
                    </Descriptions.Item>
                    <Descriptions.Item label="1">Rollups</Descriptions.Item>
                    <Descriptions.Item label="21.61 MB">
                        Mutation Storage
                    </Descriptions.Item>
                    <Descriptions.Item label="2.14 MB">
                        Mutation Storage
                    </Descriptions.Item>
                    <Descriptions.Item label="0.00002883 $">
                        Mutations
                    </Descriptions.Item>
                    <Descriptions.Item label="38.6067">
                        Rollup Avg Cost
                    </Descriptions.Item>
                    <Descriptions.Item label="10.36 %">
                        Compressive Avg Rollup
                    </Descriptions.Item>
                </Descriptions>
            </div>
            <Row gutter={16}>
                <Col span={12}>
                    <List
                        header={
                            <div className="list-header">
                                <div className="list-header-title">
                                    Mutaitions
                                </div>
                                <a>view All</a>
                            </div>
                        }
                        dataSource={items}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="list-item">
                                    <div className="list-item-account">
                                        {item.account}
                                    </div>
                                    <div className="list-item-info">
                                        <Space>
                                            <div className="list-item-size">
                                                {item.size}
                                            </div>
                                            <div className="list-item-time">
                                                {item.time}
                                            </div>
                                        </Space>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={12}>
                    <List
                        header={
                            <div className="list-header">
                                <div className="list-header-title">Rollups</div>
                                <a>view All</a>
                            </div>
                        }
                        dataSource={items}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="list-item">
                                    <div className="list-item-account">
                                        {item.account}
                                    </div>
                                    <div className="list-item-info">
                                        <Space>
                                            <div className="list-item-size">
                                                {item.size}
                                            </div>
                                            <div className="list-item-time">
                                                {item.time}
                                            </div>
                                        </Space>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    )
})
export default NodeDashboard
