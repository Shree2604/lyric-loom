import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBarMain from "../components/sidebar/SideBarMain";
import MainHome from "./MainHome";
import UserRegistration from "../client/UserRegistration";
import UserLogin from "./../client/UserLogin";
import AdminLogin from "./../admin/AdminLogin";
import ArtistLogin from "./../artist/ArtistLogin";


import About from "./../client/About";
import DevelopersTeam from "./DevelopersTeam";
import MainErrorPage from "./MainErrorPage";
import Instructions from "./Instructions";

export default function MainNavBar({ onArtistLogin, onAdminLogin, onUserLogin }) {
  return (
    <Router>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#6ABAD2",
          borderRadius: "30px",
          display: "flex",
        }}
      >
        <SideBarMain />
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/mainhome" element={<MainHome />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/userregistration" element={<UserRegistration />} />
          <Route
            path="/userlogin"
            element={<UserLogin onUserLogin={onUserLogin} />}
          />
          <Route
            path="/adminlogin"
            element={<AdminLogin onAdminLogin={onAdminLogin} />}
          />
          <Route
            path="/artistlogin"
            element={<ArtistLogin onArtistLogin={onArtistLogin} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/developers" element={<DevelopersTeam />} />
          <Route path="*" element={<MainErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}
