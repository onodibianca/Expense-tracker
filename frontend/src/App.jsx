import { useState } from "react";
import "./App.css";
import Register from "./pages/Register";
import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/ExpensePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />;
      <Route path="/dasboard" element={<Dashboard />} />;
      <Route path="/register" element={<Register />} />;
    </Routes>
  );
}

export default App;
