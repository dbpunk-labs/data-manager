import { Card, Space } from 'antd'
import React from 'react'

function shortAddr(addr) {
    return addr.substring(0, 5) + '...' + addr.substring(addr.length - 4)
}

function getColleciontInfo(item) {
    let info = ''
    if (item.length > 0) {
        item.map((i) => (info = `${info}[${i.name}] `))
    }
    return info
}

export default function DatabaseCard({ item }) {
    return (
        <Card
            title={shortAddr(item.address)}
            //   extra={<a href=" ">More</a>}
            style={{ width: 370 }}
            size="small"
        >
            <span>DB Addr: {item.address}</span>
            <p>Desc : {item.desc}</p>
            <p>Collection Count : {item.collections?.length}</p>
            <p>Collections : {getColleciontInfo(item.collections)} </p>
        </Card>
    )
}
