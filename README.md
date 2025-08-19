# 🎧 Spotify Client 

A custom **Spotify Client** built with the **Spotify Web API**, aiming to deliver a clean, responsive, and user-friendly interface to explore, play, and manage Spotify content — including tracks, playlists, albums, and more.

--
## 🛠️ Tech Stack

| Layer        | Technology                |
|--------------|----------------------------|
| **Frontend** | React.js (with Vite)       |
| **Backend**  | Node.js with Express       |
| **Auth**     | OAuth 2.0 (Spotify)        |
| **API**      | Spotify Web API            |

---


## 📌 Features Implemented

- ✅ Spotify Login using OAuth 2.0
- ✅ User profile display
- ✅ Playback controls
- ✅ Search functionality

---

## 🧠 Future Scope

- Add playback queue 
- Integrate personalized recommendations
- Responsive UI for mobile and desktop
- Dark/light theme toggle

---

## 📎 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/spotify-client.git
   cd spotify-client

2. Create a .env file with following :
    CLIENT_ID=your_spotify_client_id
    CLIENT_SECRET=your_spotify_secret
    REDIRECT_URI=http://127.0.0.1:5000/callback
    FRONTEND_URI=http://127.0.0.1:5173
    To run on your localhost

4. Start the backend server :
    cd server
    npm install
    node index.js

6. Start the frontend :
   cd install
   npm install
   npm run dev
