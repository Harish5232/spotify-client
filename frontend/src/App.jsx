import React from 'react';

function App() {
  const handleLogin = () => {
    // Redirect to your backend login route
    window.location.href = 'http://127.0.0.1:5000/login';
  };

  return (
    <div style={styles.container}>
      <h1>Spotify Client</h1>
      <button style={styles.button} onClick={handleLogin}>
        Login with Spotify
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#191414',
    color: '#1DB954',
    fontFamily: 'sans-serif',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
};

export default App;
