import { Menu } from 'antd'
import React, { memo, useEffect } from 'react'
import homeIcon from '../assets/home.svg'
import homeActiveIcon from '../assets/home-active.svg'
import databaseIcon from '../assets/database.svg'
import databaseActiveIcon from '../assets/database-active.svg'
import eventdbIcon from '../assets/eventdb.svg'
import eventActiveIcon from '../assets/eventdb-active.svg'
import nodeIcon from '../assets/node.svg'
import nodeActiveIcon from '../assets/node-active.svg'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const LeftSider: React.FC<{}> = memo((props) => {
    const [currentKey, setCurrentKey] = React.useState('Home')
    const items = [
        {
            key: 'Home',
            label: <Link to="/home">Home</Link>,
            icon: (
                <img src={currentKey === 'Home' ? homeActiveIcon : homeIcon} />
            ),
        },
        {
            key: 'Database',
            label: <Link to="/database">Database</Link>,
            icon: (
                <img
                    src={
                        currentKey === 'Database'
                            ? databaseActiveIcon
                            : databaseIcon
                    }
                />
            ),
        },
        {
            key: 'EventDB',
            label: <Link to="/eventdb">EventDB</Link>,
            icon: (
                <img
                    src={
                        currentKey === 'EventDB' ? eventActiveIcon : eventdbIcon
                    }
                />
            ),
        },
        {
            key: 'Node',
            label: <Link to="/node/dashboard">Node</Link>,
            icon: (
                <img src={currentKey === 'Node' ? nodeActiveIcon : nodeIcon} />
            ),
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
                onSelect={({ key }) => setCurrentKey(key)}
                mode="inline"
                items={items}
            />
        </div>
    )
})
export default LeftSider
