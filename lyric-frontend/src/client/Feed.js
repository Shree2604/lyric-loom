import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylistsByCategory } from "../slices/playlistSlice"; // Import the Redux action
import { useNavigate } from "react-router-dom";
import "./feed.css";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access Redux state for playlists
  const { loading, error, playlists } = useSelector((state) => state.playlists);

  // Fetch default "Pop" category on component load
  useEffect(() => {
    dispatch(fetchPlaylistsByCategory("Pop"));
  }, [dispatch]);

  // Function to handle category click
  const handleCategoryClick = (category) => {
    dispatch(fetchPlaylistsByCategory(category));
  };

  // Function to navigate to the player
  const navigateToPlayer = (playlist) => {
    console.log("Navigating to player with playlist:", playlist);
    // Pass the entire playlist object with all metadata
    navigate("/player", { 
      state: { 
        id: playlist.id, 
        source: "saavn",
        name: playlist.name,
        image: playlist.image,
        url: playlist.url
      } 
    });
  };

  return (
    <div className="screen-container">
      <div className="background-black text-white padding-big">
        {/* Categories Section */}
        <div className="grid grid-2 gap-big">
          {/* Modern Categories */}
          <div>
            <h2 className="font-large bold margin-bottom">Categories</h2>
            <div className="grid grid-3 gap-small">
              {[
                "Pop",
                "Chill",
                "Sad",
                "Lofi",
                "Romantic",
                "Party",
                "Workout",
                "Focus",
                "Sleep",
              ].map((category) => (
                <div
                  key={category}
                  className={`padding-small rounded category-item ${category.toLowerCase()}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Old is Gold Categories */}
          <div>
            <h2 className="font-large bold margin-bottom">Old is Gold</h2>
            <div className="grid grid-1 gap-small">
              {["2000s", "1990s", "1980s", "1970s"].map((era) => (
                <div
                  key={era}
                  className="bg-light padding-small rounded old-category"
                  onClick={() => handleCategoryClick(era)}
                >
                  Golden age of {era.slice(0, -1)}
                  {era.slice(-1) === "s" ? "" : "s"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Playlists Section */}
        <div className="margin-top-big">
          <h2 className="font-large bold margin-bottom flex align-center">
            Playlists
            {loading && <span className="text-red margin-left-small">🔴</span>}
          </h2>
          <div className="grid grid-3 gap-big">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <div
                  className="card"
                  key={playlist.id}
                  onClick={() => navigateToPlayer(playlist)}
                >
                  <img
                    src={
                      playlist.images.length > 0
                        ? playlist.images[0].url
                        : "default_image_url.png"
                    }
                    alt="Playlist Art"
                    className="card-image"
                  />
                  <div className="card-content">
                    <h3 className="card-title">{playlist.name}</h3>
                    <p className="card-description">
                      {playlist.tracks.total} Songs
                    </p>
                  </div>
                  <button className="card-button">Listen Now</button>
                </div>
              ))
            ) : (
              <p>No playlists found for the selected category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
