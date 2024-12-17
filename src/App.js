// src/App.js
import React from 'react';
import SpinWheel from './components/SpinWheel';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f0f0f0'
      // Removed flex and center styles
    }}>
      <SpinWheel />
    </div>
  );
}

export default App;
