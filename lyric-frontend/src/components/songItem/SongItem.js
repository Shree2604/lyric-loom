import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";
//import Player from "../Player/Player";
import "./SongItem.css";

const SongItem = ({ song, onSongUpdate, songs }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  // Check if song is liked when component mounts
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const authToken = localStorage.getItem("userAuthToken");
        if (!authToken) return;

        // Log the song ID being used
        console.log('Song object in checkIfLiked:', song);
        
        if (!song || !song._id) {
          console.error('Song or song ID is missing');
          return;
        }

        // Ensure we have the complete song ID
        const fullSongId = song._id.toString();
        console.log('Full song ID for checking like:', fullSongId);

        const response = await axios.get(
          `${config.lyric}/api/songs/check-like/${fullSongId}`,
          {
            headers: {
              "x-auth-token": authToken,
              "Content-Type": "application/json"
            }
          }
        );
        
        console.log('Like status response:', response.data);
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
        if (error.response) {
          console.log('Error response:', error.response);
          if (error.response.status === 401) {
            localStorage.removeItem("userAuthToken");
            localStorage.removeItem("user");
            localStorage.removeItem("isUserLoggedIn");
            navigate("/userlogin");
          }
        }
      }
    };

    if (song && song._id) {
      checkIfLiked();
    }
  }, [song, navigate]);

  const handleClick = () => {
    // handleAddToPlaylist();
    setClicked(false);
  };

  // const handlePlay = (song) => {
  //   console.log(song);
  //   // console.log(`${config.lyric}/${song.song}`);
  //   navigate("/player", {
  //     state: { songUrl: `${config.lyric}/${song.song}` },
  //   });
  // };

  const handlePlay = (song) => {
    // For local songs, pass the full song list and songId
    if (songs && Array.isArray(songs)) {
      navigate("/player", {
        state: {
          songId: song._id,
          songs: songs,
          source: "local"
        }
      });
    } else {
      // fallback: old logic
      const songUrl = song.song ? `${config.lyric}/${song.song}` : undefined;
      if (!songUrl) {
        console.error("Song URL is undefined!");
        return;
      }
      navigate("/player", {
        state: song,
      });
    }
  };


  useEffect(() => {
    // fetchSammaPlaylist();
  }, []);

  const handleLikeToggle = async () => {
    try {
      const authToken = localStorage.getItem("userAuthToken");
      if (!authToken) {
        alert("Please login to like songs");
        navigate("/userlogin");
        return;
      }

      if (!song || !song._id) {
        console.error("Song or song ID is missing", song);
        return;
      }

      // Ensure we have the complete song ID
      const fullSongId = song._id.toString();
      
      // Debug logging
      console.log('Song object:', song);
      console.log('Full song ID for like toggle:', fullSongId, 'Length:', fullSongId.length);
      console.log('Auth token:', authToken);

      const response = await axios({
        method: 'put',
        url: `${config.lyric}/api/songs/like/${fullSongId}`,
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'application/json'
        },
        data: {}
      });
      
      // Log the response for debugging
      console.log('Like toggle response:', response.data);

      if (response.status === 200) {
        setIsLiked(response.data.isLiked);
        // Call the update function if provided (used in Favorites page)
        if (onSongUpdate) {
          onSongUpdate();
        }
      } else {
        console.error("Failed to like song:", response.data.message);
      }
    } catch (error) {
      console.error("Error liking song:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert("Please login to like songs");
            localStorage.removeItem("userAuthToken");
            localStorage.removeItem("user");
            localStorage.removeItem("isUserLoggedIn");
            navigate("/userlogin");
            break;
          case 404:
            alert("Song not found. Please refresh the page.");
            break;
          case 400:
            alert("Invalid song ID. Please refresh the page.");
            break;
          default:
            alert("An error occurred. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };

  // Robust image URL logic for song image
  const getSongImageUrl = (song) => {
    let img = song.img || song.cover || song.image || "default_image_url.png";
    // If img is already a full URL, use as is
    if (img.startsWith('http')) return img;
    // If img starts with '/', treat as relative to backend root
    if (img.startsWith('/')) return `${config.lyric}${img}`;
    // Otherwise, treat as backend relative path
    return `${config.lyric}/${img}`;
  };

  // const fetchSammaPlaylist = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${config.lyric}/api/playlists/user-playlists`,
  //       {
  //         headers: {
  //           "x-auth-token": localStorage.getItem("userAuthToken"),
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       const sammaPlaylists = response.data.data.map((playlist) => ({
  //         id: playlist._id,
  //         name: playlist.name,
  //         images: playlist.img ? [{ url: playlist.img }] : [],
  //         tracks: { total: playlist.songs.length },
  //       }));
  //       setPlaylists(sammaPlaylists);
  //     } else {
  //       setError("Failed to fetch user playlists.");
  //       setPlaylists([]);
  //     }
  //   } catch (error) {
  //     setError("Error fetching user playlists: " + error.message);
  //     setPlaylists([]);
  //   }
  // };

  // const handleAddToPlaylist = async () => {
  //   try {
  //     const authToken = localStorage.getItem("userAuthToken");
  //     if (!authToken || !selectedPlaylist) {
  //       console.error("User not authenticated or playlist not selected");
  //       return;
  //     }

  //     const configy = {
  //       headers: {
  //         "x-auth-token": authToken,
  //       },
  //     };

  //     const response = await axios.put(
  //       `${config.lyric}/api/playlists/add-song`,
  //       {
  //         playlistId: selectedPlaylist,
  //         songId: song._id,
  //       },
  //       configy
  //     );
  //     if (response.status === 200) {
  //       // Update UI to show the song is added to playlist
  //       console.log("Song added to playlist:", response.data);
  //     } else {
  //       console.error("Failed to add song to playlist:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding song to playlist:", error);
  //   }
  // };

  return (
    <div className="song-item attractive-song-card">
      <div className="song-img-container">
        <img
          src={getSongImageUrl(song)}
          alt="Album Art"
          className="song-img attractive-song-img"
          onError={e => { e.target.onerror = null; e.target.src = '/default_image_url.png'; }}
        />
      </div>
      <div className="song-info-controls">
        <div className="song-meta">
          <p className="song-name attractive-song-name">{song.name}</p>
          <p className="artist attractive-artist">{song.artist}</p>
        </div>
        <div className="song-controls attractive-controls">
          <button className="play-btn" title="Play" onClick={() => handlePlay(song)}>
            <FaPlay size={22} />
          </button>
          <button className="like-btn" title="Like/Unlike" onClick={handleLikeToggle}>
            {isLiked ? (
              <CiHeart size={22} />
            ) : (
              <FaHeart size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongItem;
