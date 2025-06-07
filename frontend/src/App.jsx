import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "./components/ProfileCard";
import "./App.css";

function App() {
  const [profile, setProfile] = useState(null);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };

 useEffect(() => {
  console.log("🔍 useEffect triggered");
  const token = new URLSearchParams(window.location.search).get("access_token");
  console.log("🔑 Extracted Token:", token);

  if (token) {
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("🎵 Spotify Profile:", res.data);
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("🚨 API Error:", err);
      });
  } else {
    console.warn("❌ No token in URL");
  }
}, []);



  return (
    <div className="app-container">
      <h1 className="app-title">Spotify Client</h1>
      {!profile ? (
        <button className="login-button" onClick={handleLogin}>
          Login with Spotify
        </button>
      ) : (
        <ProfileCard profile={profile} />
      )}
    </div>
  );
}

export default App;
