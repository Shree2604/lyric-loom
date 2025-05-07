import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import "./ArtistLogin.css";
import config from "../config";

export default function ArtistLogin({ onArtistLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`process.env.REACT_APP_API_BASE_URL/api/login/`, {
        email,
        password,
      });

      const { data } = response;
      if (!data.data.isArtist) {
        throw new Error("You are not authorized to log in as artist.");
      }
      onArtistLogin();
      localStorage.setItem("artistAuthToken", data.authToken); // Store the token in local storage
      localStorage.setItem("user", JSON.stringify(response.data.data));
      navigate("/artisthome");
    } catch (error) {
      setError(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
    <style>
      {`#form{
      left:500px;
      top:100px;}
      
      `}
    </style>
      <div id="form-ui">
        <form onSubmit={handleSubmit} id="form">
          <div id="form-body">
            <div id="welcome-lines">
              <div id="welcome-line-1">Lyric_Loom</div>
              <div id="welcome-line-2">Welcome Back!</div>
              <div id="welcome-line-2">Artist Space</div>
            </div>
            <div id="input-area">
              <div className="form-inp">
                <input
                  placeholder="Email Address"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-inp">
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div id="submit-button-cvr">
              <button id="submit-button" type="submit" disabled={loading}>
                {" "}
                {/* Disable button when loading */}
                {loading ? "Logging in..." : "Login"}{" "}
                {/* Display loading state text */}
              </button>
            </div>
            {/* <div id="forgot-pass">
              <a href="#">Forgot password?</a>
            </div> */}
            {error && <div className="error-message">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
