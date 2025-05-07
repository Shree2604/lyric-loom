import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Typography, Paper, Box, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import SongDetailsModal from './SongDetailsModal';
import config from '../config';

export default function PendingSongs() {
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSong, setModalSong] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);

  const [pendingSongs, setPendingSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPendingSongs = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('adminAuthToken');
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/songs?status=pending`, {
        headers: { 'x-auth-token': authToken }
      });
      setPendingSongs(data.data);
    } catch (err) {
      setError('Failed to fetch pending songs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingSongs(); }, []);

  const handleAction = async (id, action, rejectionReason = '') => {
    const authToken = localStorage.getItem('adminAuthToken');
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/songs/${id}/status`, { status: action, rejectionReason }, {
        headers: { 'x-auth-token': authToken }
      });
      fetchPendingSongs();
    } catch (err) {
      alert('Failed to update song status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selected.length === 0) return;
    let reason = '';
    if (action === 'rejected') {
      reason = prompt('Enter rejection reason for selected songs:') || '';
    }
    const authToken = localStorage.getItem('adminAuthToken');
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/songs/bulk-status`, { songIds: selected, status: action, rejectionReason: reason }, {
        headers: { 'x-auth-token': authToken }
      });
      setSelected([]);
      fetchPendingSongs();
    } catch (err) {
      alert('Failed to update songs');
    }
  };

  const handleRowClick = (song) => {
    setModalSong(song);
    setModalOpen(true);
  };

  const handleCheckbox = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleRejectDialog = (song) => {
    setRejectTarget(song);
    setRejectReason(song.rejectionReason || '');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    await handleAction(rejectTarget._id, 'rejected', rejectReason);
    setRejectDialogOpen(false);
    setRejectTarget(null);
    setRejectReason('');
  };


  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Pending Song Approvals</Typography>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <Paper>
          <Box mb={2} display="flex" gap={2}>
            <Button variant="contained" color="success" disabled={selected.length === 0} onClick={() => handleBulkAction('approved')}>Bulk Approve</Button>
            <Button variant="contained" color="error" disabled={selected.length === 0} onClick={() => handleBulkAction('rejected')}>Bulk Reject</Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Artist</TableCell>

                <TableCell>Audio</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSongs.map(song => (
                <TableRow key={song._id} hover onClick={e => { if(e.target.type!=='checkbox' && e.target.type!=='button') handleRowClick(song); }} style={{ cursor: 'pointer' }}>
                  <TableCell onClick={e => e.stopPropagation()}><Checkbox checked={selected.includes(song._id)} onChange={() => handleCheckbox(song._id)} /></TableCell>
                  <TableCell>{song.name}</TableCell>
                  <TableCell>{song.artist}</TableCell>

                  <TableCell><audio src={`${config.backend}/${song.song}`} controls /></TableCell>
                  <TableCell><img src={`${config.backend}/${song.img}`} alt="song_img" style={{ width: 50, borderRadius: 100 }} /></TableCell>
                  <TableCell>{song.status}{song.rejectionReason ? <span style={{color:'red',marginLeft:8}}>(Reason: {song.rejectionReason})</span> : null}</TableCell>
                  <TableCell>
                    <Button color="success" variant="contained" onClick={e => {e.stopPropagation(); handleAction(song._id, 'approved');}}>Approve</Button>
                    <Button color="error" variant="outlined" onClick={e => {e.stopPropagation(); handleRejectDialog(song);}} sx={{ ml: 1 }}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <SongDetailsModal open={modalOpen} handleClose={() => setModalOpen(false)} song={modalSong} />
          <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
            <DialogTitle>Rejection Reason</DialogTitle>
            <DialogContent>
              <TextField fullWidth label="Reason" value={rejectReason} onChange={e => setRejectReason(e.target.value)} multiline minRows={2} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
              <Button color="error" variant="contained" onClick={handleRejectConfirm}>Reject</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}
    </Box>
  );
}
