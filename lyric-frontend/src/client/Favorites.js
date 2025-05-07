import React, { useEffect, useState } from "react";
import axios from "axios";
import SongItem from "../components/songItem/SongItem";
import config from "../config";
import "./Favorites.css";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("userAuthToken");
    const isLoggedIn = localStorage.getItem("isUserLoggedIn");
    
    if (!authToken || !isLoggedIn) {
      navigate("/userlogin");
      return;
    }
    fetchLikedSongs();
  }, [navigate]);

  // Refetch liked songs when component gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchLikedSongs();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchLikedSongs = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("userAuthToken");
      if (!authToken) {
        setError("Please login to view your favorite songs");
        navigate("/userlogin");
        return;
      }

      const response = await axios.get(`${config.lyric}/api/songs/user/liked`, {
        headers: {
          "x-auth-token": authToken,
        },
      });

      if (response.status === 200) {
        setLikedSongs(response.data.data);
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("userAuthToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isUserLoggedIn");
        navigate("/userlogin");
      } else {
        setError("Failed to fetch liked songs. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShareFavorites = async () => {
    setShareLoading(true);
    setShareError("");
    try {
      if (likedSongs.length === 0) {
        setShareError("No songs to share!");
        setShareLoading(false);
        return;
      }
      // Extract song IDs
      const songIds = likedSongs.map(song => song._id);
      const response = await axios.post(`${config.lyric}/api/shared-favorites`, { songs: songIds });
      if (response.data && response.data.shareId) {
        const url = `${window.location.origin}/favorites/shared/${response.data.shareId}`;
        setShareLink(url);
        // Optionally copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
        }
      } else {
        setShareError("Failed to generate share link.");
      }
    } catch (err) {
      setShareError("Failed to share favorites.");
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="favorites-container">
        <h1>Your Favorite Songs</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={handleShareFavorites} disabled={shareLoading} className="share-fav-btn">
            {shareLoading ? 'Generating link...' : 'Share Playlist'}
          </button>
          {shareError && <span style={{ color: 'red' }}>{shareError}</span>}
          {shareLink && (
            <span style={{ color: 'green' }}>
              Link copied! <a href={shareLink} target="_blank" rel="noopener noreferrer">Open Shared Playlist</a>
            </span>
          )}
        </div>
        <div className="favorites-body">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : likedSongs.length === 0 ? (
            <p>No favorite songs yet. Start liking songs to see them here!</p>
          ) : (
            <div className="song-list">
              {likedSongs.map((song) => (
                <SongItem key={song._id} song={song} onSongUpdate={fetchLikedSongs} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
