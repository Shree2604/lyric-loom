import "./SideBar.css"
import SideBarButton from "./SideBarButton";
import React from 'react'
import { IoHome } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineLogin } from "react-icons/ai";


import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function SideBarMain() {
  return (
    <div className="sidebar-container" data-testid="sidebar-container">
      <style>
        {`
        .logo-img {
    margin-bottom: 20px;
    margin-left: 7px;
    width:100px;
    height:100px;
  }
        `}
      </style>
      <div className="sidebar-content-stack">
        <div>
          <img src="music_logo_design-removebg-preview.svg" alt="logo" className="logo-img" />
        </div>
        <SideBarButton title="Home" to="/mainhome" icon={<IoHome />} />
        <SideBarButton title="Instructions" to="/instructions" icon={<MdOutlineIntegrationInstructions />} />
        <SideBarButton title="Sign Up" to="/userregistration" icon={<AiOutlineUserAdd/>} />
        <SideBarButton title="User Login" to="/userlogin" icon={<AiOutlineLogin />} />
        <SideBarButton title="FAQ's" to="/about" icon={<IoHome />} /> 
        <SideBarButton title="Artist Login" to="/artistlogin" icon={<AiOutlineLogin />} />
        <SideBarButton title="Admin Login" to="/adminlogin" icon={<AiOutlineLogin />} />
      </div>
    </div>
  )
}


