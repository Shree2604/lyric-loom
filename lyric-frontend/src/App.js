import React, { useEffect, useState } from 'react';
import MainNavBar from './main/MainNavBar';
import NavBar from './client/NavBar';
import AdminNavBar from './admin/AdminNavBar';
import ArtistNavBar from './artist/ArtistNavbar';

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isArtistLoggedIn, setIsArtistLoggedIn] = useState(false);

  useEffect(() => {
    const artistToken = localStorage.getItem('artistAuthToken');
    const adminToken = localStorage.getItem('adminAuthToken');
    const userToken = localStorage.getItem('userAuthToken');
    
    let artistLoggedIn = false;
    let adminLoggedIn = false;
    let userLoggedIn = false;

    if (artistToken) {
      artistLoggedIn = localStorage.getItem('isArtistLoggedIn') === 'true';
    }
  
    if (adminToken) {
      adminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    }
  
    if (userToken) {
      userLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    }
    setIsArtistLoggedIn(artistLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
    setIsUserLoggedIn(userLoggedIn);
  }, []);
  
  const onArtistLogin = () => {
    localStorage.setItem('isArtistLoggedIn', 'true');
    setIsArtistLoggedIn(true);
  }

  const onAdminLogin = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
    setIsAdminLoggedIn(true);
  }

  const onUserLogin = () => {
    localStorage.setItem('isUserLoggedIn', 'true');
    setIsUserLoggedIn(true);
  }

  return (
    <div>
    {isAdminLoggedIn ? (
      <AdminNavBar />
    ) : isUserLoggedIn ? (
      <NavBar />
    ) : isArtistLoggedIn ? (
      <ArtistNavBar />  
    ) : (
      <MainNavBar 
        onAdminLogin={onAdminLogin} 
        onUserLogin={onUserLogin} 
        onArtistLogin={onArtistLogin}  
      />
    )}
  </div>
  
  )
}

