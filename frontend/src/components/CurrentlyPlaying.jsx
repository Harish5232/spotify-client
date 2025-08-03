import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CurrentlyPlaying.css";
import.meta.env.VITE_API_URL;

function CurrentlyPlaying({ accessToken }) {
  const [track, setTrack] = useState(null);
  const [recentTrack, setRecentTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCurrentTrack = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/currently-playing`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // If Spotify API returns track info even when paused
      if (response.data && response.data.trackName) {
        setTrack(response.data);
        setRecentTrack(null);
        setLoading(false);
      } else {
        // Fallback to recently played
        const recentRes = await axios.get(
          "https://api.spotify.com/v1/me/player/recently-played?limit=1",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (recentRes.data.items && recentRes.data.items.length > 0) {
          const recent = recentRes.data.items[0].track;
          setRecentTrack({
            albumArt: recent.album.images[0].url,
            trackName: recent.name,
            artists: recent.artists.map((a) => a.name).join(", "),
          });
        } else {
          setRecentTrack(null);
        }
        setTrack(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching track:", err);
      setLoading(false);
    }
  };

  fetchCurrentTrack();
  const interval = setInterval(fetchCurrentTrack, 5000);

  return () => clearInterval(interval);
}, [accessToken]);


  if (loading && !recentTrack && !track) return <p className="loading">Loading current track...</p>;

  if (track) {
    return (
      <div className="track-card">
        <img src={track.albumArt} alt="Album Art" className="track-img" />
        <div className="track-info">
          <h3 className="track-name">{track.trackName}</h3>
          <p className="track-artists">{track.artists}</p>
        </div>
      </div>
    );
  }

  // Always show recentTrack if available, even if loading is false and track is null
  if (recentTrack) {
    return (
      <div className="track-card">
        <img src={recentTrack.albumArt} alt="Album Art" className="track-img" />
        <div className="track-info">
          <h3 className="track-name">{recentTrack.trackName}</h3>
          <p className="track-artists">{recentTrack.artists}</p>
          <span className="recent-label">Recently Played</span>
        </div>
      </div>
    );
  }

  // Optionally, show nothing or a placeholder if neither is available
  return null;
}

export default CurrentlyPlaying;
