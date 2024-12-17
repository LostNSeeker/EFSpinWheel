// src/components/SpinWheel.js
import React, { useState } from "react";
import "./SpinWheel.css";

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [coins, setCoins] = useState(0);

  const segments = [
    { text: "5 Coins", color: "#FF69B4" },
    { text: "10 Coins", color: "#FF0000" },
    { text: "5 Coins", color: "#FF69B4" },
    { text: "15 Coins", color: "#808080" },
    { text: "5 Coins", color: "#FF69B4" },
    { text: "20 Coins", color: "#90EE90" },
    { text: "30 Coins", color: "#FFD700" },
    { text: "5 Coins", color: "#FF69B4" },
    { text: "50 Coins", color: "#4169E1" },
    { text: "100 Coins", color: "#00CED1" },
    { text: "10 Coins", color: "#FF0000" },
    { text: "15 Coins", color: "#808080" },
    { text: "10 Coins", color: "#FF0000" },
    { text: "200 Coins", color: "#FFA500" },
  ];

  const polarToCartesian = (centerX, centerY, radius, angle) => {
    const angleInRadians = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const getSegmentPath = (index) => {
    const angle = 360 / segments.length;
    const startAngle = index * angle - 90 + angle / 2;
    const endAngle = startAngle + angle;
    const start = polarToCartesian(150, 150, 150, startAngle);
    const end = polarToCartesian(150, 150, 150, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      "M",
      150,
      150,
      "L",
      start.x,
      start.y,
      "A",
      150,
      150,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const getTextPath = (index) => {
    const angle = 360 / segments.length;
    const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const x2 = 150 + 130 * Math.cos(midAngle);
    const y2 = 150 + 130 * Math.sin(midAngle);
    return `M 150,150 L ${x2},${y2}`;
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const fiveCoinIndices = segments
      .map((segment, index) => (segment.text === "5 Coins" ? index : -1))
      .filter((index) => index !== -1);

    const winningIndex =
      fiveCoinIndices[Math.floor(Math.random() * fiveCoinIndices.length)];
    const baseSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    const targetRotation =
      baseSpins + (360 - winningIndex * (360 / segments.length));

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowModal(true);
    }, 4000);
  };

  const handleClaimPrize = () => {
    setShowModal(false);
    setShowRegisterPopup(true);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setCoins(coins + 5);
    setShowRegisterPopup(false);
    setShowSuccessMessage(true);

    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  return (
    <>
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 7H3V5h18v2zm0 10H3V9h18v8zm-4-4H5v2h12v-2z"/>
          </svg>
          Wallet: {coins} Coins
        </div>
        <div className="header-center">
          <img src="/buyonegramlogo.jpeg" alt="Logo" className="logo" />
        </div>
        <div className="header-right">
          <button className="shop-now-button">Shop Now</button>
        </div>
      </header>

      <div className="main-content">
        <div className="wheel-container">
          <div className="pointer"></div>
          <div className="wheel-wrapper">
            <svg
              className={`wheel ${isSpinning ? "spinning" : ""}`}
              viewBox="0 0 300 300"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <defs>
                {segments.map((_, index) => (
                  <path
                    key={`text-path-${index}`}
                    id={`text-path-${index}`}
                    d={getTextPath(index)}
                  />
                ))}
              </defs>
              <g>
                {segments.map((segment, index) => (
                  <g key={index}>
                    <path
                      d={getSegmentPath(index)}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="1"
                    />
                    <text
                      dy="-5"
                      fill="white"
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))",
                      }}
                    >
                      <textPath
                        href={`#text-path-${index}`}
                        startOffset="50%"
                        textAnchor="start"
                      >
                        {segment.text}
                      </textPath>
                    </text>
                  </g>
                ))}
                <circle cx="150" cy="150" r="40" fill="black" />
              </g>
            </svg>
          </div>

          <button
            className="spin-button"
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? "Spinning..." : "SPIN"}
          </button>
        </div>

        {/* Winning Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>🎉 Congratulations!</h2>
              <p>You've won 5 coins!</p>
              <button className="continue-button" onClick={handleClaimPrize}>
                Claim Prize
              </button>
            </div>
          </div>
        )}

        {/* Registration Popup */}
        {showRegisterPopup && (
          <div
            className="modal-overlay"
            onClick={() => setShowRegisterPopup(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Register to Claim</h2>
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input id="email" type="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input id="phone" type="tel" required />
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Message Popup */}
        {showSuccessMessage && (
          <div
            className="modal-overlay"
            onClick={() => setShowSuccessMessage(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>🎉 Congratulations!</h2>
              <p>Coin added successfully in wallet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with CSS Marquee */}
      <footer className="footer">
        <div className="marquee-container">
          <div className="marquee-content">
            This is a demo marquee scrolling text. You can put any text or offers here!
          </div>
        </div>
      </footer>
    </>
  );
};

export default SpinWheel;
