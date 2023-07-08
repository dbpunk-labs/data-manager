import { Menu } from 'antd'
import React, { memo, useEffect } from 'react'
import homeIcon from '../assets/home.svg'
import databaseIcon from '../assets/database.svg'
import eventdbIcon from '../assets/eventdb.svg'
import nodeIcon from '../assets/node.svg'
import { Link, useNavigate } from 'react-router-dom'

const LeftSider: React.FC<{}> = memo((props) => {
    const items = [
        {
            key: 'Home',
            label: <Link to="/home">Home</Link>,
            icon: <img src={homeIcon} />,
        },
        {
            key: 'Database',
            label: <Link to="/database">Database</Link>,
            icon: <img src={databaseIcon} />,
        },
        {
            key: 'EventDB',
            label: <Link to="/eventdb">EventDB</Link>,
            icon: <img src={eventdbIcon} />,
        },
        {
            key: 'Node',
            label: <Link to="/node">Node</Link>,
            icon: <img src={nodeIcon} />,
        },
    ]
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/home')
    }, [])
    return (
        <div className="left-sider">
            <Menu
                className="left-menu"
                defaultSelectedKeys={['Home']}
                mode="inline"
                items={items}
            />
        </div>
    )
})
export default LeftSider
