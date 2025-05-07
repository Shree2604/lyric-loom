import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Box,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import SongForm from "../components/songForm/SongForm";
import config from "../config";

export default function SongsData() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const getAllSongs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${config.lyric}/api/songs`);
      console.log(data);
      
      setSongs(data.data);
    } catch (error) {
      setError("Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSongs();
  }, []);

  const handleSongCreated = () => {
    getAllSongs();
    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    getAllSongs();
  };

  return (
    <div className="screen-container">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={5}
      >
        <Typography variant="h4" color={"white"} padding={"20px"}>
          Songs
        </Typography>
        <Box
          display="flex"
          justifyContent="flex-start"
          paddingLeft={"20px"}
          marginRight={"30px"}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Song
          </Button>
        </Box>
      </Box>
      <Box display="flex">
        <Paper
          elevation={6}
          style={{ flex: 1, marginRight: 30, marginLeft: 40 }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : songs.length === 0 ? (
            <p style={{ fontWeight: "bold" }}>
              No songs uploaded. Be the first to add one!
            </p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Artist
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Image
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold">
                      Song
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {songs.map((song) => (
                  <TableRow key={song._id}>
                    <TableCell>{song.name}</TableCell>
                    <TableCell>{song.artist}</TableCell>

                    {/* Image Element - Fetch from uploads folder */}
                    <TableCell>
                      <img
                        src={`${config.backend}/${song.img}`}
                        alt="song_img"
                        style={{ width: 50, borderRadius: 100 }}
                      />
                    </TableCell>

                    {/* Audio Element - Fetch from uploads folder */}
                    <TableCell>
                      <audio src={`${config.backend}/${song.song}`} controls />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
        <Paper elevation={3} style={{ width: 300, height: 0, marginRight: 10 }}>
          {showForm && (
            <SongForm
              onSongCreated={handleSongCreated}
              onClose={handleCloseForm}
            />
          )}
        </Paper>
      </Box>
    </div>
  );
}
