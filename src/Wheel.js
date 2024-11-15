import React, { useState } from 'react';
import './Wheel.css';

const Wheel = ({ onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const prizes = [
    '5 Coins', '10 Coins', '15 Coins', '20 Coins', '25 Coins', '30 Coins', 
    '50 Coins', '100 Coins', '150 Coins', '200 Coins', '300 Coins', 
    '400 Coins', '500 Coins', 'Home Appliance'
  ];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomSpin = Math.floor(Math.random() * 360) + 3600; // Ensure a full spin plus random angle
    const selectedPrizeIndex = Math.floor(((randomSpin % 360) / 360) * prizes.length);
    const selectedPrize = prizes[selectedPrizeIndex];

    // Start the spin
    const wheelElement = document.getElementById('wheel');
    wheelElement.style.transition = 'transform 4s ease-out';
    wheelElement.style.transform = `rotate(${randomSpin}deg)`;

    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(selectedPrize);
    }, 4000); // Spin duration
  };

  return (
    <div className="wheel-container">
      <div id="wheel" className="wheel">
        {prizes.map((prize, index) => (
          <div
            key={index}
            className="segment"
            style={{
              transform: `rotate(${(index * 360) / prizes.length}deg)`,
              backgroundColor: index % 2 === 0 ? '#0033ff' : '#000000',
            }}
          >
            <span>{prize}</span>
          </div>
        ))}
      </div>
      <div className="pointer"></div>
      <button onClick={handleSpin} disabled={isSpinning} className="spin-button">
        {isSpinning ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default Wheel;
