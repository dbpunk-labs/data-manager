import React, { useState } from "react";
import { Header } from "../components/header";
import { SetupGuide } from "../components/setup-guide";
import { LeftOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useNavigate } from "react-router-dom";
export const LaunchPage = () => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: showSetupGuide ? "none" : "block",
          }}
        >
          <h1>Select node deployment mode</h1>
          <Space direction="horizontal">
            <div
              style={{ background: "lightgray", cursor: "pointer" }}
              onClick={() => navigate("./console")}
            >
              <div className="card">We host,you just use.</div>
              <h3>Cloud mode</h3>
            </div>
            <div
              style={{ background: "lightgray", cursor: "pointer" }}
              onClick={() => setShowSetupGuide(true)}
            >
              <div className="card">You host the node yourself.</div>
              <h3>Self host mode</h3>
            </div>
          </Space>
        </div>
        <div
          style={{
            flexDirection: "row",
            display: showSetupGuide ? "flex" : "none",
          }}
        >
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowSetupGuide(false);
            }}
          >
            <LeftOutlined />
            Back
          </div>
          <SetupGuide />
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
