import { Menu, Row, Col } from 'antd'
import React, { memo, useEffect } from 'react'
import homeIcon from '../assets/home.svg'
import homeActiveIcon from '../assets/home-active.svg'
import databaseIcon from '../assets/database.svg'
import databaseActiveIcon from '../assets/database-active.svg'
import eventdbIcon from '../assets/eventdb.svg'
import eventActiveIcon from '../assets/eventdb-active.svg'
import githubIcon from '../assets/github.svg'
import nodeIcon from '../assets/node.svg'
import nodeActiveIcon from '../assets/node-active.svg'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { usePageContext } from '../pages/Context'
import {
GithubFilled,
TwitterOutlined,
} from '@ant-design/icons'

const LeftSider: React.FC<{}> = memo((props) => {
    const [currentKey, setCurrentKey] = React.useState('Home')
    const {rollupStatus} = usePageContext()
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
    useEffect(() => {
        if (location.pathname.startsWith('/home')) {
            setCurrentKey('Home')
        } else if (location.pathname.startsWith('/database')) {
            setCurrentKey('Database')
        } else if (location.pathname.startsWith('/eventdb')) {
            setCurrentKey('EventDB')
        } else if (location.pathname.startsWith('/node')) {
            setCurrentKey('Node')
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
            <div className="left-footer">
               <Row>
                  <Col span={6}>
                    <Link to="https://github.com/dbpunk-labs" target="_blank">
                      <GithubFilled className="social-icon"/>
                    </Link>
                  </Col>
                  <Col span={6}>
                    <Link to="https://twitter.com/Db3Network" target="_blank">
                      <TwitterOutlined className="social-icon"/>
                    </Link>
                  </Col>
             </Row>
              <Row>
                    <Col span={6} className="social-icon" >
                       <p className="version"> {rollupStatus?.version?.versionLabel} </p>
                    </Col>
                    <Col span={6} className="social-icon" >
                       <p className="version"> {rollupStatus?.config?.networkId} </p>
                    </Col>
                    <Col span={6} className="social-icon" >
                       <p className="version"> {rollupStatus?.config?.chainId} </p>
                    </Col>
             </Row>
            </div>
        </div>
    )
})
export default LeftSider
