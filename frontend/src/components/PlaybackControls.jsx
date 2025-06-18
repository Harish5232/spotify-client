
import React, { useState } from "react";

const PlaybackControls = ({ accessToken }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    const res = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (data?.is_playing) {
      await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(false);
    } else {
      await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const handlePrevious = () => {
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return (
    <div className="controls">
      <button onClick={handlePrevious}>⏮️</button>
      <button onClick={handlePlayPause}>{isPlaying ? "⏸️" : "▶️"}</button>
      <button onClick={handleNext}>⏭️</button>
    </div>
  );
};

export default PlaybackControls;
