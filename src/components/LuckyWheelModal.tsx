/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { LuckyWheelReward, LuckyWheelState } from '../types/candy';
import { X, Sparkles, Trophy, Gift, Check, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/sound';
import { haptics } from '../utils/haptics';

interface LuckyWheelModalProps {
  wheelState: LuckyWheelState;
  onClaimReward: (reward: LuckyWheelReward) => void;
  onClose: () => void;
}

export const WHEEL_REWARDS: LuckyWheelReward[] = [
  {
    id: 'rew_500g',
    name: '500 Bonus Gold',
    gold: 500,
    hammers: 0,
    switches: 0,
    bombs: 0,
    shuffles: 0,
    icon: '🪙',
    color: '#EC4899', // Pink-500
    textColor: '#FFFFFF',
  },
  {
    id: 'rew_2ham',
    name: '2x Lollipop Hammers',
    gold: 0,
    hammers: 2,
    switches: 0,
    bombs: 0,
    shuffles: 0,
    icon: '🔨',
    color: '#8B5CF6', // Purple-500
    textColor: '#FFFFFF',
  },
  {
    id: 'rew_1000g',
    name: '1,000 Sweet Gold',
    gold: 1000,
    hammers: 0,
    switches: 0,
    bombs: 0,
    shuffles: 0,
    icon: '💰',
    color: '#F59E0B', // Amber-500
    textColor: '#1E1B4B',
  },
  {
    id: 'rew_2swp',
    name: '2x Free Swaps',
    gold: 0,
    hammers: 0,
    switches: 2,
    bombs: 0,
    shuffles: 0,
    icon: '⇄',
    color: '#10B981', // Emerald-500
    textColor: '#FFFFFF',
  },
  {
    id: 'rew_1bmb',
    name: '1x Color Bomb',
    gold: 0,
    hammers: 0,
    switches: 0,
    bombs: 1,
    shuffles: 0,
    icon: '💣',
    color: '#3B82F6', // Blue-500
    textColor: '#FFFFFF',
  },
  {
    id: 'rew_bundle',
    name: '250 Gold + 1x Shuffle',
    gold: 250,
    hammers: 0,
    switches: 0,
    bombs: 0,
    shuffles: 1,
    icon: '🎁',
    color: '#EF4444', // Red-500
    textColor: '#FFFFFF',
  },
  {
    id: 'rew_2shf',
    name: '2x Sweet Shuffles',
    gold: 0,
    hammers: 0,
    switches: 0,
    bombs: 0,
    shuffles: 2,
    icon: '⚡',
    color: '#06B6D4', // Cyan-500
    textColor: '#1E1B4B',
  },
  {
    id: 'rew_jackpot',
    name: 'JACKPOT! 2,500 GOLD',
    gold: 2500,
    hammers: 1,
    switches: 1,
    bombs: 1,
    shuffles: 1,
    icon: '👑',
    color: '#EAB308', // Yellow-500
    textColor: '#1E1B4B',
  },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  wheelState,
  onClaimReward,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<LuckyWheelReward | null>(null);
  const [tickerActive, setTickerActive] = useState(false);
  
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRotationRef = useRef(0);

  // Clean up tick intervals on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || wheelState.hasSpunToday) return;

    sound.playPop();
    setIsSpinning(true);
    setWonReward(null);

    // Pick a random reward (weighted: Jackpot is slightly rarer, regular items common)
    const weights = [20, 18, 12, 18, 10, 12, 8, 2]; // Total 100
    const rand = Math.random() * 100;
    let accumulated = 0;
    let targetIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      accumulated += weights[i];
      if (rand < accumulated) {
        targetIndex = i;
        break;
      }
    }

    const selectedReward = WHEEL_REWARDS[targetIndex];

    // Compute target rotation angle:
    // Wheel has 8 slices (45 deg each).
    // Slice 0 center is at 22.5 deg.
    // The top needle is at 0 degrees (12 o'clock).
    // For slice targetIndex center to land under needle (0 deg):
    // targetAngle = 360 - (targetIndex * 45 + 22.5) + (small jitter +- 10 deg for natural feel)
    const jitter = (Math.random() - 0.5) * 16;
    const sliceAngle = 360 / WHEEL_REWARDS.length;
    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const finalAngleOffset = 360 - targetSliceCenter + jitter;

    // Minimum 6 full revolutions (6 * 360 = 2160 deg) for suspenseful spin
    const fullSpins = 6 + Math.floor(Math.random() * 2);
    const newTotalRotation = currentRotationRef.current + (fullSpins * 360) + finalAngleOffset;
    currentRotationRef.current = newTotalRotation;
    setRotation(newTotalRotation);

    // Sound ticking effect
    let tickSpeed = 70;
    const startTicks = () => {
      sound.playWheelTick();
      haptics.tick();
      setTickerActive(true);
      setTimeout(() => setTickerActive(false), 50);
    };

    let tickCount = 0;
    const tickTimer = setInterval(() => {
      startTicks();
      tickCount++;
      if (tickCount > 40) {
        clearInterval(tickTimer);
      }
    }, tickSpeed);
    tickIntervalRef.current = tickTimer;

    // Spin duration is 4.5 seconds
    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      setIsSpinning(false);
      setWonReward(selectedReward);
      sound.playSugarCrush();
      haptics.win();

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.55 },
      });

      onClaimReward(selectedReward);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.6)] overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-purple-950/95 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-bounce">🎡</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-amber-300">Daily Lucky Wheel</h2>
                <span className="bg-pink-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full">
                  1 FREE SPIN
                </span>
              </div>
              <p className="text-xs text-purple-300">Spin once daily for bonus Gold & Boosters!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSpinning}
            className={`w-9 h-9 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all shadow ${
              isSpinning ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Ribbon */}
        <div className="bg-purple-900/70 border-b border-purple-800 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-purple-200">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Daily Login Mini-Game</span>
          </div>
          {wheelState.hasSpunToday ? (
            <span className="text-green-300 font-bold flex items-center gap-1 bg-green-950/80 px-2.5 py-0.5 rounded-full border border-green-600">
              <Check className="w-3 h-3" /> Spun Today
            </span>
          ) : (
            <span className="text-amber-300 font-black flex items-center gap-1 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400 animate-pulse">
              <Sparkles className="w-3 h-3" /> FREE SPIN READY!
            </span>
          )}
        </div>

        {/* Wheel Play Area */}
        <div className="p-4 sm:p-5 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Wheel Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-1">
            
            {/* Top Indicator Needle */}
            <div 
              className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 transition-transform ${
                tickerActive ? '-rotate-12 scale-110' : 'rotate-0'
              }`}
            >
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"></div>
              <div className="w-3 h-3 bg-red-600 rounded-full mx-auto -mt-7 shadow"></div>
            </div>

            {/* Glowing Outer Ring */}
            <div className="absolute inset-0 rounded-full border-8 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-10 pointer-events-none"></div>

            {/* Spinning SVG Wheel */}
            <div
              className="w-full h-full rounded-full overflow-hidden shadow-2xl relative"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1.0)' : 'none',
              }}
            >
              <svg viewBox="0 0 300 300" className="w-full h-full">
                <defs>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Draw 8 Segments */}
                {WHEEL_REWARDS.map((reward, i) => {
                  const angle = 360 / WHEEL_REWARDS.length; // 45 deg
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;

                  // Polar to cartesian coordinates
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  const x1 = 150 + 150 * Math.cos(startRad);
                  const y1 = 150 + 150 * Math.sin(startRad);
                  const x2 = 150 + 150 * Math.cos(endRad);
                  const y2 = 150 + 150 * Math.sin(endRad);

                  const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`;
                  const midRad = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
                  const textX = 150 + 95 * Math.cos(midRad);
                  const textY = 150 + 95 * Math.sin(midRad);
                  const textRotation = (startAngle + endAngle) / 2;

                  return (
                    <g key={reward.id}>
                      <path
                        d={pathData}
                        fill={reward.color}
                        stroke="#FFF"
                        strokeWidth="2"
                        className="transition-opacity hover:opacity-95"
                      />
                      {/* Peg pin at edge */}
                      <circle
                        cx={x1}
                        cy={y1}
                        r="3.5"
                        fill="#FEF08A"
                        stroke="#B45309"
                        strokeWidth="1.5"
                      />
                      {/* Icon & Label */}
                      <g transform={`rotate(${textRotation}, ${textX}, ${textY})`}>
                        <text
                          x={textX}
                          y={textY - 8}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="20"
                          filter="url(#shadow)"
                        >
                          {reward.icon}
                        </text>
                        <text
                          x={textX}
                          y={textY + 12}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={reward.textColor}
                          fontSize="9"
                          fontWeight="900"
                          fontFamily="sans-serif"
                          filter="url(#shadow)"
                        >
                          {reward.gold > 0 ? `${reward.gold}` : reward.name.split(' ')[0]}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Cap Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center z-20 pointer-events-none">
              <span className="text-xl">🍭</span>
            </div>
          </div>

          {/* Won Reward Banner */}
          {wonReward && (
            <div className="mt-3 p-3 w-full bg-gradient-to-r from-amber-500/30 via-pink-500/30 to-amber-500/30 border-2 border-amber-400 rounded-2xl text-center space-y-1 animate-bounce">
              <span className="text-xs text-amber-300 font-black uppercase tracking-wider block">
                🎉 Congratulations! You Won:
              </span>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-1.5">
                <span className="text-2xl">{wonReward.icon}</span>
                <span>{wonReward.name}</span>
              </h3>
              <p className="text-[11px] text-green-300 font-bold">
                Items have been added to your inventory!
              </p>
            </div>
          )}

          {/* Spin Trigger Button */}
          <div className="w-full mt-3">
            {wheelState.hasSpunToday && !wonReward ? (
              <div className="bg-purple-950/80 border border-purple-700/80 p-3 rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-purple-300 font-bold">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Next Free Spin Available Tomorrow!</span>
                </div>
                <p className="text-[11px] text-purple-400">
                  Log in tomorrow to spin the Lucky Wheel again.
                </p>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning || wheelState.hasSpunToday}
                className={`w-full py-3.5 rounded-2xl font-black text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSpinning
                    ? 'bg-purple-800 text-purple-400 cursor-not-allowed'
                    : wheelState.hasSpunToday
                    ? 'bg-purple-900/60 text-purple-300 cursor-default'
                    : 'bg-gradient-to-r from-amber-400 via-pink-500 to-amber-400 hover:from-amber-300 hover:to-pink-400 text-purple-950 shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-95 animate-pulse'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSpinning ? 'Spinning Wheel...' : wheelState.hasSpunToday ? 'Claimed Today' : 'SPIN THE WHEEL NOW!'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800 text-center text-[11px] text-purple-300">
          Daily Mini-Game • Resets automatically every midnight on your first login
        </div>

      </div>
    </div>
  );
};
