import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Paper } from '@mui/material';
import config from '../config';
import { getArtistInfo } from './ArtistNews';

export default function ArtistRejectedPopup() {
  const [rejectedSongs, setRejectedSongs] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRejectedSongs = async () => {
      try {
        const authToken = localStorage.getItem('artistAuthToken');
        if (!authToken) {
          console.log('No artistAuthToken found');
          setError('No artist login token found.');
          setShowDialog(true);
          return;
        }
        const { artistId } = getArtistInfo();
        const acknowledgedKey = `artistRejectedAcknowledged_${artistId}`;
        console.log('DEBUG: Artist ID:', artistId);
        console.log('DEBUG: LocalStorage Key:', acknowledgedKey);
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/songs/mine`, {
          headers: { 'x-auth-token': authToken }
        });
        const rejected = data.data.filter(song => song.status === 'rejected');
        setRejectedSongs(rejected);
        // Get previously acknowledged rejected song IDs from localStorage (per artist)
        const acknowledged = JSON.parse(localStorage.getItem(acknowledgedKey) || '[]');
        const currentRejectedIds = rejected.map(song => song._id);
        // Debug logs
        console.log('DEBUG: Current rejected IDs:', currentRejectedIds);
        console.log('DEBUG: Acknowledged IDs:', acknowledged);
        // Show popup only if there are new rejected song IDs
        const hasNewRejection = currentRejectedIds.some(id => !acknowledged.includes(id));
        if (hasNewRejection && rejected.length > 0) {
          console.log('DEBUG: Popup will be shown: new rejections detected');
          setShowDialog(true);
        } else {
          console.log('DEBUG: Popup will NOT be shown: all rejections acknowledged');
        }
      } catch (err) {
        console.error('Error fetching rejected songs:', err);
        setError('Error fetching rejected songs: ' + (err?.response?.data?.message || err.message));
        console.log('DEBUG: Popup will be shown: error occurred');
        setShowDialog(true);
      }
    };
    fetchRejectedSongs();
  }, []);

  if (!showDialog) return null;

  // Handler for OK button: acknowledge all current rejected songs
  const handleAcknowledge = () => {
    const { artistId } = getArtistInfo();
    const acknowledgedKey = `artistRejectedAcknowledged_${artistId}`;
    const currentRejectedIds = rejectedSongs.map(song => song._id);
    // Merge with previous acknowledgments (per artist)
    const prev = JSON.parse(localStorage.getItem(acknowledgedKey) || '[]');
    const merged = Array.from(new Set([...prev, ...currentRejectedIds]));
    localStorage.setItem(acknowledgedKey, JSON.stringify(merged));
    console.log('DEBUG: handleAcknowledge called. Saved acknowledged IDs:', merged, 'to key:', acknowledgedKey);
    setShowDialog(false);
  };


  return (
    <Dialog open={showDialog} onClose={handleAcknowledge}>
      <DialogTitle>Song Rejection Notice</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        {!error && rejectedSongs.map(song => (
          <Paper key={song._id} sx={{ p: 2, mb: 2, bgcolor: '#fff8f8' }}>
            <Typography variant="subtitle1">{song.name}</Typography>
            <Typography variant="body2" color="error.main">Reason: {song.rejectionReason || 'No reason provided.'}</Typography>
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAcknowledge} color="primary" variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
}
