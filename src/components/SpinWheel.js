import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import ClaimPrizeForm from "./ClaimPrizeForm";
import "./SpinWheel.css";

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [vouchers, setVouchers] = useState(0);
  const [winningRestaurant, setWinningRestaurant] = useState("");

  const segments = [
    { text: "Bitter n Sweets", color: "#FF69B4", value: 10 },
    { text: "Paradise", color: "#FF0000", value: 10 },
    { text: "Cherry", color: "#FF69B4", value: 10 },
    { text: "Smartpind", color: "#808080", value: 10 },
    { text: "Curry Room", color: "#4169E1", value: 10 },
    { text: "Food Studio", color: "#90EE90", value: 10 },
    { text: "Hotel Park", color: "#FFD700", value: 10 },
    { text: "Honey World", color: "#FF0000", value: 10 },
    { text: "Wonder Inn", color: "#4169E1", value: 10 },
    { text: "Paradise", color: "#90EE90", value: 10 },
    { text: "Paradise", color: "#FFD700", value: 10 },
    { text: "Paradise", color: "#FF0000", value: 10 }
  ];

  const paradiseIndices = segments
    .map((segment, index) => (segment.text === "Paradise" ? index : -1))
    .filter((index) => index !== -1);

  const restaurantImages = [
    "bitter n sweets.jpg",
    "paradise.jpg",
    "cherry.jpg",
    "smartpind.jpg",
    "curry room.jpg",
    "food studio.jpg",
    "hotel park.jpg",
    "honey world.jpg",
    "wonder inn.jpg"
  ];

  const getSegmentPath = (index, outerRadius = 150, innerRadius = 50) => {
    const angle = 360 / segments.length;
    const startAngle = index * angle;
    const endAngle = startAngle + angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const outerStart = {
      x: 150 + outerRadius * Math.cos(startRad),
      y: 150 + outerRadius * Math.sin(startRad),
    };
    const outerEnd = {
      x: 150 + outerRadius * Math.cos(endRad),
      y: 150 + outerRadius * Math.sin(endRad),
    };
    const innerStart = {
      x: 150 + innerRadius * Math.cos(startRad),
      y: 150 + innerRadius * Math.sin(startRad),
    };
    const innerEnd = {
      x: 150 + innerRadius * Math.cos(endRad),
      y: 150 + innerRadius * Math.sin(endRad),
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
    const endRadius = 140;
    const x1 = 150 + startRadius * Math.cos(midAngle);
    const y1 = 150 + startRadius * Math.sin(midAngle);
    const x2 = 150 + endRadius * Math.cos(midAngle);
    const y2 = 150 + endRadius * Math.sin(midAngle);
    return `M ${x1},${y1} L ${x2},${y2}`;
  };

  const spinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const winningIndex =
      paradiseIndices[Math.floor(Math.random() * paradiseIndices.length)];
    const baseSpins = (Math.floor(Math.random() * 5) + 5) * 360;
    const targetRotation =
      baseSpins + (360 - winningIndex * (360 / segments.length));

    setRotation(targetRotation);
    setWinningRestaurant(segments[winningIndex].text);

    setTimeout(() => {
      setIsSpinning(false);
      setShowCongratulations(true);
    }, 4000);
  };

  return (
    <>
      <header className="header">
        {/* <div className="header-left">
          <svg
            className="wallet-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21 7H3V5h18v2zm0 10H3V9h18v8zm-4-4H5v2h12v-2z" />
          </svg>
          {vouchers} Vouchers
        </div> */}
        <div className="header-left">
          <img src="/EFlogo.png" alt="Logo" className="logo" />
        </div>
        <div className="header-right">
          <a
            href="https://www.EnerzyFlow.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
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
                {segments.map((_, index) => (
                  <path
                    key={`text-path-${index}`}
                    id={`text-path-${index}`}
                    d={getTextPath(index)}
                  />
                ))}

                {segments.map((segment, index) => {
                  const darkColor = segment.color.match(/^#/)
                    ? segment.color.replace(/^#/, "")
                    : segment.color;

                  const darkerShade = `#${darkColor.replace(
                    /[0-9a-f]{2}/g,
                    (num) =>
                      Math.max(0, parseInt(num, 16) - 80)
                        .toString(16)
                        .padStart(2, "0")
                  )}`;
                  const darkestShade = `#${darkColor.replace(
                    /[0-9a-f]{2}/g,
                    (num) =>
                      Math.max(0, parseInt(num, 16) - 120)
                        .toString(16)
                        .padStart(2, "0")
                  )}`;

                  return (
                    <radialGradient
                      key={`gradient-${index}`}
                      id={`segment-gradient-${index}`}
                      cx="50%"
                      cy="50%"
                      r="70%"
                      fx="15%"
                      fy="55%"
                    >
                      <stop offset="0%" stopColor={segment.color} />
                      <stop offset="70%" stopColor={darkerShade} />
                      <stop offset="100%" stopColor={darkestShade} />
                    </radialGradient>
                  );
                })}

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

              {segments.map((segment, index) => (
                <g key={index} className="transition-transform duration-300">
                  <g
                    className="transition-all duration-200 ease-in-out cursor-pointer"
                    onMouseEnter={(e) => {
                      const path = e.currentTarget.querySelector("path");
                      if (path) {
                        path.style.filter = "url(#hover-glow)";
                        path.style.transform = "scale(1.02)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      const path = e.currentTarget.querySelector("path");
                      if (path) {
                        path.style.filter = "url(#segment-shadow)";
                        path.style.transform = "scale(1)";
                      }
                    }}
                  >
                    <path
                      d={getSegmentPath(index)}
                      fill={`url(#segment-gradient-${index})`}
                      stroke="white"
                      strokeWidth="1"
                      style={{
                        filter: "url(#segment-shadow)",
                        transformOrigin: "center",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <text
                      dy="-5"
                      fill="white"
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))",
                      }}
                    >
                      <textPath
                        href={`#text-path-${index}`}
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        {segment.text}
                      </textPath>
                    </text>
                  </g>
                </g>
              ))}

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

        {showCongratulations && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>🎉 Congratulations!</h2>
              <p>You've won 10% off voucher for {winningRestaurant}!</p>
              <button
                className="continue-button"
                onClick={() => {
                  setShowCongratulations(false);
                  setShowClaimForm(true);
                }}
              >
                Claim Voucher
              </button>
            </div>
          </div>
        )}

        {showClaimForm && (
          <ClaimPrizeForm
            onClose={() => setShowClaimForm(false)}
            voucherAmount={10}
            restaurant={winningRestaurant}
          />
        )}
      </div>

      {/* <div className="restaurant-marquee">
        <div className="marquee-content">
          {restaurantImages.map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={image.split('.')[0]}
              className="marquee-image"
              style={{
                width: '150px',
                height: '100px',
                objectFit: 'contain',
                margin: '0 20px'
              }}
            />
          ))}
        </div>
      </div> */}

      <style>{`
        .restaurant-marquee {
          width: 100%;
          overflow: hidden;
          background: transparent;
          padding: 20px 0;
          margin-top: 20px;
        }

        .marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-image {
          transition: transform 0.3s ease;
        }

        .marquee-image:hover {
          transform: scale(1.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          max-width: 500px;
          width: 90%;
        }

        .continue-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        }

        .continue-button:hover {
          background-color: #45a049;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #f8f9fa;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wallet-icon {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        .header-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo {
          height: 40px;
          width: auto;
        }

        .shop-now-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .shop-now-button:hover {
          background-color: #0056b3;
        }

        .main-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wheel-container {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 2rem auto;
        }

        .wheel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .pointer {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background-color: #ff4444;
          clip-path: polygon(50% 100%, 0 0, 100% 0);
          z-index: 100;
        }

        .wheel {
          width: 100%;
          height: 100%;
          transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
        }

        .spinning {
          transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
        }

        .spin-button {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 30px;
          font-size: 18px;
          font-weight: bold;
          color: white;
          background-color: #ff4444;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .spin-button:hover {
          background-color: #ff6666;
          transform: translateX(-50%) scale(1.05);
        }

        .spin-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          transform: translateX(-50%) scale(1);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(var(--rotation));
          }
        }
      `}</style>
    </>
  );
};

export default SpinWheel;