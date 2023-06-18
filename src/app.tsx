import React from "react";
import { Outlet } from "react-router-dom";

export const App = () => {
  // TODO
  // if first enter, go to welcome page, else console page

  return <div style={{ height: "100%" }}>{<Outlet />}</div>;
};

export default App;
