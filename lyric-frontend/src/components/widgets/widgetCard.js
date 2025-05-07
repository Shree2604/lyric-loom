import React from "react";
import "./widgetCard.css";
import WidgetEntry from "./widgetEntry";
import { useNavigate } from "react-router-dom";

export default function WidgetCard({ title, songs }) {
  const navigate = useNavigate();

  const handlePlayClick = (song) => {    
    // Navigate to /player with songId, full section song list, and source
    navigate("/player", {
      state: {
        songId: song._id,
        songs: songs,
        source: "local"
      }
    });
  };

  return (
    <div className="widgetcard-body">
      <p className="widget-title">{title}</p>
      {songs.map((song) => (
        <WidgetEntry
          key={song._id} // Ensure each entry has a unique key
          title={song.name}
          subtitle={song.artist}
          onClick={() => handlePlayClick(song)} // Pass songId to handlePlayClick
        />
      ))}
    </div>
  );
}
