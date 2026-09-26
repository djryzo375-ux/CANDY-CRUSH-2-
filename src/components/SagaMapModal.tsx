/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LevelConfig } from '../types/candy';
import { SAGA_LEVELS, ENDLESS_LEVEL } from '../data/levels';
import { Star, Lock, X, Play, Trophy, Sparkles, Award } from 'lucide-react';

interface SagaMapModalProps {
  currentLevelId: number;
  unlockedLevel: number;
  levelScores: Record<number, { score: number; stars: number }>;
  onSelectLevel: (level: LevelConfig) => void;
  onClose: () => void;
}

export const SagaMapModal: React.FC<SagaMapModalProps> = ({
  currentLevelId,
  unlockedLevel,
  levelScores,
  onSelectLevel,
  onClose,
}) => {
  const totalStars = Object.values(levelScores).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/80 backdrop-blur-md animate-pop-in select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-purple-900 via-fuchsia-950 to-purple-950 border-4 border-amber-300 rounded-3xl shadow-2xl p-4 sm:p-6 text-white flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-pink-600 hover:bg-pink-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Candy Kingdom Saga • 50 Levels</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide drop-shadow-md">
            Level Select
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex items-center gap-1 bg-purple-800/80 px-3 py-1 rounded-full border border-purple-600 text-xs font-black text-yellow-300">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-400" />
              <span>{totalStars} / {SAGA_LEVELS.length * 3} Stars</span>
            </div>
            <div className="bg-purple-800/80 px-3 py-1 rounded-full border border-purple-600 text-xs font-black text-pink-300">
              <span>Unlocked: Level {unlockedLevel} / 50</span>
            </div>
          </div>
        </div>

        {/* Scrollable Levels Map */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-2 custom-scrollbar">
          {/* Endless Mode Banner */}
          <div
            onClick={() => {
              onSelectLevel(ENDLESS_LEVEL);
              onClose();
            }}
            className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
              currentLevelId === 99
                ? 'bg-gradient-to-r from-amber-500 to-pink-600 border-white shadow-lg'
                : 'bg-gradient-to-r from-purple-800/80 to-pink-900/80 hover:from-purple-700 hover:to-pink-800 border-pink-400/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-purple-950 font-black flex items-center justify-center text-xl shadow">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Bonus Mode</div>
                <div className="text-base font-black text-white">Endless Sweet Rush</div>
                <div className="text-xs text-purple-200">Unlimited moves, pure combo joy!</div>
              </div>
            </div>
            <Play className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>

          {/* Saga Levels List (50 Levels) */}
          <div className="grid grid-cols-1 gap-2">
            {SAGA_LEVELS.map((lvl) => {
              const isUnlocked = lvl.id <= unlockedLevel;
              const isCurrent = lvl.id === currentLevelId;
              const stats = levelScores[lvl.id] || { score: 0, stars: 0 };

              let milestoneTag: string | null = null;
              if (lvl.id === 10) milestoneTag = '🔨 Unlocks Lollipop Hammer!';
              else if (lvl.id === 30) milestoneTag = '⇄ Unlocks Free Swap!';
              else if (lvl.id === 40) milestoneTag = '💣 Unlocks Color Bomb!';
              else if (lvl.id === 50) milestoneTag = '⚡ Unlocks Sweet Shuffle!';

              return (
                <div
                  key={lvl.id}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectLevel(lvl);
                      onClose();
                    }
                  }}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    !isUnlocked
                      ? 'bg-purple-950/40 border-purple-900/60 opacity-60 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-gradient-to-r from-purple-800 via-fuchsia-900 to-purple-800 border-amber-300 shadow-xl ring-2 ring-amber-300/40 cursor-pointer'
                      : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-700 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Level Number Badge */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shadow-inner shrink-0 ${
                        !isUnlocked
                          ? 'bg-purple-950 text-gray-500 border border-purple-900'
                          : isCurrent
                          ? 'bg-amber-400 text-purple-950 border-2 border-white'
                          : lvl.difficulty === 'Nightmare'
                          ? 'bg-red-600 text-white border border-red-300'
                          : lvl.difficulty === 'Hard'
                          ? 'bg-purple-600 text-white border border-amber-300'
                          : 'bg-pink-600 text-white border border-pink-400'
                      }`}
                    >
                      {isUnlocked ? lvl.id : <Lock className="w-4 h-4 text-gray-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                          {lvl.chapter}
                        </span>
                        {lvl.difficulty && lvl.difficulty !== 'Normal' && (
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                            lvl.difficulty === 'Nightmare'
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-purple-950'
                          }`}>
                            {lvl.difficulty}
                          </span>
                        )}
                        {milestoneTag && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-purple-950 shadow">
                            {milestoneTag}
                          </span>
                        )}
                      </div>

                      <div className="text-sm sm:text-base font-black text-white truncate">
                        {lvl.name}
                      </div>
                      <div className="text-[11px] text-purple-200 line-clamp-1">
                        {lvl.description}
                      </div>
                    </div>
                  </div>

                  {/* Stars & Highscore */}
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    {isUnlocked ? (
                      <>
                        <div className="flex items-center gap-0.5 mb-1">
                          {[1, 2, 3].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-3.5 h-3.5 ${
                                stats.stars >= starNum
                                  ? 'fill-yellow-400 text-yellow-300 drop-shadow'
                                  : 'text-purple-400/40'
                              }`}
                            />
                          ))}
                        </div>
                        {stats.score > 0 && (
                          <div className="text-[10px] font-bold text-amber-300">
                            {stats.score.toLocaleString()} pts
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-purple-800 text-xs text-purple-300 font-medium">
          Conquer each level to unlock the next sweet adventure up to Level 50!
        </div>
      </div>
    </div>
  );
};
