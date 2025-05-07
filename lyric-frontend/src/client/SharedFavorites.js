import React, { useEffect, useState } from "react";
import axios from "axios";
import SongItem from "../components/songItem/SongItem";
import config from "../config";
import "./Favorites.css";
import { useParams } from "react-router-dom";

export default function SharedFavorites() {
  const { shareId } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedFavorites = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/shared-favorites/${shareId}`);
        if (response.data && response.data.songs) {
          setSongs(response.data.songs);
          setError("");
        } else {
          setError("No songs found for this shared playlist.");
        }
      } catch (err) {
        setError("Could not load shared favorites. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFavorites();
  }, [shareId]);

  return (
    <div className="screen-container">
      <div className="favorites-container">
        <h1>Shared Favorite Songs</h1>
        <div className="favorites-body">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : songs.length === 0 ? (
            <p>No songs in this shared favorites.</p>
          ) : (
            <div className="song-list">
              {songs.map((song) => (
                <SongItem key={song._id} song={song} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
