import React, { memo } from 'react'

const Content: React.FC<{ children: React.ReactNode }> = memo((props) => {
    return <div className="content-container">{props.children}</div>
})
export default Content
