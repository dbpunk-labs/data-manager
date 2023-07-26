import React, { memo } from 'react'
import { Tabs, Button, Modal, Form, Input, Typography, TabsProps } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import Events from '../components/EventDB/Events'
import EventsPlayground from '../components/EventDB/Playground'
import '../styles/EventDB.scss'
import { useNavigate } from 'react-router-dom'

const EventDB: React.FC<{}> = memo((props) => {
    const items: TabsProps['items'] = [
        {
            key: 'Events',
            label: 'Events',
            children: <Events />,
        },
        {
            key: 'Playground',
            label: 'Playground',
            children: <EventsPlayground />,
        },

        {
            key: 'Progress',
            label: 'Progress',
            children: <Events />,
        },
    ]
    const navigate = useNavigate()
    return (
        <div className="event-db">
            <Tabs
                className="db3-tabs"
                items={items}
                tabBarExtraContent={
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => navigate('/contract/create')}
                    >
                        Create Contract Indexes
                    </Button>
                }
            ></Tabs>
        </div>
    )
})
export default EventDB
