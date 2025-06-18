import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CurrentlyPlaying.css";

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
          console.log("Current Playing response:",response.data);
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

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000); // fetch every 5 sec

    
    return () => clearInterval(interval);
  }, [accessToken]);

  if (loading) return <p className="loading">Loading current track...</p>;
  if (!track) return <p className="loading">Currently not playing anything.</p>;

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

export default CurrentlyPlaying;
