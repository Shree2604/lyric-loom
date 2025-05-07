import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Paper, Box, Chip } from '@mui/material';
import config from '../config';
import RejectedSongsInfo from './RejectedSongsInfo';

function MyUploads() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMySongs = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('artistAuthToken');
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/songs/mine`, {
        headers: { 'x-auth-token': authToken }
      });
      setSongs(data.data);
    } catch (err) {
      setError('Failed to fetch your uploads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMySongs(); }, []);

  const statusColor = (status) => {
    if (status === 'approved') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'rejected') return 'error';
    return 'default';
  };

  const rejectedSongs = songs.filter(song => song.status === 'rejected');
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>My Uploaded Songs</Typography>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        <>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Audio</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {songs.map(song => (
                  <TableRow key={song._id}>
                    <TableCell>{song.name}</TableCell>
                    <TableCell><audio src={`${config.backend}/${song.song}`} controls /></TableCell>
                    <TableCell><img src={`${config.backend}/${song.img}`} alt="song_img" style={{ width: 50, borderRadius: 100 }} /></TableCell>
                    <TableCell>
                      <Chip label={song.status} color={statusColor(song.status)} />
                      {song.status === 'rejected' && (
                        <span style={{ color: 'red', marginLeft: 8 }}>(Rejected by Admin)</span>
                      )}
                      {song.status === 'approved' && song.uploadedByAdmin && (
                        <span style={{ color: 'green', marginLeft: 8 }}>(Uploaded by Admin)</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <RejectedSongsInfo songs={rejectedSongs} />
        </>
      )}
    </Box>
  );
}

export default MyUploads;
