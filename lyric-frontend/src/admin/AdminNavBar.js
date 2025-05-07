import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './adminNavBar.css'
import AdminHome from './AdminHome';
import AdminAddNews from './AdminAddNews';
import UsersData from './UsersData';
import SongsData from './SongsData';
import SideBarAdmin from '../components/sidebar/SideBarAdmin';
import AdminErrorPage from './AdminErrorPage';
import PendingSongs from './PendingSongs';
import ArtistNewsApproval from './ArtistNewsApproval';
import AllArtistNews from './AllArtistNews';
import AdminAddPartner from './AdminAddPartner';
import AdminPartnersList from './AdminPartnersList';
import AdminApiKeyUsage from './AdminApiKeyUsage';

export default function AdminNavBar() {

  return (
    <Router>
        <div className='main-body'>
            <SideBarAdmin/>
            <Routes>
                <Route path='/' element={<AdminHome/>}/>
                <Route path='/adminhome' element={<AdminHome/>}/>
                <Route path='/usersdata' element={<UsersData/>}/>
                <Route path='/songsdata' element={<SongsData/>}/>
                <Route path='/pendingsongs' element={<PendingSongs/>}/>
                <Route path='/artistnewsapprovals' element={<ArtistNewsApproval/>}/>
                <Route path='/allartistnews' element={<AllArtistNews/>}/>
                <Route path='/adminaddnews' element={<AdminAddNews/>}/>
                <Route path='/admin/add-partner' element={<AdminAddPartner/>}/>
                <Route path='/admin/partners-list' element={<AdminPartnersList/>}/>
                <Route path='/admin/api-usage' element={<AdminApiKeyUsage/>}/>
                <Route path='*' element={<AdminErrorPage/>}/>
            </Routes>
        </div>
    </Router>
  )
}
