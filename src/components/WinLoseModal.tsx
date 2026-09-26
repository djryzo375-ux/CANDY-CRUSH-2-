/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GameStats, LevelConfig } from '../types/candy';
import { Star, RotateCcw, ArrowRight, Trophy, HeartCrack, PlusCircle, Home, Map } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinLoseModalProps {
  status: 'win' | 'lose';
  level: LevelConfig;
  stats: GameStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onAddMoves: () => void;
  onHome?: () => void;
  onOpenMap?: () => void;
}

export const WinLoseModal: React.FC<WinLoseModalProps> = ({
  status,
  level,
  stats,
  hasNextLevel,
  onNextLevel,
  onRetry,
  onAddMoves,
  onHome,
  onOpenMap,
}) => {
  const isWin = status === 'win';

  useEffect(() => {
    if (isWin) {
      // Fire festive candy confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isWin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/85 backdrop-blur-md animate-pop-in select-none">
      <div
        className={`relative w-full max-w-sm bg-gradient-to-b ${
          isWin
            ? 'from-purple-900 via-indigo-950 to-purple-950 border-amber-400'
            : 'from-purple-950 via-slate-900 to-purple-950 border-rose-500'
        } border-4 rounded-3xl shadow-2xl p-5 sm:p-6 text-white text-center flex flex-col`}
      >
        {/* Banner Icon */}
        <div className="mx-auto -mt-12 sm:-mt-14 mb-2">
          {isWin ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.8)] text-4xl animate-bounce">
              🏆
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 border-4 border-white flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.8)] text-4xl">
              💔
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md">
          {isWin ? 'Level Completed!' : 'Out of Moves!'}
        </h2>
        <p className="text-xs sm:text-sm text-purple-200 mt-0.5">
          {isWin ? `Awesome work on ${level.name}!` : `Almost there! Give it another shot.`}
        </p>

        {/* Star Rating for Win */}
        {isWin && (
          <div className="flex items-center justify-center gap-2 my-3">
            {[1, 2, 3].map((starNum) => (
              <Star
                key={starNum}
                className={`w-8 h-8 transition-transform ${
                  stats.stars >= starNum
                    ? 'fill-yellow-400 text-yellow-300 scale-110 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse'
                    : 'text-purple-700/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Stats Summary Card */}
        <div className="bg-purple-950/70 border border-purple-800 rounded-2xl p-3 my-2 space-y-1.5">
          <div className="flex justify-between items-center text-xs text-purple-300">
            <span>Score Achieved</span>
            <span className="font-black text-amber-300 text-sm">{stats.score.toLocaleString()} pts</span>
          </div>
          {level.targetJelly && (
            <div className="flex justify-between items-center text-xs text-purple-300">
              <span>Jellies Cleared</span>
              <span className="font-bold text-pink-300">
                {stats.jellyCleared} / {stats.totalJelly}
              </span>
            </div>
          )}
          {level.targetFrosting && (
            <div className="flex justify-between items-center text-xs text-purple-300">
              <span>Frostings Broken</span>
              <span className="font-bold text-amber-300">
                {stats.frostingCleared} / {stats.totalFrosting}
              </span>
            </div>
          )}
          {level.targetIngredients && (
            <div className="flex justify-between items-center text-xs text-purple-300">
              <span>Ingredients Delivered</span>
              <span className="font-bold text-red-300">
                {stats.ingredientsDelivered} / {stats.totalIngredients}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-3">
          {isWin ? (
            <>
              {hasNextLevel && (
                <button
                  onClick={onNextLevel}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-emerald-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Next Sweet Level</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onRetry}
                className="w-full py-2 px-4 bg-purple-800/80 hover:bg-purple-700 active:scale-95 text-pink-200 font-bold text-xs sm:text-sm rounded-2xl border border-purple-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Level</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAddMoves}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg border-2 border-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Keep Playing (+5 Extra Moves)</span>
              </button>
              <button
                onClick={onRetry}
                className="w-full py-2 px-4 bg-purple-800/80 hover:bg-purple-700 active:scale-95 text-purple-200 font-bold text-xs sm:text-sm rounded-2xl border border-purple-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Level</span>
              </button>
            </>
          )}

          {/* Home & Map Navigation Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="py-2 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-cyan-300" />
                <span>Saga Map</span>
              </button>
            )}
            {onHome && (
              <button
                onClick={onHome}
                className="py-2 px-3 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-amber-300" />
                <span>Start Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
