import React from "react";
import {  Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Layout from "./Layout/Layout";
import HomePage from "./Pages/HomePage";

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    
  );
}

export default App;

