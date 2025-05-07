import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, Button, Box, Modal } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../config';

export default function UsersData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [growthData, setGrowthData] = useState([]);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('adminAuthToken');
      const { data } = await axios.get(`${config.lyric}/api/users`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      setUsers(data.data);
      processUserGrowthData(data.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('adminAuthToken');
      await axios.delete(`${config.lyric}/api/users/${id}`, {
        headers: {
          'x-auth-token': authToken
        }
      });
      getAllUsers(); // Refresh users after deletion
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processUserGrowthData = (userData) => {
    const growthMap = new Map();
    
    userData.forEach(user => {
      const date = user.createdAt.split(' ')[0]; // Assuming createdAt is in "DD-MM-YYYY HH:mm:ss A" format
      growthMap.set(date, (growthMap.get(date) || 0) + 1);
    });

    const sortedData = Array.from(growthMap, ([date, count]) => ({ date, newUsers: count }))
      .sort((a, b) => new Date(a.date.split('-').reverse().join('-')) - new Date(b.date.split('-').reverse().join('-')));

    let cumulativeUsers = 0;
    const finalData = sortedData.map(item => {
      cumulativeUsers += item.newUsers;
      return { ...item, totalUsers: cumulativeUsers };
    });

    setGrowthData(finalData);
  };

  const handleOpenGrowthReport = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className='screen-container'>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={5}>
        <Typography variant="h4" color={"white"} padding={"20px"}>Users</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenGrowthReport} style={{ marginRight: '20px' }}>
          User Growth Report
        </Button>
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
                <TableCell>
                  <Typography variant="h6" fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.verified ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="user-growth-report-modal"
        aria-describedby="user-growth-over-time"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            User Growth Report
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={growthData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#8884d8" />
              <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}