import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Welcome to the App</h1>
      <Link to="/dashboard" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Home;
