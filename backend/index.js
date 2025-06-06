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
  const scope = 'user-read-private user-read-email';
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

app.get('/', (req, res) => {
  res.send('Welcome to the Spotify Auth Server');
});

app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});
