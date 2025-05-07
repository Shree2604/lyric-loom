//import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Player from "./Player";
import About from "./About";
import Feed from "./Feed";
import Favorites from "./Favorites";
import SharedFavorites from "./SharedFavorites";
import Collab from "./Collab.js";
import Concerts from "./Concerts.js";
import Subscription from "./Subscription.js";

import "./NavBar.css";
import SideBar from "../components/sidebar/SideBar";
import ErrorPage from "./ErrorPage";
import Trending from "./Trending";

export default function NavBar() {
  return (
    <Router>
      <div className="main-body">
        <SideBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          

          <Route path="/player" element={<Player />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/favorites/shared/:shareId" element={<SharedFavorites />} />
          <Route path="/about" element={<About />} />
          <Route path="/collab" element={<Collab />} />
          <Route path="/concerts" element={<Concerts />} />
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}
