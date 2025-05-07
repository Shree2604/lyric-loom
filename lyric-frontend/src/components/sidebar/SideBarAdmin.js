import React from "react";
import "./SideBarAdmin.css";
import SideBarButton from "./SideBarButton";
import { IoHome } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { FaUsersLine } from "react-icons/fa6";
import { BiSolidMusic } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import profileImg from "./default-profile.png";

export default function SideBarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out');
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/adminlogin');
    window.location.reload();
  };

  return (
    <div className="sidebar-admin-container">
      <img src="music_logo_design-removebg-preview.svg" alt="logo" className="logo-img" />
      <div>
        <h2>ADMIN SPACE</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={profileImg} alt="profile" className="profile-img" />
        <div>
          <div>Hello!</div>
          <div>ADMIN</div>
        </div>
      </div>

      <div>
        <SideBarButton title="Home" to="/adminhome" icon={<IoHome />} />
        <SideBarButton title="Users Data" to="/usersdata" icon={<FaUsersLine />} />
        <SideBarButton title="Songs Data" to="/songsdata" icon={<BiSolidMusic />} />
        <SideBarButton title="Pending Songs" to="/pendingsongs" icon={<BiSolidMusic />} />
        <SideBarButton title="News Approval" to="/artistnewsapprovals" icon={<BiSolidMusic />} />
        <SideBarButton title="All News" to="/allartistnews" icon={<span role="img" aria-label="news">📰</span>} />
        <SideBarButton title="Add Admin News" to="/adminaddnews" icon={<span role="img" aria-label="add">➕</span>} />
        <SideBarButton title="Add Partner" to="/admin/add-partner" icon={<span role="img" aria-label="add">➕</span>} />
        <SideBarButton title="Partners List" to="/admin/partners-list" icon={<span role="img" aria-label="key">🔑</span>} />
        <SideBarButton title="API Usage" to="/admin/api-usage" icon={<span role="img" aria-label="chart">📊</span>} />
      </div>

      <div>
        <SideBarButton title="Log Out" onClick={handleLogout} icon={<PiSignOutBold />} />
      </div>
    </div>
  );
}
