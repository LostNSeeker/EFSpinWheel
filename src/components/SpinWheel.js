import React, { useState } from "react";
import { supabase } from "../config/supabaseClient";
import "./SpinWheel.css";

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCooldownMessage, setShowCooldownMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [cooldownTime, setCooldownTime] = useState("");
  const [coins, setCoins] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const segments = [
    { text: "Resort Paradise", color: "#FF69B4", value: 5 },
    { text: "Cherry Restaurant", color: "#FF0000", value: 10 },
    { text: "Smart Pind", color: "#FF69B4", value: 5 },
    { text: "Choolha Chowki", color: "#808080", value: 15 },
    { text: "Bitter & Sweet", color: "#FF69B4", value: 5 },
    { text: "Food Studio", color: "#90EE90", value: 20 },
    { text: "City Bytes", color: "#FFD700", value: 30 },
    { text: "Taste & Elements", color: "#FF69B4", value: 5 },
    { text: "50 Coins", color: "#4169E1", value: 50 },
    { text: "100 Coins", color: "#00CED1", value: 100 },
    { text: "10 Coins", color: "#FF0000", value: 10 }
  ];

  const fiveCoinIndices = segments
    .map((segment, index) => (segment.value === 5 ? index : -1))
    .filter((index) => index !== -1);

  const getSegmentPath = (index, outerRadius = 150, innerRadius = 50) => {
    const angle = 360 / segments.length;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const outerStart = {
      x: 150 + outerRadius * Math.cos(startRad),
      y: 150 + outerRadius * Math.sin(startRad)
    };
    const outerEnd = {
      x: 150 + outerRadius * Math.cos(endRad),
      y: 150 + outerRadius * Math.sin(endRad)
    };
    const innerStart = {
      x: 150 + innerRadius * Math.cos(startRad),
      y: 150 + innerRadius * Math.sin(startRad)
    };
    const innerEnd = {
      x: 150 + innerRadius * Math.cos(endRad),
      y: 150 + innerRadius * Math.sin(endRad)
    };
    
    return `
      M ${outerStart.x} ${outerStart.y}
      A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}
      L ${innerEnd.x} ${innerEnd.y}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}
      Z
    `;
  };

  const getTextPath = (index) => {
    const angle = 360 / segments.length;
    const midAngle = (index * angle + angle / 2 - 90) * (Math.PI / 180);
    const startRadius = 65;
    const endRadius = 130;
    const x1 = 150 + startRadius * Math.cos(midAngle);
    const y1 = 150 + startRadius * Math.sin(midAngle);
    const x2 = 150 + endRadius * Math.cos(midAngle);
    const y2 = 150 + endRadius * Math.sin(midAngle);
    return `M ${x1},${y1} L ${x2},${y2}`;
  };

  const spinWheel = async () => {
    if (isSpinning || isCheckingEligibility) return;
    setIsSpinning(true);
    
    const winningIndex = fiveCoinIndices[Math.floor(Math.random() * fiveCoinIndices.length)];
    const baseSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    const targetRotation = baseSpins + (360 - winningIndex * (360 / segments.length));
    
    setRotation(targetRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setShowModal(true);
    }, 4000);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <svg className="wallet-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 7H3V5h18v2zm0 10H3V9h18v8zm-4-4H5v2h12v-2z" />
          </svg>
          {coins} Coins
        </div>
        <div className="header-center">
          <img src="/EFlogo.png" alt="Logo" className="logo" />
        </div>
        <div className="header-right">
          <a href="https://www.EnerzyFlow.com/" target="_blank" rel="noopener noreferrer">
            <button className="shop-now-button">Visit Us</button>
          </a>
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
                {/* Text paths */}
                {segments.map((_, index) => (
                  <path
                    key={`text-path-${index}`}
                    id={`text-path-${index}`}
                    d={getTextPath(index)}
                  />
                ))}

                {/* Segment gradients */}
                {segments.map((segment, index) => {
                  const darkColor = segment.color.match(/^#/) ? 
                    segment.color.replace(/^#/, '') : segment.color;
                  
                  const darkerShade = `#${darkColor.replace(/[0-9a-f]{2}/g, num => 
                    Math.max(0, parseInt(num, 16) - 80).toString(16).padStart(2, '0'))}`;
                  const darkestShade = `#${darkColor.replace(/[0-9a-f]{2}/g, num => 
                    Math.max(0, parseInt(num, 16) - 120).toString(16).padStart(2, '0'))}`;
                  
                  return (
                    <radialGradient
                      key={`gradient-${index}`}
                      id={`segment-gradient-${index}`}
                      cx="50%"
                      cy="50%"
                      r="70%"
                      fx="45%"
                      fy="45%"
                    >
                      <stop offset="0%" stopColor={segment.color} />
                      <stop offset="70%" stopColor={darkerShade} />
                      <stop offset="100%" stopColor={darkestShade} />
                    </radialGradient>
                  );
                })}

                {/* Effects filters */}
                <filter id="segment-shadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dx="2" dy="2" result="offsetblur" />
                  <feFlood floodColor="#000000" floodOpacity="0.3" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="hover-glow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                  <feOffset dx="0" dy="0" result="offsetblur" />
                  <feFlood floodColor="#FFFFFF" floodOpacity="0.3" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wheel segments */}
              {segments.map((segment, index) => (
                <g key={index} className="transition-transform duration-300">
                  <g 
                    className="transition-all duration-200 ease-in-out cursor-pointer"
                    onMouseEnter={(e) => {
                      const path = e.currentTarget.querySelector('path');
                      if (path) {
                        path.style.filter = 'url(#hover-glow)';
                        path.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const path = e.currentTarget.querySelector('path');
                      if (path) {
                        path.style.filter = 'url(#segment-shadow)';
                        path.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <path
                      d={getSegmentPath(index)}
                      fill={`url(#segment-gradient-${index})`}
                      stroke="white"
                      strokeWidth="1"
                      style={{
                        filter: 'url(#segment-shadow)',
                        transformOrigin: 'center',
                        transition: 'all 0.3s ease'
                      }}
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
                </g>
              ))}

              {/* Center circle */}
              <circle cx="150" cy="150" r="40" fill="#FFD700" />
              <circle cx="150" cy="150" r="35" fill="#FFF" />
              <circle cx="150" cy="150" r="30" fill="#FFD700" />
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

        {/* Modals */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>🎉 Congratulations!</h2>
              <p>You've won 5 coins!</p>
              <button className="continue-button" onClick={() => {
                setShowModal(false);
                setShowRegisterPopup(true);
              }}>
                Claim Prize
              </button>
            </div>
          </div>
        )}

        {/* Other modals and UI elements remain the same */}
      </div>
    </>
  );
};

export default SpinWheel;