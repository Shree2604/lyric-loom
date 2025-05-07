import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userlogin.css";
import config from "../config";

export default function UserLogin({ onUserLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to validate email
  const validateEmail = (email) => {
    if (!email) {
      setEmailError("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // Function to validate password
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required.");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (emailError || passwordError) return;

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        onUserLogin();
        localStorage.setItem("userAuthToken", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        console.log("Login successful:", response.data.message);
        navigate("/home");
      } else {
        console.error("Login failed:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error.response);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "An error occurred while logging in. Please try again later."
        );
      }
      // Show rate limit message if status is 429
      if (error.response && error.response.status === 429) {
        setErrorMessage("Too many login attempts. Please wait and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
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
              <div id="welcome-line-2">Dive into nirvana</div>
              <div id="welcome-line-2">Welcome Back!</div>
            </div>
            <div id="input-area">
              <input
                className="form-input"
                placeholder="Email Address"
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && <div style={{ color: "red" }}>{emailError}</div>}

              <input
                className="form-input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && (
                <div style={{ color: "red" }}>{passwordError}</div>
              )}
            </div>

            <div id="submit-button-cvr">
              <button id="submit-button" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
