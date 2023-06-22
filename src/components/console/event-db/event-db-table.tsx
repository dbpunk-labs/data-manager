import { Button, Form, Input, Modal, Tree } from 'antd';
import React from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router';

import { PlusOutlined } from '@ant-design/icons';

export const EventDbTable = (props) => {
    const [showCreateIndexModal, setShowCreateIndexModal] =
        React.useState<boolean>(false)
    const dbId = useMatch('console/event-db/:id')

    const navigate = useNavigate()
    const navigateToEvent = (dbId: string, eventId: string) => {
        navigate(`/console/event-db/events/${dbId}/${eventId}`)
    }

    const navigateToDb = (dbId: string) => {
        navigate(`/console/event-db/events/${dbId}`)
    }

    const [dbData, setDbData] = React.useState<any[]>([
        {
            title: 'test-db',
            key: '0-0',
            id: 'db-id-1',
            children: [
                {
                    title: 'test-db-collection1',
                    key: '0-0-0',
                    id: 'collection-id-1',
                },
                {
                    title: 'test-db-collection2',
                    key: '0-0-1',
                    id: 'collection-id-2',
                },
            ],
        },
        {
            title: 'test-db-2',
            id: 'db-id-2',
            key: '0-1',
            children: [
                {
                    title: 'test-db-2-collection1',
                    id: '2-collection-id-1',
                    key: '0-1-0',
                },
                {
                    title: 'test-db-2-collection2',
                    key: '0-1-1',
                    id: '2-collection-id-2',
                },
            ],
        },
    ])

    const [createDBForm] = Form.useForm()

    const onCreateDatabase = () => {
        // TODO
        const values = createDBForm.getFieldsValue()
        console.log(values)
        setShowCreateIndexModal(false)
    }

    const onSelect = (e) => {
        const key = e[0]
        const db = dbData.find((item) => item.key === key)
        if (db) {
            navigateToDb(db.id)
        } else {
            dbData.map((db) => {
                const collection = db.children.find((item) => item.key === key)
                if (collection) navigateToEvent(db.id, collection.id)
            })
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '20px 20px',
                height: '100%',
                borderRight: '1px solid rgba(5, 5, 5, 0.06)',
            }}
        >
            <div
                style={{ display: 'flex', flexDirection: 'column', width: 200 }}
            >
                <div>
                    <Button
                        style={{ marginBottom: 8 }}
                        size="small"
                        onClick={() => {
                            setShowCreateIndexModal(true)
                        }}
                    >
                        <PlusOutlined /> Create Contract Indexer
                    </Button>
                    <Input.Search style={{ marginBottom: 8 }} size="small" />
                    <Modal
                        title="Create Contract Indexer"
                        open={showCreateIndexModal}
                        onOk={() => {
                            onCreateDatabase()
                        }}
                        onCancel={() => setShowCreateIndexModal(false)}
                    >
                        <Form form={createDBForm}>
                            <Form.Item required={true} label="Name" key="name">
                                <Input />
                            </Form.Item>
                            <Form.Item
                                required={true}
                                label="Contract address"
                                key="address"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                required={true}
                                label="Chain Id"
                                key="id"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                required={true}
                                label="Provider"
                                key="provider"
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div>
                    <Tree
                        showLine={false}
                        showIcon={false}
                        defaultExpandedKeys={['0-0-0']}
                        onSelect={onSelect}
                        treeData={dbData}
                    />
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'calc(100% - 200px)',
                }}
            >
                <Outlet />
            </div>
        </div>
    )
}
