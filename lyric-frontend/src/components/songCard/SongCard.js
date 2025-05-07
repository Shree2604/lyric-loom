import React from "react";
import AlbumImage from "./albumImage";
import "./songCard.css";
import AlbumInfo from './albumInfo';
import { useLocation } from "react-router-dom";

export default function SongCard({ total, currentIndex }) {
  const location = useLocation();
  
  const tt=total
  
  const ci=currentIndex
  // if (!total || total.length === 0 || currentIndex < 0 || currentIndex >= total.length) {
  //   // If total is empty, return a placeholder or handle the case accordingly
  //   return <div>No song data available</div>;
  // }
  // const currentSong = total[currentIndex];
  const currentSong = location.state
  console.log("csong",currentSong);

  // Ensure that currentSong is not undefined before accessing its properties
  if (!currentSong) {
    return <div>No song data available</div>;
  }

  let albumImageUrl;
  if (currentSong.img) {
    
    albumImageUrl = currentSong.img;
  } else if (currentSong.image && currentSong.image.length > 2) {
    
    albumImageUrl = currentSong.image[2].url;
  } else {
    albumImageUrl = "/frontendapp/samaa/public/default_image_url.png"; 
  }


  return (
    <div className="songCard-body flex">
      <AlbumImage url={albumImageUrl} />
      <AlbumInfo currentSong={currentSong} />
    </div>
  );
}
