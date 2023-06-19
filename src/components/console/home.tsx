import { Button, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export const Home = () => {
  const cardStyle = {
    background: "lightgray",
    cursor: "pointer",
    width: 300,
    height: 200,
  };

  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyItems: "center",
        padding: "40px",
      }}
    >
      <div style={{ width: "80%", background: "lightgray", padding: 20 }}>
        <p>Don’t have database? Go and create your first databases on DB3</p>
        <Button onClick={() => navigate("/console/database")}>
          Create Database
        </Button>
      </div>

      <div>
        <h2>Example</h2>
        <Space direction="horizontal">
          <Link
            to={
              "https://github.com/dbpunk-labs/db3.js/tree/main/examples/helloworld"
            }
          >
            <div style={cardStyle}>Try Hello world</div>
          </Link>

          <Link
            to={
              "https://github.com/dbpunk-labs/db3.js/tree/main/examples/todomvc"
            }
          >
            <div style={cardStyle}>Try Todo MVC</div>
          </Link>
        </Space>
        <h2>Build</h2>
        <Space direction="horizontal">
          <Link to={"https://github.com/dbpunk-labs/db3.js"}>
            <div style={cardStyle}>DB3js Library</div>
          </Link>
          <div style={cardStyle}>something...</div>
        </Space>
      </div>
    </div>
  );
};
