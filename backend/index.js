const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = 5000;

app.get("/login", (req, res) => {
  const scope =
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing";
  const authQuery = querystring.stringify({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri: process.env.REDIRECT_URI,
    show_dialog: true,
  });
  const fullUrl = `https://accounts.spotify.com/authorize?${authQuery}`;
  console.log("Redirecting to Spotify:", fullUrl);
  res.redirect(fullUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    // Redirect with both tokens
    res.redirect(
      `${process.env.FRONTEND_URI}/?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    console.error("Spotify token error:", error.response?.data || error.message);
    res.send("Error during authentication");
  }
});

// New Route for Refreshing Tokens
app.get("/refresh_token", async (req, res) => {
  const refreshToken = req.query.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh_token" });
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
});

// Route for Currently Playing
app.get("/currently-playing", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  console.log("Received access token:", accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        validateStatus: (status) => status < 500, // ✅ IMPORTANT
      }
    );

    if (response.status === 204 || !response.data?.item) {
      return res.json({ isPlaying: false }); // ✅ This must be hit
    }

    const track = response.data.item;

    const trackData = {
      trackName: track.name,
      artists: track.artists.map((artist) => artist.name).join(", "),
      albumArt: track.album?.images?.[0]?.url || null,
      isPlaying: response.data.is_playing,
    };
    res.json(trackData);
  } catch (error) {
    console.error("Error fetching current track:", error.message);
    res.status(500).json({ error: "Failed to fetch currently playing track" }); // ⚡️ This causes the 500
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Spotify Auth Server");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
