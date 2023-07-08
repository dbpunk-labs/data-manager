import { Button, Modal } from 'antd'
import React, { memo } from 'react'
import welcomeImg from '../../assets/welcome.png'
import '../../styles/WelcomeModal.scss'

const WelComeModal: React.FC<{}> = memo((props) => {
    const [visible, setVisible] = React.useState(true)
    return (
        <Modal
            wrapClassName="db3-modal welcome-modal"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        >
            <img src={welcomeImg} width={628} />
            <div className="welcome-title">Welcome to DB3</div>
            <div className="welcome-desc">
                You’ve done fantastic job 🎉 ! Only few steps to go
            </div>
            <div style={{ textAlign: 'center', marginBottom: 34 }}>
                <Button type="primary" onClick={() => setVisible(false)}>
                    Let's go
                </Button>
            </div>
        </Modal>
    )
})
export default WelComeModal
