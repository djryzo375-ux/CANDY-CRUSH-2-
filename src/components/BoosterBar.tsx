/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BoosterState, BoosterType } from '../types/candy';
import { Lightbulb, Lock, Shuffle, Sparkles } from 'lucide-react';
import { sound } from '../audio/sound';

interface BoosterBarProps {
  boosters: BoosterState;
  activeBooster: BoosterType | null;
  unlockedLevel: number;
  hasVipPass?: boolean;
  onSelectBooster: (booster: BoosterType) => void;
  onRequestHint: () => void;
  isProcessing: boolean;
  onOpenShop?: () => void;
}

export const BoosterBar: React.FC<BoosterBarProps> = ({
  boosters,
  activeBooster,
  unlockedLevel,
  hasVipPass = false,
  onSelectBooster,
  onRequestHint,
  isProcessing,
  onOpenShop,
}) => {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // User's exact unlock requirements:
  // Lollipop Hammer: Level 10
  // Free Swap: Level 30
  // Color Bomb: Level 40
  // Sweet Shuffle: Level 50
  const isHammerUnlocked = hasVipPass || unlockedLevel >= 10;
  const isSwitchUnlocked = hasVipPass || unlockedLevel >= 30;
  const isBombUnlocked = hasVipPass || unlockedLevel >= 40;
  const isShuffleUnlocked = hasVipPass || unlockedLevel >= 50;

  const showLockedAlert = (name: string, reqLevel: number) => {
    sound.playInvalid();
    setLockedNotice(`🔒 ${name} Level ${reqLevel} pe unlock hoga! (Reach Level ${reqLevel} or get VIP Pass)`);
    setTimeout(() => {
      setLockedNotice(null);
    }, 3500);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 py-1 flex flex-col items-center select-none relative">
      {/* Toast Notice for locked items */}
      {lockedNotice && (
        <div 
          onClick={onOpenShop}
          className="absolute -top-12 z-50 bg-amber-400 text-purple-950 font-black text-xs px-4 py-2 rounded-full border-2 border-white shadow-2xl flex items-center gap-2 animate-bounce cursor-pointer hover:bg-amber-300"
        >
          <span>{lockedNotice}</span>
          <span className="text-[10px] bg-purple-900 text-amber-300 px-2 py-0.5 rounded-full uppercase">Shop VIP</span>
        </div>
      )}

      <div className="w-full flex items-center justify-around gap-2">
        {/* 1. Lollipop Hammer (Unlock Level 10) */}
        <button
          disabled={isProcessing}
          onClick={() => {
            if (!isHammerUnlocked) {
              showLockedAlert('Lollipop Hammer', 10);
              return;
            }
            onSelectBooster('hammer');
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
            !isHammerUnlocked
              ? 'bg-purple-950/60 text-purple-400 border-purple-800/60 opacity-75 hover:opacity-100 hover:border-amber-400'
              : activeBooster === 'hammer'
              ? 'bg-amber-400 text-purple-950 border-white scale-110 shadow-[0_0_15px_rgba(251,191,36,0.9)]'
              : 'bg-purple-900/80 hover:bg-purple-800 text-white border-purple-600/80 hover:border-pink-400 active:scale-95 shadow-md'
          }`}
          title={isHammerUnlocked ? "Lollipop Hammer: Smash any candy or obstacle" : "Unlocks at Level 10"}
        >
          <div className="text-xl sm:text-2xl">🔨</div>
          <span className="text-[10px] sm:text-xs font-black mt-0.5">Hammer</span>
          
          {isHammerUnlocked ? (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.hammer}
            </span>
          ) : (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white shadow">
              <Lock className="w-2.5 h-2.5" /> Lvl 10
            </span>
          )}
        </button>

        {/* 2. Free Switch (Unlock Level 30) */}
        <button
          disabled={isProcessing}
          onClick={() => {
            if (!isSwitchUnlocked) {
              showLockedAlert('Free Swap', 30);
              return;
            }
            onSelectBooster('switch');
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
            !isSwitchUnlocked
              ? 'bg-purple-950/60 text-purple-400 border-purple-800/60 opacity-75 hover:opacity-100 hover:border-amber-400'
              : activeBooster === 'switch'
              ? 'bg-amber-400 text-purple-950 border-white scale-110 shadow-[0_0_15px_rgba(251,191,36,0.9)]'
              : 'bg-purple-900/80 hover:bg-purple-800 text-white border-purple-600/80 hover:border-pink-400 active:scale-95 shadow-md'
          }`}
          title={isSwitchUnlocked ? "Free Switch: Swap any two candies anywhere without using a move" : "Unlocks at Level 30"}
        >
          <div className="text-xl sm:text-2xl">⇄</div>
          <span className="text-[10px] sm:text-xs font-black mt-0.5">Free Swap</span>
          
          {isSwitchUnlocked ? (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.switch}
            </span>
          ) : (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white shadow">
              <Lock className="w-2.5 h-2.5" /> Lvl 30
            </span>
          )}
        </button>

        {/* 3. Color Bomb Booster (Unlock Level 40) */}
        <button
          disabled={isProcessing}
          onClick={() => {
            if (!isBombUnlocked) {
              showLockedAlert('Color Bomb Booster', 40);
              return;
            }
            onSelectBooster('bomb');
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
            !isBombUnlocked
              ? 'bg-purple-950/60 text-purple-400 border-purple-800/60 opacity-75 hover:opacity-100 hover:border-amber-400'
              : activeBooster === 'bomb'
              ? 'bg-amber-400 text-purple-950 border-white scale-110 shadow-[0_0_15px_rgba(251,191,36,0.9)]'
              : 'bg-purple-900/80 hover:bg-purple-800 text-white border-purple-600/80 hover:border-pink-400 active:scale-95 shadow-md'
          }`}
          title={isBombUnlocked ? "Color Bomb Booster: Spawn a color bomb instantly" : "Unlocks at Level 40"}
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
          <span className="text-[10px] sm:text-xs font-black mt-0.5">Color Bomb</span>
          
          {isBombUnlocked ? (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.bomb}
            </span>
          ) : (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white shadow">
              <Lock className="w-2.5 h-2.5" /> Lvl 40
            </span>
          )}
        </button>

        {/* 4. Sweet Shuffle (Unlock Level 50) */}
        <button
          disabled={isProcessing}
          onClick={() => {
            if (!isShuffleUnlocked) {
              showLockedAlert('Sweet Shuffle', 50);
              return;
            }
            onSelectBooster('shuffle');
          }}
          className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
            !isShuffleUnlocked
              ? 'bg-purple-950/60 text-purple-400 border-purple-800/60 opacity-75 hover:opacity-100 hover:border-amber-400'
              : 'bg-purple-900/80 hover:bg-purple-800 text-white border-purple-600/80 hover:border-pink-400 active:scale-95 shadow-md'
          }`}
          title={isShuffleUnlocked ? "Sweet Shuffle: Reshuffle candies on the board" : "Unlocks at Level 50"}
        >
          <Shuffle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
          <span className="text-[10px] sm:text-xs font-black mt-0.5">Shuffle</span>
          
          {isShuffleUnlocked ? (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.shuffle}
            </span>
          ) : (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white shadow">
              <Lock className="w-2.5 h-2.5" /> Lvl 50
            </span>
          )}
        </button>

        {/* 5. Free Smart Hint */}
        <button
          disabled={isProcessing}
          onClick={onRequestHint}
          className="flex flex-col items-center justify-center p-2 rounded-2xl border-2 bg-gradient-to-b from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 active:scale-95 text-purple-950 font-black border-amber-300 shadow-md transition-all cursor-pointer"
          title="Find Valid Match"
        >
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-950" />
          <span className="text-[10px] sm:text-xs font-black mt-0.5">Hint</span>
        </button>
      </div>
    </div>
  );
};
