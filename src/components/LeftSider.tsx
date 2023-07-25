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
    const location = useLocation()
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
    useEffect(()=>{
        if (location.pathname.startsWith("/home")) {
            setCurrentKey("Home")
        }else if (location.pathname.startsWith("/database")) {
            setCurrentKey("Database")
        }
        else if (location.pathname.startsWith("/eventdb")) {
            setCurrentKey("EventDB")
        }
        else if (location.pathname.startsWith("/node")) {
            setCurrentKey("Node")
        }
    }, [location])
    return (
        <div className="left-sider">
            <Menu
                className="left-menu"
                onSelect={({ key }) => setCurrentKey(key)}
                mode="inline"
                items={items}
            />
        </div>
    )
})
export default LeftSider
