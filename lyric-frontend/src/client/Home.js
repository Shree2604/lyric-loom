import React, { useEffect, useState } from "react";
import "./home.css";
import axios from "axios";
import SongItem from "../components/songItem/SongItem";
import Search from "../components/search/Search";
import config from "../config";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(user ? user.name : "");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAllSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/songs?status=approved`);
      console.log('Raw API response:', response);
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format from API');
      }

      const songs = response.data.data;
      console.log('Fetched songs:', songs);
      
      // Ensure all songs have valid IDs
      const validSongs = songs.filter(song => {
        if (!song || !song._id) {
          console.warn('Invalid song data:', song);
          return false;
        }
        // Ensure ID is a string
        song._id = song._id.toString();
        return true;
      });

      if (validSongs.length !== songs.length) {
        console.warn(`Filtered out ${songs.length - validSongs.length} invalid songs`);
      }
      
      console.log('Valid songs with string IDs:', validSongs);
      // Ensure each song's 'song' property is a full URL
const songsWithFullUrl = validSongs.map(song => {
  let img = song.img || song.cover || song.image || "/frontendapp/samaa/public/default_image_url.png";
  if (img && !img.startsWith('http') && !img.startsWith('/')) {
    img = `${process.env.REACT_APP_API_BASE_URL}/${img}`;
  }
  let songUrl = song.song && !song.song.startsWith('http') ? `${process.env.REACT_APP_API_BASE_URL}/${song.song}` : song.song;
  return { ...song, song: songUrl, img };
});
setSongs(songsWithFullUrl);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError(error.response?.data?.message || "Failed to fetch songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSongs();
  }, []);

  return (
    <div className="screen-container">
      <div className="screen-container-home">
        <div className="welcomeCardAndSongBody">
          <div className="card">
            <h1 className="title">Dive into Nirvana!</h1>
            <h2 className="subtitle">Welcome {name}</h2>
            <p className="description">
              Your favorite songs and artists are just a click away. Rediscover
              the magic of your top picks.
            </p>
            <div className="user-info">
              <div className="user-profile">
                <img
                  src="samaa_home_screen_logo.png"
                  alt="Album Art"
                  className="avatar"
                  crossorigin="anonymous"
                />
                <div>
                  <p className="label">Lyric_Loom</p>
                </div>
              </div>
            </div>
          </div>
          <div className="song-body">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="song-list">
                {songs.map((song) => {
                  if (!song || !song._id) {
                    console.warn('Invalid song data:', song);
                    return null;
                  }
                  return <SongItem key={song._id} song={song} songs={songs} />;
                })}
              </div>
            )}
          </div>
        </div>

        <div className="right-search-body">
          <div className="search-body">
            <Search />
          </div>
        </div>
      </div>
    </div>
  );
}
