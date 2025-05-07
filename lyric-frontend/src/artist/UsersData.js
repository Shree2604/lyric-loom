import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';
import config from '../config';

export default function ArtistUserData() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to get all artist users
  const getAllArtists = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('artistAuthToken');
      const { data } = await axios.get(`process.env.REACT_APP_API_BASE_URL/api/users`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      // Filter out non-artist users
      const artistUsers = data.data.filter(user => user.isArtist);
      setArtists(artistUsers);
    } catch (error) {
      setError('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllArtists();
  }, []);

  return (
    <div className='screen-container'>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={5}>
        <Typography variant="h4" color={"white"} padding={"20px"}>Artists</Typography>
      </Box>
      <Paper elevation={3} style={{ marginRight: 30, marginLeft: 40 }}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Gender</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Verified</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Created At</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist._id}>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>{artist.email}</TableCell>
                  <TableCell>{artist.gender}</TableCell>
                  <TableCell>{artist.verified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{artist.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </div>
  );
}
