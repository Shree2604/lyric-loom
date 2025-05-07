import React from 'react';
import { Typography, Button, Grid, Paper, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminHome.css'; // Custom CSS for styling

export default function AdminHome() {
  return (
    <div className="admin-home-container">
      {/* Welcome Section */}
      <Box className="welcome-section" sx={{ padding: 4, textAlign: 'center', borderRadius: 2, boxShadow: 3, animation: 'fadeIn 1s ease-out' }}>
        <Typography variant="h4" gutterBottom className="animated-text" sx={{ color: 'white' }}>Welcome, Admin!</Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'white' }}>
          Manage your users and music library easily with these features.
        </Typography>
        <Button 
          variant="contained"
          sx={{ 
            marginTop: 2, 
            pointerEvents: 'none', 
            opacity: 0.6, 
            backgroundColor: 'black', 
            color: 'white' // Button text color white
          }}
          className="animated-button"
        >
          Explore Features
        </Button>
      </Box>

      {/* Admin Features Overview Section */}
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        {/* Feature: Manage Users */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className="admin-card feature-card bounce-effect" sx={{ padding: 3, textAlign: 'center', backgroundColor: '#d45ddf' }}>
            <PeopleIcon sx={{ fontSize: 50, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Manage Users</Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
              Delete users who no longer require access.
            </Typography>
            <Button 
  variant="outlined" 
  sx={{ 
    color: '#d3d3d3', // Dull white for button text
    borderColor: '#d3d3d3', // Dull white for button border
    '&.Mui-disabled': {
      color: '#a9a9a9', // Even duller for disabled state
      borderColor: '#a9a9a9', // Even duller for disabled state
    },
  }} 
  startIcon={<DeleteIcon sx={{ color: '#d3d3d3' }} />} 
  fullWidth 
  disabled
>
  Delete Users
</Button>

          </Paper>
        </Grid>

        {/* Feature: Add Songs */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className="admin-card feature-card bounce-effect" sx={{ padding: 3, textAlign: 'center', backgroundColor: '#d45ddf' }}>
            <AddCircleIcon sx={{ fontSize: 50, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Add Songs</Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
              Upload new songs to expand the collection.
            </Typography>
            <Button 
  variant="outlined" 
  sx={{ 
    color: '#d3d3d3', // Dull white for button text
    borderColor: '#d3d3d3', // Dull white for button border
    '&.Mui-disabled': {
      color: '#a9a9a9', // Even duller for disabled state
      borderColor: '#a9a9a9', // Even duller for disabled state
    },
  }} 
  startIcon={<LibraryMusicIcon sx={{ color: '#d3d3d3' }} />} 
  fullWidth 
  disabled
>
  Add Songs
</Button>
          </Paper>
        </Grid>

        {/* Feature: Delete Songs */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} className="admin-card feature-card bounce-effect" sx={{ padding: 3, textAlign: 'center', backgroundColor: '#d45ddf' }}>
            <DeleteIcon sx={{ fontSize: 50, color: 'white' }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Delete Songs</Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'white' }}>
              Remove songs that are no longer needed.
            </Typography>
            <Button 
  variant="outlined" 
  sx={{ 
    color: '#d3d3d3',
    borderColor: '#d3d3d3', 
    '&.Mui-disabled': {
      color: '#a9a9a9', 
      borderColor: '#a9a9a9', 
    },
  }} 
  startIcon={<DeleteIcon sx={{ color: '#d3d3d3' }} />} 
  fullWidth 
  disabled
>
  Delete Songs
</Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
