import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "./components/ProfileCard";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import PlaybackControls from "./components/PlaybackControls";
import SearchBar from "./components/SearchBar";

import "./App.css";

function App() {
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };
  const handleLogout = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    console.log("🔍 useEffect triggered");
    const token = new URLSearchParams(window.location.search).get("access_token");
    console.log("🔑 Extracted Token:", token);

    if (token) {
      setAccessToken(token);
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

  // Function to play a track on Spotify via Web API
  const playTrack = (spotifyUri) => {
    if (!accessToken) {
      console.warn("No access token available to play track");
      return;
    }
    axios({
      method: "put",
      url: "https://api.spotify.com/v1/me/player/play",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        uris: [spotifyUri],
      },
    }).catch((error) => {
      console.error("Error playing track", error);
      if (error.response && error.response.status === 404) {
        alert("No active Spotify player found. Please open Spotify on your device.");
      } else if (error.response && error.response.status === 403) {
        alert("Playback not allowed — ensure your device supports playback and you have a Premium account.");
      }
    });
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <h1 className="app-title">Spotify Client</h1>
        {profile && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className={`main-content${searchFocused ? " left-aligned" : ""}`}>
        {profile && (
          <>
            <SearchBar
              accessToken={accessToken}
              onResults={setSearchResults}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="content-row">
              <div className="side-blocks">
                <ProfileCard profile={profile} />
                {accessToken && <CurrentlyPlaying accessToken={accessToken} />}
                {profile.product === "premium" ? (
                  <PlaybackControls accessToken={accessToken} />
                ) : (
                  <p className="notice">🎧 Upgrade to Spotify Premium to control playback.</p>
                )}
              </div>
              <div className="search-results">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="search-result-item"
                    onClick={() => playTrack(track.uri)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        track.album.images[2]?.url ||
                        track.album.images[1]?.url ||
                        track.album.images[0]?.url ||
                        ""
                      }
                      alt={track.name}
                      width={40}
                    />
                    <div>
                      <div>{track.name}</div>
                      <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                        {track.artists.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!profile && (
          <button className="login-button" onClick={handleLogin}>
            Login with Spotify
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
