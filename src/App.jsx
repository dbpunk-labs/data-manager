import "./App.css";
import {
  Button,
  Form,
  Input,
} from "antd";
import {
  DB3Client,
  MetamaskWallet,
  collection,
  DB3Store,
  getDocs
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
  const index_example = [
    {
      "name": "ownerIndex",
      "id": 1,
      "fields": [
        {
          "fieldPath": "owner",
          "valueMode": {
            "oneofKind": "order",
            "order": 1
          }
        }
      ]
    }
  ]

  const [res5, queryDocHandle] = useAsyncFn(
    async (databaseAddr, colName) => {
      try {
        const db = new DB3Store(databaseAddr, client);
        const collectionRef = await collection(db, colName);
        const result = await getDocs(collectionRef);

        console.log(result)
        setResultDoc(result.docs)
        
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
      <h2>
        Data Manager base on <a href="https://db3.network"> DB3 Network</a>
      </h2>
      <label>
        <h3> Step1: connect wallet</h3>
        <Button type="primary" onClick={connectWallet}>
          connect wallet
        </Button>
        <br />
        <label>Db3 account addr: {db3AccountAddr}</label>
        <br />
        <label>EVM account addr: {evmAccountAddr}</label>
      </label>

      <hr />
      <label>
        <h3> Step2: Get or Create a Database</h3>

        <Button type="primary" onClick={createDatabase}>
          Create Database
        </Button>
        <div> Database addr: {databaseAddr}
        </div>
        <br />

      </label>

      <hr />
      <label>
        <h3> Step3: Create collections under a database</h3>

        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 50 }}
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
            <div className="twoCol">
              <Input.TextArea rows={10} placeholder="define index" />
              <div>
                <b>Example index</b>
                <p >{JSON.stringify(index_example)} </p>

              </div>

            </div>

          </Form.Item>
          <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={res2.loading}>
              Create Collection
            </Button>
          </Form.Item>
        </Form>
        <p>
          {}
        </p>
      </label>
      <hr></hr>
      <label>
        <h3> Step4: Preview a collection</h3>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 50 }}
          onFinish={queryDoc}
          autoComplete="off"
          style={{ width: 800 }}
        >

          <Form.Item
            label=" Databse"
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


          <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={res2.loading}>
              Query doc
            </Button>
          </Form.Item>
        </Form>
        <div>
          <h4>View docs</h4>
          <p>{resultDoc.map( (item,i) => 
               <div id = {i}  className="twoCol">
                  <p> {item.entry.doc.text} </p>
                  <p> {item.entry.doc.owner}</p>
                  
                </div>
          )}</p>


          {/* { 

            resultDoc.map(
              item=>{

                  <p> {item.entry.doc.text}  {item.entry.doc.owner}</p>

              }
            )
            
          } */}

        </div>
      </label>

    </div>
  );
}

export default App;
