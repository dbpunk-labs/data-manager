import React, { memo, useEffect } from 'react'
import '../styles//Home.scss'
import StepGuide from '../components/home/StepGuide'
import WelComeModal from '../components/home/WelcomeModal'
import Welcome from '../components/home/Welcome'
import { message } from 'antd'

const Home: React.FC<{}> = memo((props) => {
    return (
        <div className="home">
            <StepGuide />
            <WelComeModal />
            {/* <Welcome /> */}
        </div>
    )
})
export default Home
