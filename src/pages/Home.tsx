import React, { memo, useEffect } from 'react'
import '../styles//Home.scss'
import StepGuide from '../components/home/StepGuide'
import WelComeModal from '../components/home/WelcomeModal'
import Welcome from '../components/home/Welcome'
import { usePageContext } from './Context'

const Home: React.FC<{}> = memo((props) => {
    const { rollupStatus } = usePageContext()
    return (
        <div className="home">
            {rollupStatus && !rollupStatus.hasInited ? (
                <StepGuide />
            ) : (
                <Welcome />
            )}
            <WelComeModal />
        </div>
    )
})
export default Home
