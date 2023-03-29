import "./App.css";
import { Button, Form, Input, Space, Image } from "antd";
import {
  DB3Client,
  MetamaskWallet,
  collection,
  DB3Store,
  getDocs,
} from "db3.js";
import { useEffect, useState } from "react";

import { useAsyncFn } from "react-use";

import { Buffer } from "buffer";

globalThis.Buffer = Buffer;
const wallet = new MetamaskWallet(window);

const client = new DB3Client("https://grpc.devnet.db3.network", wallet);

function App() {
  const [count, setCount] = useState(0);
  const [databaseAddr, setDatabaseAddr] = useState("");
  const [db3AccountAddr, setDb3AccountAddr] = useState("");
  const [evmAccountAddr, setEvmAccountAddr] = useState("");
  const [resultDoc, setResultDoc] = useState([]);
  // Step1: connect Metamask wallet and get evm address
  const [res, connectWallet] = useAsyncFn(async () => {
    try {
      await wallet.connect();
      const addr = wallet.getAddress();
      setDb3AccountAddr(addr);
      const evmAddr = wallet.getEvmAddress();
      setEvmAccountAddr(evmAddr);
      console.log(wallet);
    } catch (e) {
      console.log(e);
    }
  }, [wallet]);

  // Step2: Get or Create database
  const [response, createDatabase] = useAsyncFn(async () => {
    try {
      const [dbid, txid] = await client.createDatabase();
      setDatabaseAddr(dbid);
    } catch (e) {
      console.log(e);
    }
  }, [client]);

  // Step3: Create Collection under a database
  const [res2, createCollectionHandle] = useAsyncFn(
    async (databaseAddr, colName, colIndexList) => {
      try {
        const db = new DB3Store(databaseAddr, client);

        // if the collection do not exist, the sdk will create it
        const collectionRef = await collection(db, colName, colIndexList);

        console.log(collectionRef);
      } catch (e) {
        console.log(e);
      }
    },
    [wallet]
  );

  function createCollection(values) {
    try {
      const idx = JSON.parse(values.colIndexList);
      createCollectionHandle(values.databaseAddr, values.colName, idx);
    } catch (error) {
      alert(error);
    }
  }
  const index_example = `[
   {
      "name": "ownerIndex",
      "id": 1,
      "fields": [
        {
          "fieldPath": "owner",
          "valueMode": {
            "oneofKind": "order",
            "order": 1,
          },
        },
      ],
    },
  ]`;

  const [res5, queryDocHandle] = useAsyncFn(
    async (databaseAddr, colName) => {
      try {
        const db = new DB3Store(databaseAddr, client);
        const collectionRef = await collection(db, colName);
        const result = await getDocs(collectionRef);

        console.log(result);
        setResultDoc(result.docs);
      } catch (e) {
        console.log(e);
      }
    },
    [client]
  );

  function queryDoc(values) {
    queryDocHandle(values.databaseAddr, values.colName);
  }

  return (
    <div className="App">
      <h1>
        Data Manager base on <a href="https://db3.network"> DB3 Network</a>
      </h1>

      <Space direction="vertical">
        <Image width={200}  style={{padding: "left"}} src = "../Logo_standard.png" ></Image>
        <div>
          <h2> Step1: Connect wallet</h2>
          <p>Db3 account addr: {db3AccountAddr}</p>
          <p>EVM account addr: {evmAccountAddr}</p>
          <Button type="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        </div>
        <div>
          <h2> Step2: Get or Create a Database</h2>
          <p> Database addr: {databaseAddr} </p>
          <Button type="primary" onClick={createDatabase}>
            Create Database
          </Button>
          <br />
        </div>
        <div>
          <h2> Step3: Create collections under a database</h2>
          <Form
            name="basic"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 12 }}
            onFinish={createCollection}
            autoComplete="off"
            style={{ width: 1000 }}
          >
            <Form.Item
              label="Target Database"
              name="databaseAddr"
              rules={[
                {
                  required: true,
                  message: "Please input your Database address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Collection Name"
              name="colName"
              rules={[
                {
                  required: true,
                  message: "Please input your collection name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Indexes"
              name="colIndexList"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <Space align="start" size={20}>
                <div>
                  <Input.TextArea rows={15} placeholder="define index" />
                </div>
                <div>
                  <b>Example index</b>
                  <pre
                    style={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      padding: 4,
                      fontSize: 12,
                      lineHeight: "initial",
                    }}
                  >
                    {index_example}{" "}
                  </pre>
                </div>
              </Space>
            </Form.Item>
            <Button type="primary"  htmlType="submit" loading={res2.loading}>
              Create Collection
            </Button>
          </Form>
        </div>

        <div>
          <h2> Step4: Preview a collection</h2>
          <Space align="start">
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              onFinish={queryDoc}
              autoComplete="off"
              style={{ width: 600 }}
            >
              <Form.Item
                label="Database Address"
                name="databaseAddr"
                rules={[
                  {
                    required: true,
                    message: "Please input your Database address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Collection Name"
                name="colName"
                rules={[
                  {
                    required: true,
                    message: "Please input your collection name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={res2.loading}>
                Query doc
              </Button>
            </Form>
            <div>
              <h4 style={{ margin: 0 }}>View docs</h4>
              <p>
                {resultDoc.map((item, i) => (
                  <Space>
                    <span> {item.entry.doc.text} </span>
                    <span> {item.entry.doc.owner}</span>
                  </Space>
                ))}
              </p>
            </div>
          </Space>
        </div>
      </Space>
    </div>
  );
}

export default App;
