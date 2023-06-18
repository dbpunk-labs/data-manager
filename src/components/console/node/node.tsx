import { Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const NodeConsole = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2 style={{ width: "100%", padding: "0 16px", marginBottom: 0 }}>
        Node
      </h2>
      <Menu
        mode="horizontal"
        defaultActiveFirst={true}
        defaultChecked={true}
        defaultSelectedKeys={["rollup"]}
        items={[
          {
            key: "rollup",
            label: "Roll-ip",
          },
          {
            key: "mutations",
            label: "Mutations",
          },
          {
            key: "account",
            label: "Account",
          },
          {
            key: "setting",
            label: "Setting",
          },
        ]}
        onClick={(e) => {
          navigate(`/console/node/${e.key}`);
        }}
      />
      <div style={{ height: "calc(100% - 86px)" }}>
        <Outlet />
      </div>
    </div>
  );
};
