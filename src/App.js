import React, { useState } from 'react';
import Wheel from './Wheel';

const App = () => {
  const [result, setResult] = useState(null);

  const handleSpinEnd = (prize) => {
    setResult(prize);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Spin the Wheel Game!</h1>
      {/* <Wheel onSpinEnd={handleSpinEnd} /> */}
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Congratulations!</h2>
          <p>You won: {result}</p>
        </div>
      )}
    </div>
  );
};

export default App;
