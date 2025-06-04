import React from "react";
import Navbar from "./Routes/Navbar/Navbar";
import MyRoutes from "./Routes/MyRoutes";
import "./styles.css";

const App = () => {
  return (
    <>
      <Navbar />
      <MyRoutes />
    </>
  );
};

export default App;