import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingPlaylists } from "../slices/playlistSlice";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import "./Library.css";

const Trending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, trendingPlaylists } = useSelector(
    (state) => state.playlists
  );

  useEffect(() => {
    dispatch(fetchTrendingPlaylists());
  }, [dispatch]);

  const navigateToPlayer = (id) => {
    navigate("/player", { state: { id: id, source: "saavn" } });
  };

  return (
    <div className="screen-container">
      <header className="header">
        <h1 className="header-title">Trending Playlists</h1>
        <h2 className="header-title">Lyric_Loom Music</h2>
      </header>
      <div className="library-body">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          trendingPlaylists.map((playlist) => (
            <div
              className="playlist-card"
              key={playlist.id}
              onClick={() => navigateToPlayer(playlist.id)}
            >
              <img
                src={
                  playlist.images.length > 0
                    ? playlist.images[0].url
                    : "default_image_url.png"
                }
                alt="Playlist Art"
                className="playlist-image"
              />
              <p className="playlist-title">{playlist.name}</p>
              <div className="playlist-fade">
                <IconContext.Provider
                  value={{ size: "50px", color: "#E99D72" }}
                >
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Trending;
