import React from 'react'
import { Header } from './header'
import { LeftOutlined } from '@ant-design/icons'

export const SetupGuide = () => {
    return (
        <div>
            <h1>Self host your DB3 node in 1 min</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                    <h1>#1</h1>
                </div>
                <div>
                    <h2>Installation</h2>
                    <p>Run script on your machine (localhost supported):</p>
                    <pre
                        style={{ background: 'lightgray', padding: '4px 8px' }}
                    >
                        $ curl --proto '=https' --tlsv1.2 -sSf
                        https://up.db3.network/db3up_init.sh | sh
                    </pre>
                    <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(
                                    `$ curl --proto '=https' --tlsv1.2 -sSf https://up.db3.network/db3up_init.sh | sh`
                                )
                            }
                        }}
                    >
                        Copy
                    </a>
                    <p>
                        Note: curl and python3 are required in your environment
                        For more info, please refer to <a>[link]</a>
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                    <h1>#2</h1>
                </div>
                <div>
                    <h2>Launch and visit</h2>
                    <p>
                        Check response, success example as below and you can
                        visit console url in your browser to manage your
                        database on DB3 node
                    </p>
                    <pre
                        style={{ background: 'lightgray', padding: '4px 8px' }}
                    >
                        {`> write endpoint on: 127.0.0.1:26659\r\n`}
                        {`> read endpoint on:  127.0.0.1:26660\r\n`}
                        {`> console URI : 127.0.0.1:8000\r\n`}
                    </pre>
                    <p>
                        Note: if you have any problem, please refer to the{' '}
                        <a>[doc]</a>
                        or touch us on <a>[discord]</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
