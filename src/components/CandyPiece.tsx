/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Candy } from '../types/candy';

interface CandyPieceProps {
  candy: Candy;
  isSelected?: boolean;
  isHinted?: boolean;
  isMatched?: boolean;
  size?: number;
}

export const CandyPiece: React.FC<CandyPieceProps> = ({
  candy,
  isSelected = false,
  isHinted = false,
  isMatched = false,
  size = 52,
}) => {
  const { color, special, isIngredient } = candy;

  // Ingredients rendering
  if (isIngredient === 'cherry') {
    return (
      <div
        className={`relative flex items-center justify-center transition-transform ${
          isSelected ? 'scale-110' : ''
        } ${isHinted ? 'animate-pulse-glow' : ''} ${isMatched ? 'scale-0 opacity-0' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
          {/* Stem & Leaf */}
          <path
            d="M32 10 C32 18 24 24 22 34"
            fill="none"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 10 C34 18 42 24 44 34"
            fill="none"
            stroke="#15803d"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 10 C38 6 46 8 48 14 C44 18 36 16 32 10 Z"
            fill="#22c55e"
          />
          {/* Cherries */}
          <circle cx="22" cy="38" r="14" fill="url(#cherryGrad1)" />
          <circle cx="22" cy="38" r="14" fill="url(#glossGrad)" opacity="0.8" />
          <circle cx="17" cy="33" r="4" fill="#ffffff" opacity="0.75" />

          <circle cx="44" cy="38" r="14" fill="url(#cherryGrad2)" />
          <circle cx="44" cy="38" r="14" fill="url(#glossGrad)" opacity="0.8" />
          <circle cx="39" cy="33" r="4" fill="#ffffff" opacity="0.75" />

          <defs>
            <radialGradient id="cherryGrad1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
            <radialGradient id="cherryGrad2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </radialGradient>
            <radialGradient id="glossGrad" cx="30%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Color Bomb Special Candy
  if (special === 'color_bomb') {
    return (
      <div
        className={`relative flex items-center justify-center transition-transform ${
          isSelected ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]' : ''
        } ${isHinted ? 'animate-pulse-glow' : ''} ${isMatched ? 'scale-0 opacity-0' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg animate-rainbow">
          {/* Dark chocolate sphere */}
          <circle cx="32" cy="32" r="25" fill="url(#chocoBallGrad)" />
          <circle cx="32" cy="32" r="25" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,2" />

          {/* Multicolored sprinkles */}
          <circle cx="24" cy="22" r="3.2" fill="#ef4444" />
          <circle cx="40" cy="22" r="3" fill="#3b82f6" />
          <circle cx="32" cy="32" r="3.5" fill="#eab308" />
          <circle cx="21" cy="36" r="3" fill="#22c55e" />
          <circle cx="43" cy="36" r="3.2" fill="#a855f7" />
          <circle cx="28" cy="46" r="2.8" fill="#ec4899" />
          <circle cx="38" cy="45" r="2.8" fill="#06b6d4" />
          <circle cx="32" cy="18" r="2.5" fill="#f97316" />
          <circle cx="16" cy="28" r="2.5" fill="#facc15" />
          <circle cx="48" cy="27" r="2.5" fill="#10b981" />

          {/* Glossy sheen */}
          <ellipse cx="26" cy="20" rx="8" ry="4" fill="#ffffff" opacity="0.4" transform="rotate(-25 26 20)" />

          <defs>
            <radialGradient id="chocoBallGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="60%" stopColor="#291102" />
              <stop offset="100%" stopColor="#120601" />
            </radialGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-ping opacity-25 pointer-events-none" />
      </div>
    );
  }

  // Base Candy Rendering
  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-200 select-none ${
        isSelected ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] ring-4 ring-yellow-300 rounded-full' : ''
      } ${isHinted ? 'animate-pulse-glow' : ''} ${isMatched ? 'scale-0 opacity-0' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
        <defs>
          {/* Red Candy Gradient */}
          <radialGradient id="redGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="45%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </radialGradient>

          {/* Orange Candy Gradient */}
          <radialGradient id="orangeGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffb703" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>

          {/* Yellow Candy Gradient */}
          <radialGradient id="yellowGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>

          {/* Green Candy Gradient */}
          <radialGradient id="greenGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="45%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>

          {/* Blue Candy Gradient */}
          <radialGradient id="blueGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          {/* Purple Candy Gradient */}
          <radialGradient id="purpleGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="45%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#581c87" />
          </radialGradient>

          {/* Clip path for candy body */}
          <clipPath id={`clip-${candy.id}`}>
            {color === 'red' && <rect x="12" y="12" width="40" height="40" rx="14" />}
            {color === 'orange' && <ellipse cx="32" cy="32" rx="24" ry="18" />}
            {color === 'yellow' && (
              <polygon points="32,8 40,24 56,26 44,38 48,54 32,46 16,54 20,38 8,26 24,24" />
            )}
            {color === 'green' && <rect x="10" y="10" width="44" height="44" rx="10" />}
            {color === 'blue' && <circle cx="32" cy="32" r="23" />}
            {color === 'purple' && <polygon points="32,8 54,32 32,56 10,32" />}
          </clipPath>
        </defs>

        {/* 1. Base Candy Body */}
        {color === 'red' && (
          // Rounded Ruby Heart / Pillow
          <g>
            <rect x="10" y="10" width="44" height="44" rx="16" fill="url(#redGrad)" stroke="#fda4af" strokeWidth="1.5" />
            <path
              d="M18 16 Q32 12 46 16 Q48 30 46 44"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        )}

        {color === 'orange' && (
          // Oval Lozenge
          <g>
            <ellipse cx="32" cy="32" rx="25" ry="19" fill="url(#orangeGrad)" stroke="#fdba74" strokeWidth="1.5" />
            <ellipse cx="32" cy="24" rx="16" ry="6" fill="#ffffff" opacity="0.45" />
          </g>
        )}

        {color === 'yellow' && (
          // Lemon Drop / Sparkling Star
          <g>
            <polygon
              points="32,8 40,24 56,26 44,38 48,54 32,46 16,54 20,38 8,26 24,24"
              fill="url(#yellowGrad)"
              stroke="#fef08a"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="24" r="5" fill="#ffffff" opacity="0.6" />
          </g>
        )}

        {color === 'green' && (
          // Mint Chiclet Square
          <g>
            <rect x="10" y="10" width="44" height="44" rx="11" fill="url(#greenGrad)" stroke="#bbf7d0" strokeWidth="1.5" />
            <rect x="15" y="15" width="34" height="34" rx="7" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="22" cy="20" rx="6" ry="3" fill="#ffffff" opacity="0.75" />
          </g>
        )}

        {color === 'blue' && (
          // Blue Orb Sphere
          <g>
            <circle cx="32" cy="32" r="23" fill="url(#blueGrad)" stroke="#bae6fd" strokeWidth="1.5" />
            <ellipse cx="26" cy="20" rx="9" ry="5" fill="#ffffff" opacity="0.6" transform="rotate(-20 26 20)" />
          </g>
        )}

        {color === 'purple' && (
          // Purple Diamond / Cluster
          <g>
            <polygon
              points="32,8 54,32 32,56 10,32"
              fill="url(#purpleGrad)"
              stroke="#f3e8ff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon points="32,14 48,32 32,50 16,32" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
            <ellipse cx="24" cy="22" rx="5" ry="3" fill="#ffffff" opacity="0.7" transform="rotate(-30 24 22)" />
          </g>
        )}

        {/* 2. Special Overlays: Striped, Wrapped */}
        {special === 'striped_h' && (
          <g clipPath={`url(#clip-${candy.id})`}>
            {/* Horizontal Sugar Stripes */}
            <line x1="0" y1="18" x2="64" y2="18" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="0" y1="32" x2="64" y2="32" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="0" y1="46" x2="64" y2="46" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="0" y1="18" x2="64" y2="18" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
            <line x1="0" y1="32" x2="64" y2="32" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
            <line x1="0" y1="46" x2="64" y2="46" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
          </g>
        )}

        {special === 'striped_v' && (
          <g clipPath={`url(#clip-${candy.id})`}>
            {/* Vertical Sugar Stripes */}
            <line x1="18" y1="0" x2="18" y2="64" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="32" y1="0" x2="32" y2="64" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="46" y1="0" x2="46" y2="64" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
            <line x1="18" y1="0" x2="18" y2="64" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
            <line x1="32" y1="0" x2="32" y2="64" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
            <line x1="46" y1="0" x2="46" y2="64" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
          </g>
        )}

        {special === 'wrapped' && (
          // Candy Wrapper with translucent cellophane and twisted bow ends
          <g>
            {/* Wrapper wrapper outline */}
            <rect
              x="6"
              y="6"
              width="52"
              height="52"
              rx="18"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeDasharray="4 3"
              opacity="0.85"
            />
            {/* Four corner ribbon twirls */}
            <circle cx="9" cy="9" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="55" cy="9" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="9" cy="55" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="55" cy="55" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
            {/* Central explosion pulse icon */}
            <circle cx="32" cy="32" r="10" fill="#ffffff" opacity="0.35" />
            <polygon
              points="32,23 35,29 41,32 35,35 32,41 29,35 23,32 29,29"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
