import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { MusicNote, AddCircleOutline, LibraryMusic } from '@mui/icons-material';
import config from '../config';
import ArtistBio from "./ArtistNews";

// Styling for the animated button hover effect
const StyledButton = styled(Button)({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});

// Music note icon with bounce animation
const AnimatedMusicNote = styled(MusicNote)(({ theme }) => ({
  fontSize: '80px',
  color: '#d45ddf',
  animation: 'bounce 2s infinite',
}));

// Internal keyframe animations
const bounceAnimation = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  }
`;

const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const zoomInAnimation = `
  @keyframes zoomIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;


export default function ArtistHome() {
  const [rejectedSongs, setRejectedSongs] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const fetchRejectedSongs = async () => {
      try {
        const authToken = localStorage.getItem('artistAuthToken');
        const { data } = await axios.get(`process.env.REACT_APP_API_BASE_URL/api/songs/mine`, {
          headers: { 'x-auth-token': authToken }
        });
        const rejected = data.data.filter(song => song.status === 'rejected');
        if (rejected.length > 0) {
          setRejectedSongs(rejected);
          setShowDialog(true);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchRejectedSongs();
  }, []);

  return (
    <>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Song Rejection Notice</DialogTitle>
        <DialogContent>
          {rejectedSongs.map(song => (
            <Paper key={song._id} sx={{ p: 2, mb: 2, bgcolor: '#fff8f8' }}>
              <Typography variant="subtitle1">{song.name}</Typography>
              <Typography variant="body2" color="error.main">Reason: {song.rejectionReason || 'No reason provided.'}</Typography>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary" variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
      <div
        className='screen-container'
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
      {/* Insert CSS keyframes for animations */}
      <style>
        {bounceAnimation}
        {fadeInAnimation}
        {zoomInAnimation}
      </style>

      {/* Welcome message */}
      <Box
        textAlign='center'
        padding={3}
        sx={{ animation: 'fadeIn 2s ease-in' }}
      >
        <Typography variant='h3' color='#d45ddf' gutterBottom>
          Welcome, Talented Artist!
        </Typography>
        <Typography variant='h6' color='white' gutterBottom>
          Create, Share, and Explore the World of Music.
        </Typography>

        {/* Animated music note */}
        <Box marginY={4}>
          <AnimatedMusicNote sx={{ animation: 'bounce 2s infinite' }} />
        </Box>
      </Box>

      {/* Main content */}
      <ArtistBio />

      {/* Extra music-related info section */}
      <Box padding={4} textAlign='center' sx={{ animation: 'fadeIn 2s ease-in' }}>
        <Typography variant='h5' color='white' marginY={2}>
          🎶 What would you like to do today? 🎶
        </Typography>
        <Typography variant='body1' color='white' marginY={2}>
          Whether you're here to upload your latest creation or explore the songs of other artists, we have everything you need to grow your musical career.
        </Typography>
        <Button variant="contained" color="secondary" style={{marginTop: 24}} onClick={() => setShowRequests(r => !r)}>
          {showRequests ? 'Hide' : 'Show'} Connection Requests
        </Button>
      </Box>
      </div>
    </>
  );
}
