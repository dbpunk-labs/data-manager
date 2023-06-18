import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Divider, Input } from "antd";
import { Collapse } from "antd";
import React from "react";

export const DocumentView = (props) => {
  const [showInsertDocModal, setShowInsertDocModal] =
    React.useState<boolean>(false);

  const [doc, setDoc] = React.useState<any>({});

  const onInsertDoc = () => {
    // TODO
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          height: 36,
        }}
      >
        <h4 style={{ display: "inline-block", margin: 0 }}>View Docs</h4>
        <Button onClick={() => setShowInsertDocModal(true)} size="small">
          <PlusOutlined /> Insert Document
        </Button>
        <Modal
          title="Insert Doc"
          open={showInsertDocModal}
          onCancel={() => setShowInsertDocModal(false)}
          onOk={() => {
            onInsertDoc();
            setShowInsertDocModal(false);
          }}
          okText="Insert"
        >
          <Input.TextArea
            value={doc}
            onChange={(e) => {
              setDoc(e.target.value);
            }}
          />
        </Modal>
      </div>
      {/* <Divider type="horizontal" /> */}
      <Collapse>
        {props.data.map((item, index) => {
          return (
            <Collapse.Panel
              key={index}
              header={item.content.slice(0, 30)}
              children={item.content}
            />
          );
        })}
      </Collapse>
    </div>
  );
};
