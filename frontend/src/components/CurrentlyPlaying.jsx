import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrentlyPlaying = ({ accessToken }) => {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCurrentTrack = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/currently-playing", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("🎧 Currently Playing API Response:", response); // ✅ Correct variable

      if (response.data.isPlaying) {
        setTrack(response.data);
      } else {
        setTrack(null);
      }
    } catch (err) {
      console.error("Error fetching track:", err);
    } finally {
      setLoading(false);
    }
  };

  if (accessToken) {
    fetchCurrentTrack();
  }
}, [accessToken]);


  if (loading) return <p className="loading">Loading now playing...</p>;
  if (!track) return <p className="loading">Nothing is currently playing</p>;

  return (
    <div className="track-info">
      <img src={track.albumArt} alt="Album Art" className="profile-img" />
      <h3>{track.trackName}</h3>
      <p>{track.artists}</p>
    </div>
  );
};

export default CurrentlyPlaying;
