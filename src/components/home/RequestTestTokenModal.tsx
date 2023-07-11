import { Input, Modal, Steps, Typography } from 'antd'
import React, { memo } from 'react'
import { atom, useRecoilState } from 'recoil'
import '../../styles/RequestTestTokenModal.scss'

export const requestTestTokenVisibleState = atom({
    key: 'requestTestTokenVisibleState',
    default: false,
})
const { Paragraph } = Typography
const RequestTestTokenModal: React.FC<{}> = memo((props) => {
    const [visible, setVisible] = useRecoilState(requestTestTokenVisibleState)
    return (
        <Modal
            title="Request Test Token"
            wrapClassName="db3-modal request-test-token-modal"
            width={764}
            open={visible}
            onCancel={() => setVisible(false)}
            okText="Request Token"
        >
            <Steps
                className="db3-steps"
                direction="vertical"
                items={[
                    {
                        title: 'Post a tweet to your Twitter account, the content is as follows:',
                        description: (
                            <Paragraph copyable>
                                I’m testing db3 network as my dApp database, and
                                get some test token, my Ar address is
                                0x1012314121412415. My Polygon address is
                                0x1231455. My endpoint node code is : 902133erq
                                Go and get more info about db3.network
                            </Paragraph>
                        ),
                    },
                    {
                        title: 'Paste your twitter url contains above info and get some token',
                        description: <Input />,
                    },
                ]}
            />
        </Modal>
    )
})
export default RequestTestTokenModal
