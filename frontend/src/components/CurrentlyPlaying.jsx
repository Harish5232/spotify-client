import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function CurrentlyPlaying({ accessToken }) {
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

  if (loading) return <p className="loading">Loading current track...</p>;
  if (!track) return <p className="loading">Currently not playing anything.</p>;

  return (
    <div className="track-card">
      <img src={track.album.image} alt="Album Art" className="track-img" />
      <div className="track-info">
        <h3 className="track-name">{track.name}</h3>
        <p className="track-artists">{track.artists}</p>
      </div>
    </div>
  );
}

export default CurrentlyPlaying;
