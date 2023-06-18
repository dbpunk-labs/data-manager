import { Table } from "antd";
import React from "react";

export const RollupTable = () => {
  const [collections, setCollections] = React.useState<any[]>([
    {
      number: 100,
      id: "dsshi",
      age: "1min",
      address: "addrxxx",
      sender: "xx",
      state: "Off chain",
      block: "-",
    },
  ]);
  return (
    <div style={{ padding: 20 }}>
      <Table
        dataSource={collections}
        columns={[
          {
            dataIndex: "number",
            title: "Batch No.",
          },
          {
            dataIndex: "age",
            title: "Age",
          },
          {
            dataIndex: "originSize",
            title: "Origin Size",
          },
          {
            dataIndex: "batchSize",
            title: "Batch Size",
          },
          {
            dataIndex: "mutations",
            title: "Mutations",
          },

          {
            dataIndex: "block",
            title: "Ar Block",
          },
          {
            dataIndex: "fees",
            title: "Fees",
          },
          {
            dataIndex: "artx",
            title: "Ar tx",
          },
          {
            dataIndex: "evmtx",
            title: "Evm tx",
          },
        ]}
      />
    </div>
  );
};
