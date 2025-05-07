import React from "react";
import "./instructions.css";
export default function Instructions() {
  return (
    <div className="screen-container">
      <div className="instructions">
        <h2>Instructions:</h2>
        <ul>
          <li>
            Adjust your browser dimensions for the best viewing experience.
          </li>
          <li>
            Currently, the website is designed only for desktop experience.
          </li>
          <li>
            We apologize for the inconvenience of the current lack of
            responsiveness, which will be addressed in future updates.
          </li>
          <li>
            Make sure you are logged in to access personalized playlists and
            favorite songs.
          </li>
          <li>
            Admins can manage artists and users via the dashboard after logging
            in.
          </li>
          <li>
            For artists, ensure your tracks are uploaded in high-quality formats
            for the best user experience.
          </li>
          <li>Users can explore and search for songs by artists, albums.</li>
        </ul>
      </div>
    </div>
  );
}
