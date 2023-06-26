import { Button, Space } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

export const Home = () => {
    const cardStyle = {
        background: 'lightgray',
        cursor: 'pointer',
        width: 300,
        height: 200,
    }

    const navigate = useNavigate()
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyItems: 'center',
                padding: '40px',
            }}
        >
            <div style={{ width: '80%', background: 'lightgray', padding: 20 }}>
                <p>
                    Don’t have database? Go and create your first databases on
                    DB3
                </p>
                <Button
                    style={{
                        backgroundColor: '#1677ff',
                        color: '#fff',
                    }}
                    onClick={() => navigate('/console/database')}
                >
                    Create Database
                </Button>
            </div>
        </div>
    )
}
