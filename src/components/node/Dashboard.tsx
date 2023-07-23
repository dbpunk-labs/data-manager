import React, { memo } from 'react'
import { Col, Descriptions, List, Row, Space, Table } from 'antd'
import Icon from '@ant-design/icons'

const ProgressIcon = () => (
    <svg
        className="progress-icon"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="progress-mini">
            <circle
                id="progress-circle-path"
                cx="6"
                cy="6"
                r="5"
                stroke="#94BFFF"
                stroke-width="2"
            />
            <path
                id="progress-circle-trail"
                d="M6 1C6.78905 1 7.5669 1.18675 8.26995 1.54497C8.973 1.90319 9.58129 2.42272 10.0451 3.06107C10.5089 3.69943 10.815 4.43849 10.9384 5.21783C11.0619 5.99716 10.9991 6.79465 10.7553 7.54508"
                stroke="#165DFF"
                stroke-width="2"
            />
        </g>
    </svg>
)

const NodeDashboard: React.FC<{}> = memo((props) => {
    const items = [
        {
            pedding: true,
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
                                        {item.pedding ? (
                                            <Space className="pedding">
                                                <div>
                                                    Current Pending Rollup
                                                </div>
                                                <Icon
                                                    component={ProgressIcon}
                                                    spin={true}
                                                />
                                            </Space>
                                        ) : (
                                            item.account
                                        )}
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
