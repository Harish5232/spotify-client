const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);


const app = express();
app.use(cors());

const PORT = 5000;

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-read-playback-state';
  const authQuery = querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI,
    show_dialog : true
  });

  const fullUrl = `https://accounts.spotify.com/authorize?${authQuery}`;
  console.log("Redirecting to Spotify:", fullUrl); // ✅ print full URL
  res.redirect(fullUrl);
});



app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = response.data;

    res.redirect(`${process.env.FRONTEND_URI}/?access_token=${access_token}`);
  } catch (error) {
    console.error("Spotify token error:", error.response?.data || error.message);
    res.send("Error during authentication");
  }
});

app.get("/currently-playing", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If no track is playing
    if (response.status === 204 || response.data === "") {
      return res.json({ isPlaying: false });
    }

    const item = response.data.item;
    const track = {
      isPlaying: response.data.is_playing,
      name: item.name,
      album: {
        name: item.album.name,
        image: item.album.images[0].url,
      },
      artists: item.artists.map((artist) => artist.name).join(", "),
    };

    res.json(track);
  } catch (error) {
    console.error("Error fetching currently playing track:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch currently playing track" });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the Spotify Auth Server');
});

app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});
