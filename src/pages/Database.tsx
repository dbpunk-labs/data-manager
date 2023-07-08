import React, { memo } from 'react'
import { Button, Tabs, TabsProps } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import '../styles/Database.scss'
import DatabaseManage from '../components/database/DatabaseManage'

const Database: React.FC<{}> = memo((props) => {
    const items: TabsProps['items'] = [
        {
            key: 'Database',
            label: 'Database',
            children: <DatabaseManage />,
        },
        {
            key: 'Playground',
            label: 'Playground',
        },
    ]
    return (
        <div className="database">
            <Tabs
                items={items}
                tabBarExtraContent={
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                        Create Dabase
                    </Button>
                }
            ></Tabs>
        </div>
    )
})
export default Database
