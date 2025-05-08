import React, { useEffect, useState } from "react";
import axios from "axios";
import SongItem from "../components/songItem/SongItem";
import config from "../config";

export default function FavouritesPage() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("userAuthToken");
        if (!authToken) {
          console.error("User not authenticated");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/songs/liked`, 
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );

        if (response.status === 200) {
          setLikedSongs(response.data.data); 
        } else {
          setError("Failed to fetch liked songs.");
        }
      } catch (error) {
        setError("Error fetching liked songs: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  return (
    <div>
      <h1>Favourites</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : likedSongs.length > 0 ? (
        <div className="song-list">
          {likedSongs.map((song) => (
            <SongItem key={song._id} song={song} />
          ))}
        </div>
      ) : (
        <p>No liked songs found.</p>
      )}
    </div>
  );
}
