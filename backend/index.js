const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config();

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
  });
  
  console.log("Redirecting to Spotify:", authQuery);
  res.redirect(`https://accounts.spotify.com/authorize?${authQuery}`);
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
    res.send("Error during authentication");
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Spotify Auth Server');
});

app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});
