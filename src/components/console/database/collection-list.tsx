import { CopyOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Button, Modal, Input, Table } from "antd";
import React from "react";

type Database = {
  id: string;
  name: string;
  address: string;
};
export const CollectionList = () => {
  const [database, setDataBase] = React.useState<Database>({
    id: "db-id-1",
    name: "db-name",
    address: "0x123abadfa12345231",
  });

  const [showCreateCollectionModal, setShowCreateCollectionModal] =
    React.useState<boolean>(false);
  const [createCollectionForm] = Form.useForm();

  const onCreateCollection = () => {
    // TODO
    const values = createCollectionForm.getFieldsValue();
  };

  const [collections, setCollections] = React.useState<any[]>([
    {
      name: "test-collection",
      documents: 10,
      size: 100,
      indexes: 2,
    },
    {
      name: "test-collectio-2",
      documents: 10,
      size: 100,
      indexes: 2,
    },
  ]);

  return (
    <div style={{ padding: "12px 24px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3 style={{ display: "inline-block" }}>{database.name}</h3>
          <span>addr： {database.address}</span>
          <CopyOutlined />
        </div>
        <div>
          <Button onClick={() => setShowCreateCollectionModal(true)}>
            <PlusOutlined /> Create Collection
          </Button>
          <Modal
            title="Create Collection"
            open={showCreateCollectionModal}
            onCancel={() => setShowCreateCollectionModal(false)}
            onOk={() => {
              onCreateCollection();
              setShowCreateCollectionModal(false);
            }}
          >
            <Form form={createCollectionForm}>
              <Form.Item required={true} label="Database" key="database">
                <Input value={database.name} disabled />
              </Form.Item>
              <Form.Item
                required={false}
                label="Collection Name"
                key="collectionName"
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div>
        <Table
          dataSource={collections}
          columns={[
            { dataIndex: "name", title: "Collection Name" },
            { dataIndex: "documents", title: "Documents" },
            { dataIndex: "size", title: "Total Size" },
            { dataIndex: "indexes", title: "Indexes" },
          ]}
        />
      </div>
    </div>
  );
};
