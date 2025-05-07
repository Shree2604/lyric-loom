import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableRow, TableCell } from '@mui/material';

export default function SongDetailsModal({ open, handleClose, song }) {
  if (!song) return null;
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 500, mx: 'auto', my: 8 }}>
        <Typography variant="h6" mb={2}>Song Details</Typography>
        <Table>
          <TableBody>
            <TableRow><TableCell>Name</TableCell><TableCell>{song.name}</TableCell></TableRow>
            <TableRow><TableCell>Artist</TableCell><TableCell>{song.artist}</TableCell></TableRow>
            <TableRow><TableCell>Artist Email</TableCell><TableCell>{song.artistEmail || '-'}</TableCell></TableRow>
            <TableRow><TableCell>Status</TableCell><TableCell>{song.status}</TableCell></TableRow>
            <TableRow><TableCell>Rejection Reason</TableCell><TableCell>{song.rejectionReason || '-'}</TableCell></TableRow>
            <TableRow><TableCell>Created At</TableCell><TableCell>{new Date(song.createdAt).toLocaleString()}</TableCell></TableRow>
            <TableRow><TableCell>Audio</TableCell><TableCell><audio src={song.song} controls /></TableCell></TableRow>
            <TableRow><TableCell>Image</TableCell><TableCell><img src={song.img} alt="song_img" style={{ width: 50, borderRadius: 100 }} /></TableCell></TableRow>
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
}
