import { CopyOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Button, Modal, Input, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
type Database = {
  id: string;
  name: string;
  address: string;
};
export const EventDbList = () => {
  const [database, setDataBase] = React.useState<Database>({
    id: "db-id-1",
    name: "db-name",
    address: "0x123abadfa12345231",
  });

  const [showCreateCollectionModal, setShowCreateContractModal] =
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
          <Button onClick={() => setShowCreateContractModal(true)}>
            <PlusOutlined /> Create Event Collection
          </Button>
          <Modal
            title="Create Target Event Collection"
            open={showCreateCollectionModal}
            onCancel={() => setShowCreateContractModal(false)}
            onOk={() => {
              onCreateCollection();
              setShowCreateContractModal(false);
            }}
          >
            <Form form={createCollectionForm}>
              <Form.Item required={true} label="Name" key="name">
                <Input />
              </Form.Item>
              <Form.Item required={true} label="Event Id" key="id">
                <Input />
              </Form.Item>
              <Form.Item required={true} label="Start block" key="block">
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
            {
              dataIndex: "name",
              title: "Indexer Name",
              render: (value, record, index) => {
                return (
                  <Link
                    to={`/console/event-db/events/${database.id}/collection/${record.id}`}
                  >
                    {record.name}
                  </Link>
                );
              },
            },
            { dataIndex: "documents", title: "Documents" },
            { dataIndex: "size", title: "Total Size" },
            { dataIndex: "indexes", title: "Indexes" },
          ]}
        />
      </div>
    </div>
  );
};
