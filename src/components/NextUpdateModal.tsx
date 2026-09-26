/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Rocket, Sparkles, Bell, Clock, Crown, Users, Gift, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';

interface NextUpdateModalProps {
  onClose: () => void;
}

const UPCOMING_TEASERS = [
  {
    icon: '🌌',
    title: 'World 6: Marshmallow Galaxy (Levels 51–100)',
    description: 'New cosmic candy worlds featuring zero-gravity tiles, fizzy soda black holes & star jellies!',
    tag: 'Levels 51+',
  },
  {
    icon: '⚔️',
    title: 'Live 1v1 Candy Duels (PvP Arena)',
    description: 'Battle real players head-to-head in real time! Highest score in 60 seconds wins gold trophies.',
    tag: 'Multiplayer',
  },
  {
    icon: '🐾',
    title: 'Pet Candy Companions',
    description: 'Adopt and level up sweet gummy bears and marshmallow pups that drop free color bombs during moves!',
    tag: 'Pet System',
  },
  {
    icon: '🎨',
    title: 'Custom Candy Skins & Boards',
    description: 'Unlock 24K Solid Gold candies, Cyberpunk Neon glows, and Retro 8-bit candy pieces.',
    tag: 'Customization',
  },
  {
    icon: '🏆',
    title: 'Guild Tournaments & Global Seasons',
    description: 'Form a Candy Clan with friends and compete for weekly million-dollar gold vaults.',
    tag: 'Social',
  },
];

export const NextUpdateModal: React.FC<NextUpdateModalProps> = ({ onClose }) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleNotifyMe = () => {
    sound.playSugarCrush();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.6)] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🚀</span>
            <div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-pink-600/80 text-white font-black text-[10px] uppercase mb-0.5">
                V2.5 Teaser
              </div>
              <h2 className="text-base sm:text-lg font-black text-amber-300">
                Next Update Coming Soon... Wait For!
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all cursor-pointer shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-gradient-to-r from-pink-900/60 to-purple-900/60 p-3.5 rounded-2xl border border-pink-400/40 text-center space-y-1">
            <h3 className="text-base font-black text-amber-300">
              Big things are cooking in the Candy Kitchen! 🍬✨
            </h3>
            <p className="text-xs text-purple-200">
              The grand expansion is under development. Get ready for new worlds, live battles, and companion pets:
            </p>
          </div>

          {/* Teaser Items */}
          <div className="space-y-2.5">
            {UPCOMING_TEASERS.map((teaser, idx) => (
              <div
                key={idx}
                className="p-3 bg-purple-950/70 border border-purple-700/80 rounded-2xl flex items-start gap-3 hover:border-pink-400 transition-colors"
              >
                <div className="text-2xl bg-purple-900 p-2 rounded-xl shrink-0 border border-purple-700">
                  {teaser.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <h4 className="font-black text-sm text-white">{teaser.title}</h4>
                    <span className="text-[9px] bg-pink-600/80 text-white font-black px-2 py-0.5 rounded-full">
                      {teaser.tag}
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 mt-1 leading-relaxed">
                    {teaser.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notification Button */}
          <div className="pt-2">
            <button
              onClick={handleNotifyMe}
              className={`w-full py-3 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                subscribed
                  ? 'bg-green-600 text-white border border-green-300'
                  : 'bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{subscribed ? 'Notification Set! You are on VIP Early Access List' : 'Notify Me When Update Launches!'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800 text-center text-xs text-purple-300">
          Candy Crush 2 • Regular updates delivered directly in-game.
        </div>

      </div>
    </div>
  );
};
