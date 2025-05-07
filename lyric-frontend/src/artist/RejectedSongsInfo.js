import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

export default function RejectedSongsInfo({ songs }) {
  if (!songs || songs.length === 0) return null;
  return (
    <Box mt={2}>
      <Typography variant="h6" color="error" mb={1}>Rejected Songs</Typography>
      {songs.map(song => (
        <Paper key={song._id} sx={{ p: 2, mb: 2, bgcolor: '#fff8f8' }}>
          <Typography variant="subtitle1">{song.name}</Typography>
          <Chip label="Rejected" color="error" sx={{ mr: 2 }} />
          <Typography variant="body2" color="error.main">Reason: {song.rejectionReason || 'No reason provided.'}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
