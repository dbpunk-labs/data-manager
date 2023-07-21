import React, { memo, useEffect } from 'react'
import '../styles/Home.scss'
import StepGuide from '../components/home/StepGuide'
import { PageContextProvider } from './Context'

const Setup: React.FC<{}> = memo((props) => {
    return (
        <PageContextProvider>
            <div className="home">
                <StepGuide />
            </div>
        </PageContextProvider>
    )
})
export default Setup
