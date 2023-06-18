import { Menu } from "antd";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const EventDB = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2 style={{ width: "100%", padding: "0 16px", marginBottom: 0 }}>
        Event DB
      </h2>
      <Menu
        mode="horizontal"
        defaultActiveFirst={true}
        defaultChecked={true}
        defaultSelectedKeys={["events"]}
        items={[
          {
            key: "events",
            label: "Events",
          },
          {
            key: "playground",
            label: "Playground",
          },
        ]}
        onClick={(e) => {
          navigate(`/console/event-db/${e.key}`);
        }}
      />
      <div style={{ height: "calc(100% - 86px)" }}>
        <Outlet />
      </div>
    </div>
  );
};
