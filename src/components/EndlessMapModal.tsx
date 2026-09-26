/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LevelConfig } from '../types/candy';
import { SAGA_LEVELS, ENDLESS_LEVEL } from '../data/levels';
import { X, Play, Infinity, Star, Lock, Gift, Sparkles, Compass, Trophy } from 'lucide-react';
import { sound } from '../audio/sound';

interface EndlessMapModalProps {
  unlockedLevel: number;
  levelScores: Record<number, { score: number; stars: number }>;
  onSelectLevel: (lvl: LevelConfig) => void;
  onClose: () => void;
}

// Procedural generator for endless levels beyond 50
function getProceduralLevel(levelId: number): LevelConfig {
  const existing = SAGA_LEVELS.find((l) => l.id === levelId);
  if (existing) return existing;

  const targetScore = 100000 + (levelId - 50) * 8000;
  const moves = Math.max(18, 30 - Math.floor((levelId - 50) / 10));

  return {
    id: levelId,
    name: `Cosmic Confection ${levelId}`,
    chapter: `Endless Realm ${Math.floor(levelId / 10) + 1}`,
    description: `Procedural Endless Challenge! Clear obstacles and reach ${targetScore.toLocaleString()} points.`,
    rows: 8,
    cols: 8,
    maxMoves: moves,
    colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
    targetScore,
    starScores: [targetScore, Math.round(targetScore * 1.5), Math.round(targetScore * 2.2)],
    targetJelly: 16 + (levelId % 8),
    initialJellyTiles: [
      [2, 2], [2, 5], [5, 2], [5, 5], [3, 3], [3, 4], [4, 3], [4, 4]
    ],
    difficulty: levelId % 5 === 0 ? 'Hard' : 'Normal',
  };
}

export const EndlessMapModal: React.FC<EndlessMapModalProps> = ({
  unlockedLevel,
  levelScores,
  onSelectLevel,
  onClose,
}) => {
  // Let player view up to max(unlockedLevel + 20, 75) levels infinitely!
  const [maxDisplay, setMaxDisplay] = useState(Math.max(unlockedLevel + 25, 75));

  const levelsList = Array.from({ length: maxDisplay }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.6)] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center font-black text-2xl shadow">
              <Infinity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-black text-amber-300">Infinite Endless Map</h2>
                <span className="bg-cyan-500/80 text-purple-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ∞ UNLIMITED
                </span>
              </div>
              <p className="text-xs text-purple-300">Continuous procedural levels that never end!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all cursor-pointer shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Endless Mode Quick Play Banner */}
        <div className="p-3 bg-purple-900/60 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-xs font-black text-white">Pure Endless Rush (No Move Limit)</h4>
              <p className="text-[10px] text-purple-300">Relaxing mode with infinite candy refills</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playStart();
              onSelectLevel(ENDLESS_LEVEL);
              onClose();
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 fill-purple-950" />
            <span>Play Rush</span>
          </button>
        </div>

        {/* Infinite Grid of Levels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {levelsList.map((lvlNum) => {
              const isUnlocked = lvlNum <= unlockedLevel;
              const lvlConfig = getProceduralLevel(lvlNum);
              const scoreObj = levelScores[lvlNum] || { score: 0, stars: 0 };
              const isMilestone = lvlNum % 10 === 0;

              return (
                <div
                  key={lvlNum}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playStart();
                      onSelectLevel(lvlConfig);
                      onClose();
                    } else {
                      sound.playInvalid();
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 flex flex-col justify-between transition-all select-none ${
                    isUnlocked
                      ? isMilestone
                        ? 'bg-gradient-to-b from-purple-800 to-pink-900 border-amber-400 hover:border-yellow-200 cursor-pointer shadow-md'
                        : 'bg-purple-950/80 hover:bg-purple-900/80 border-purple-700 hover:border-pink-400 cursor-pointer'
                      : 'bg-purple-950/40 border-purple-900/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300">Level {lvlNum}</span>
                    {isUnlocked ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              scoreObj.stars >= s
                                ? 'fill-yellow-400 text-yellow-300'
                                : 'text-purple-800'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>

                  <div className="my-2">
                    <h5 className="font-bold text-xs text-white truncate">{lvlConfig.name}</h5>
                    <span className="text-[10px] text-purple-300">
                      Target: {lvlConfig.targetScore.toLocaleString()}
                    </span>
                  </div>

                  {isUnlocked && (
                    <button className="w-full py-1 rounded-xl bg-purple-800/80 hover:bg-pink-600 text-[10px] font-black text-white flex items-center justify-center gap-1 cursor-pointer">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More Levels */}
          <div className="text-center pt-3">
            <button
              onClick={() => {
                sound.playPop();
                setMaxDisplay((prev) => prev + 25);
              }}
              className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-cyan-300 font-black text-xs border border-purple-700 cursor-pointer shadow"
            >
              + Generate Next 25 Endless Levels (Levels {maxDisplay + 1}–{maxDisplay + 25})
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800 text-center text-xs text-purple-300">
          The Endless Map expands infinitely as you conquer higher levels!
        </div>

      </div>
    </div>
  );
};
