import { CopyOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import React from "react";
import { DocumentView } from "../../views/document-view";
import { IndexesView } from "../../views/indexes-view";

export const EventDetail = () => {
  const [db, setDb] = React.useState<any>({
    id: "db_id",
    name: "db",
    addr: "db_address",
  });

  const [collection, setCollection] = React.useState<any>({
    id: "collection_id",
    name: "collection",
    documents: [
      {
        content: "content...",
      },
      {
        content: "content2...",
      },
    ],
  });

  return (
    <div style={{ height: "100%" }}>
      <div>
        <h3
          style={{
            display: "inline-block",
            padding: "0 16px",
            marginBottom: 0,
          }}
        >
          {db.name}.{collection.name}
        </h3>
        <span>
          addr: {db.add}/{collection.name}
        </span>
        <CopyOutlined />
      </div>
      <div style={{ padding: "0 16px" }}>
        <Tabs
          items={[
            {
              key: "documents",
              label: "Documents",
              children: <DocumentView data={collection.documents} />,
            },
            {
              key: "indexes",
              label: "Indexes",
              children: <IndexesView />,
            },
          ]}
        />
      </div>
    </div>
  );
};
