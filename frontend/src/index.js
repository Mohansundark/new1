import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import "./Login.css";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import UserRegister from "./UserRegister";
import UserLogin from "./userLogin";
import Home from "./Home";


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/adminlogin" element={<AdminLogin/>}/>
      <Route path="/adminregister" element={<AdminRegister/>}/>
      <Route path="/userregister" element={<UserRegister/>}/>
      <Route path="/userlogin" element={<UserLogin/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
