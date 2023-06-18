import { Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { ConsoleHeader } from "../components/console/console-header";

export const ConsolePage = (props) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <div style={{ height: 64, borderBottom: "1px solid lightgray" }}>
        <ConsoleHeader />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100% - 64px)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 160,
            height: "100%",
            borderRight: "1px solid rgba(5, 5, 5, 0.06)",
          }}
        >
          <Menu
            defaultActiveFirst={true}
            mode="inline"
            items={[
              {
                key: "home",
                label: "Home",
              },
              {
                key: "database",
                label: "Database",
              },
              {
                key: "event-db",
                label: "Event DB",
              },
              {
                key: "node",
                label: "Node",
              },
            ]}
            onClick={(e) => {
              navigate(`/console/${e.key}`);
            }}
          />
        </div>
        <div
          style={{
            width: "calc(100% - 160px)",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
