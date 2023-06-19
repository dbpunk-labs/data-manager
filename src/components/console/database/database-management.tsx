import { CopyOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Menu, Modal, Tabs, Tree } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const DatabaseManagement = (props) => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2 style={{ width: "100%", padding: "0 16px", marginBottom: 0 }}>
        Database
      </h2>
      <Menu
        mode="horizontal"
        defaultActiveFirst={true}
        onClick={(e) => navigate(`/console/${e.key}`)}
        items={[
          {
            key: "database/list",
            label: "Database",
          },
          {
            key: "database/playground",
            label: "Playground",
          },
        ]}
      />
      <div style={{ height: "calc(100% - 86px)" }}>
        <Outlet />
      </div>
    </div>
  );
};