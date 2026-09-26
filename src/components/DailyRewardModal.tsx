/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DailyRewardState } from '../types/candy';
import { X, Calendar, Gift, Sparkles, Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';

interface DailyRewardModalProps {
  rewardState: DailyRewardState;
  onClaim: (day: number, gold: number) => void;
  onClose: () => void;
}

const REWARD_SCHEDULE = [
  { day: 1, gold: 250, booster: null, icon: '🪙' },
  { day: 2, gold: 350, booster: null, icon: '🪙' },
  { day: 3, gold: 500, booster: '1x 🔨 Hammer', icon: '🔨' },
  { day: 4, gold: 650, booster: '1x ⇄ Swap', icon: '⇄' },
  { day: 5, gold: 800, booster: '1x 💣 Bomb', icon: '💣' },
  { day: 6, gold: 1000, booster: '1x ⚡ Shuffle', icon: '⚡' },
  { day: 7, gold: 2000, booster: '👑 King Pass Gift', icon: '👑' },
];

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  rewardState,
  onClaim,
  onClose,
}) => {
  const currentDayIndex = Math.min(Math.max(1, rewardState.streak), 7);
  const currentReward = REWARD_SCHEDULE[currentDayIndex - 1];

  const handleClaim = () => {
    if (rewardState.hasClaimedToday) return;

    sound.playSugarCrush();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaim(currentDayIndex, currentReward.gold);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-md w-full shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-white flex flex-col">
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <div>
              <h2 className="text-lg font-black text-amber-300">Daily Login Reward</h2>
              <p className="text-xs text-purple-300">Log in daily to stack consecutive gold bonuses!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all cursor-pointer shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Streak indicator */}
          <div className="bg-purple-900/60 border border-purple-700 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-[10px] text-purple-300 uppercase font-bold">Login Streak</span>
                <h4 className="text-sm font-black text-white">Day {currentDayIndex} of 7</h4>
              </div>
            </div>
            {rewardState.hasClaimedToday ? (
              <span className="text-[11px] bg-green-950 text-green-300 border border-green-500 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Claimed Today
              </span>
            ) : (
              <span className="text-[11px] bg-amber-400 text-purple-950 font-black px-2.5 py-1 rounded-full animate-pulse">
                Ready to Claim!
              </span>
            )}
          </div>

          {/* 7-Day Calendar Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {REWARD_SCHEDULE.map((item) => {
              const isPast = item.day < currentDayIndex;
              const isToday = item.day === currentDayIndex;
              const isFuture = item.day > currentDayIndex;

              return (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
                    isToday
                      ? rewardState.hasClaimedToday
                        ? 'bg-purple-800/80 border-green-400 text-white shadow'
                        : 'bg-gradient-to-b from-amber-400 to-orange-500 text-purple-950 border-white shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                      : isPast
                      ? 'bg-purple-950/60 border-purple-800/60 opacity-60 text-purple-300'
                      : 'bg-purple-950/80 border-purple-800 text-purple-200'
                  }`}
                >
                  <span className="text-[10px] font-bold">Day {item.day}</span>
                  <div className="text-lg my-1">{item.icon}</div>
                  <span className="text-[10px] font-black leading-tight">+{item.gold}</span>
                  {item.booster && (
                    <span className="text-[8px] font-semibold text-pink-300 mt-0.5 line-clamp-1">
                      {item.booster}
                    </span>
                  )}
                  {isPast && (
                    <Check className="w-3 h-3 text-green-400 stroke-[3] mt-1" />
                  )}
                  {isToday && rewardState.hasClaimedToday && (
                    <Check className="w-3.5 h-3.5 text-green-300 stroke-[3] mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Claim Action */}
          <div className="pt-2">
            {rewardState.hasClaimedToday ? (
              <div className="text-center p-3 bg-purple-950/70 rounded-2xl border border-purple-800 text-xs text-purple-300">
                You have already claimed today's login reward. Come back tomorrow for <span className="text-amber-300 font-bold">Day {currentDayIndex >= 7 ? 1 : currentDayIndex + 1} reward!</span>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>Claim +{currentReward.gold} Gold Bars</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
