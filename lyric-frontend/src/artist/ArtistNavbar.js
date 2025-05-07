import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './artistNavBar.css'
import ArtistHome from './ArtistHome';

import UsersData from './UsersData';
import SongsData from './SongsData';
import SideBarAdmin from '../components/sidebar/SideBarArtist';
import ArtistErrorPage from './ArtistErrorPage';

import ArtistRejectedPopup from './ArtistRejectedPopup';

export default function ArtistNavBar() {
  return (
    <Router>
      <div className='main-body'>
        <ArtistRejectedPopup />
        <SideBarAdmin/>
        <Routes>
          <Route path='/' element={<ArtistHome/>}/>
          <Route path='/artisthome' element={<ArtistHome/>}/>
          <Route path='/usersdata' element={<UsersData/>}/>
          <Route path='/songsdata' element={<SongsData/>}/>
    
        </Routes>
      </div>
    </Router>
  )
}
