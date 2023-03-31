import { Card, Space } from "antd";
import React from "react";

function shortAddr(addr) {}
function getColleciontInfo(item) {
  let info = "";
  if (item.length > 0) {
    item.map((i) => (info = `${info}[${i.name}] `));
  }
  return info;
}

export default function DatabaseCard(param) {
  return (
    <Card
      title={param.item.address}
      extra={<a href=" ">More</a>}
      style={{ width: 350 }}
      size="small"
    >
      <span>DB Addr: {param.item.address}</span>
      <p>Desc : {param.item?.desc}</p>
      <p>Collection Count : {param.item?.collections?.length}</p>
      <p>Collections : {getColleciontInfo(param.item.collections)} </p>
    </Card>
  );
}
