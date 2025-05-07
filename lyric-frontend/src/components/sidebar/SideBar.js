import React, { useEffect, useState } from "react";
import "./SideBarUser.css";
import SideBarButton from "./SideBarButton";

import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isUserLoggedIn");
    navigate("/userlogin");
    window.location.reload();
  };

  useEffect(() => {
    // Try to get user info from localStorage
    let userData = localStorage.getItem("user");
    if (!userData) {
      // If not found, try to get from token (for new logins)
      const token = localStorage.getItem("userAuthToken");
      if (token) {
        // Decode JWT to get user info
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const userObj = JSON.parse(jsonPayload);
          setUser({
            name: userObj.name,
            email: userObj.email
          });
          // Optionally store for future
          localStorage.setItem("user", JSON.stringify({ name: userObj.name, email: userObj.email }));
        } catch (err) {
          setUser(null);
        }
      }
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="sidebar-container">
      <img src="music_logo_design-removebg-preview.svg" alt="logo" className="logo-img" />
      <div className="sidebar-profile-section">
        <img src={require("./default-profile.png")} alt="profile" className="profile-img" />
        <div className="sidebar-hello">Hello!</div>
        <div className="sidebar-user-info">
          {user && (
            <>
              <div className="sidebar-username">{user.name}</div>
            </>
          )}
        </div>
      </div>
      <div className="sidebar-buttons">
        <SideBarButton title="Home" to="/home" icon={<span role="img" aria-label="home">🏠</span>} />
        <SideBarButton title="Player" to="/player" icon={<span role="img" aria-label="play">▶️</span>} />
        <SideBarButton title="Feed" to="/feed" icon={<span role="img" aria-label="dashboard">📢</span>} />
        
        <SideBarButton title="Favorites" to="/favorites" icon={<span role="img" aria-label="heart">❤️</span>} />
      
        <SideBarButton
          title="Daily Drop"
          to="/collab"
          icon={<span role="img" aria-label="artist">🎧</span>}
        />
        <SideBarButton
          title="Concert Tickets"
          to="/concerts"
          icon={<span role="img" aria-label="ticket">🎟️</span>}
        />
        <SideBarButton
          title="Subscription"
          to="/subscribe"
          icon={<span role="img" aria-label="star">🌟</span>}
        />
      </div>
      
      <div className="sidebar-action-section">
        <SideBarButton title="About" to="/about" icon={<span role="img" aria-label="feedback">💬</span>} />
        <SideBarButton
          title="Log Out"
          onClick={handleLogout}
          icon={<span role="img" aria-label="logout">🚪</span>}
        />
      </div>
      <div className="footer-container">
        <p className="footer-text">
          Developed with{" "}
          <span role="img" aria-label="heart">🥰</span>
        </p>
        <p className="footer-text">By LyricLoom</p>
      </div>
    </div>
  );
}
