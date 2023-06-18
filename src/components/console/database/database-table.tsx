import { PlusOutlined } from "@ant-design/icons";
import { Form, Button, Input, Modal, Tree } from "antd";
import React from "react";
import { Outlet, useMatch, useNavigate } from "react-router";

export const DatabaseTable = (props) => {
  const [showCreateDatabaseModal, setShowCreateDatabaseModal] =
    React.useState<boolean>(false);
  const dbId = useMatch("console/database/:id");

  const navigate = useNavigate();
  const navigateToCollection = (dbId: string, collectionId: string) => {
    navigate(`/console/database/list/${dbId}/collection/${collectionId}`);
  };

  const navigateToDb = (dbId: string) => {
    navigate(`/console/database/list/${dbId}`);
  };

  const [dbData, setDbData] = React.useState<any[]>([
    {
      title: "test-db",
      key: "0-0",
      id: "db-id-1",
      children: [
        {
          title: "test-db-collection1",
          key: "0-0-0",
          id: "collection-id-1",
        },
        {
          title: "test-db-collection2",
          key: "0-0-1",
          id: "collection-id-2",
        },
      ],
    },
    {
      title: "test-db-2",
      id: "db-id-2",
      key: "0-1",
      children: [
        {
          title: "test-db-2-collection1",
          id: "2-collection-id-1",
          key: "0-1-0",
        },
        {
          title: "test-db-2-collection2",
          key: "0-1-1",
          id: "2-collection-id-2",
        },
      ],
    },
  ]);

  const [createDBForm] = Form.useForm();

  const onCreateDatabase = () => {
    // TODO
    const values = createDBForm.getFieldsValue();
    console.log(values);
    setShowCreateDatabaseModal(false);
  };

  const onSelect = (e) => {
    console.log(e);
    const key = e[0];
    const db = dbData.find((item) => item.key === key);
    if (db) {
      navigateToDb(db.id);
    } else {
      dbData.map((db) => {
        const collection = db.children.find((item) => item.key === key);
        if (collection) navigateToCollection(db.id, collection.id);
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          padding: "20px 12px",
          height: "100%",
          borderRight: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <div>
          <Button
            style={{ marginBottom: 8 }}
            size="small"
            onClick={() => {
              setShowCreateDatabaseModal(true);
            }}
          >
            <PlusOutlined /> Create Database
          </Button>
          <Input.Search style={{ marginBottom: 8 }} size="small" />
          <Modal
            title="Create Database"
            open={showCreateDatabaseModal}
            onOk={() => {
              onCreateDatabase();
            }}
            onCancel={() => setShowCreateDatabaseModal(false)}
          >
            <Form form={createDBForm}>
              <Form.Item required={true} label="Name" key="name">
                <Input />
              </Form.Item>
              <Form.Item required={false} label="Description" key="description">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <div>
          <Tree
            showLine={false}
            showIcon={false}
            defaultExpandedKeys={["0-0-0"]}
            onSelect={onSelect}
            treeData={dbData}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "calc(100% - 200px)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
