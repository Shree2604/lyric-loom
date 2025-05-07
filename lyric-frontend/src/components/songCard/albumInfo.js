import React from "react";
import "./albumInfo.css";

export default function AlbumInfo({ currentSong }) {

  return (
    <div className="albumInfo-card">
      <div className="albumName-container">
        <div className="marquee">
          <p>{currentSong.name}</p>
        </div>
      </div>
      <div className="album-info">
        <p>{currentSong.artist}</p>
      </div>
      <div className="album-release">
        <p>Vibe On Lyric_Loom</p>
      </div>
    </div>
  );
}
