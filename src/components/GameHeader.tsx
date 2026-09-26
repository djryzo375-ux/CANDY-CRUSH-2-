/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats, LevelConfig } from '../types/candy';
import { Volume2, VolumeX, Music, RotateCcw, Map, Star, Settings, Home, ShoppingBag, Infinity, CheckSquare } from 'lucide-react';

interface GameHeaderProps {
  level: LevelConfig;
  stats: GameStats;
  soundEnabled: boolean;
  musicEnabled: boolean;
  gold: number;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onRestart: () => void;
  onOpenMap: () => void;
  onOpenEndlessMap?: () => void;
  onOpenDailyTasks?: () => void;
  onOpenSettings: () => void;
  onOpenShop: () => void;
  onGoHome: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  stats,
  soundEnabled,
  musicEnabled,
  gold,
  onToggleSound,
  onToggleMusic,
  onRestart,
  onOpenMap,
  onOpenEndlessMap,
  onOpenDailyTasks,
  onOpenSettings,
  onOpenShop,
  onGoHome,
}) => {
  const { score, movesRemaining, stars, totalJelly, jellyCleared, totalFrosting, frostingCleared, ingredientsDelivered, totalIngredients } = stats;
  const [star1, star2, star3] = level.starScores;

  // Star Progress Percentage
  const progressPercent = Math.min(100, Math.round((score / star3) * 100));

  const isLowMoves = movesRemaining <= 5 && level.id !== 99;

  return (
    <header className="w-full max-w-xl mx-auto px-3 py-1.5 flex flex-col gap-1.5 select-none">
      {/* Top Bar: Home, Level title, shop, settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onGoHome}
            className="p-1.5 bg-purple-900/80 hover:bg-purple-800 text-amber-300 rounded-xl border border-purple-600 shadow transition-all cursor-pointer"
            title="Return to Start Menu"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenMap}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md border border-amber-200 transition-all cursor-pointer"
            title="Saga Map"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          {onOpenEndlessMap && (
            <button
              onClick={onOpenEndlessMap}
              className="p-1.5 bg-purple-900/80 hover:bg-purple-800 text-cyan-300 rounded-xl border border-purple-600 shadow transition-all cursor-pointer"
              title="Infinite Endless Map"
            >
              <Infinity className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider leading-none">
              {level.chapter}
            </div>
            <h1 className="text-xs sm:text-sm font-black text-amber-300 drop-shadow tracking-wide leading-tight">
              {level.id === 99 ? 'Endless Rush' : `Level ${level.id}: ${level.name}`}
            </h1>
          </div>
        </div>

        {/* Currency & Settings Toggles */}
        <div className="flex items-center gap-1.5">
          {onOpenDailyTasks && (
            <button
              onClick={onOpenDailyTasks}
              className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-cyan-300 border border-purple-600 transition-all cursor-pointer"
              title="Daily Tasks (English)"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 px-2 py-1 bg-purple-900/90 hover:bg-purple-800 rounded-xl border border-amber-400/80 text-amber-300 shadow cursor-pointer"
            title="VIP Shop & Boosters"
          >
            <span className="text-xs">🪙</span>
            <span className="text-[11px] font-black">{gold.toLocaleString()}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600 transition-all cursor-pointer"
            title="Game Settings & Graphics"
          >
            <Settings className="w-4 h-4 text-amber-300" />
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-pink-200 border border-purple-600 transition-all cursor-pointer"
            title="Restart Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Card: Moves badge, objectives, and score */}
      <div className="grid grid-cols-12 gap-2 items-center bg-gradient-to-r from-purple-900/90 via-fuchsia-950/90 to-purple-900/90 border-2 border-pink-500/40 rounded-2xl p-2 shadow-xl backdrop-blur-sm">
        {/* Moves Left */}
        <div className="col-span-3 flex flex-col items-center justify-center bg-purple-950/80 border border-purple-700/80 rounded-xl py-1 px-1">
          <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest leading-none">
            Moves
          </span>
          <span
            className={`text-xl sm:text-2xl font-black leading-tight ${
              isLowMoves ? 'text-red-400 animate-pulse scale-105' : 'text-yellow-300'
            }`}
          >
            {level.id === 99 ? '∞' : movesRemaining}
          </span>
        </div>

        {/* Level Targets / Objectives */}
        <div className="col-span-5 flex items-center justify-around gap-1 px-1">
          {/* Jelly Target */}
          {totalJelly > 0 && (
            <div className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-xl border border-blue-400/30">
              <span className="text-base sm:text-lg">🧊</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] text-blue-200 font-bold">Jelly</span>
                <span className="text-xs font-black text-white">
                  {jellyCleared}/{totalJelly}
                </span>
              </div>
            </div>
          )}

          {/* Frosting Target */}
          {totalFrosting > 0 && (
            <div className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-xl border border-amber-400/30">
              <span className="text-base sm:text-lg">🧇</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] text-amber-200 font-bold">Frost</span>
                <span className="text-xs font-black text-white">
                  {frostingCleared}/{totalFrosting}
                </span>
              </div>
            </div>
          )}

          {/* Ingredients Target */}
          {totalIngredients > 0 && (
            <div className="flex items-center gap-1 bg-purple-950/60 px-2 py-1 rounded-xl border border-rose-400/30">
              <span className="text-base sm:text-lg">🍒</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] text-rose-200 font-bold">Cherries</span>
                <span className="text-xs font-black text-white">
                  {ingredientsDelivered}/{totalIngredients}
                </span>
              </div>
            </div>
          )}

          {/* Fallback to Score target if no specific board obstacles */}
          {!totalJelly && !totalFrosting && !totalIngredients && (
            <div className="flex flex-col items-center leading-none text-center">
              <span className="text-[10px] text-purple-200 font-bold">Target Score</span>
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {level.targetScore.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Current Score */}
        <div className="col-span-4 flex flex-col items-end pr-1">
          <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest leading-none">
            Score
          </span>
          <span className="text-base sm:text-lg font-black text-yellow-300 tracking-wide leading-tight">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bottom Bar: Star Progress Meter */}
      <div className="relative w-full flex items-center gap-2 px-1">
        <div className="flex-1 bg-purple-950/80 h-3 rounded-full border border-purple-700/80 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-yellow-300 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3 Star Icons */}
        <div className="flex items-center gap-1">
          <Star
            className={`w-4 h-4 transition-transform ${
              stars >= 1
                ? 'fill-yellow-400 text-yellow-300 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                : 'text-purple-600'
            }`}
          />
          <Star
            className={`w-4 h-4 transition-transform ${
              stars >= 2
                ? 'fill-yellow-400 text-yellow-300 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                : 'text-purple-600'
            }`}
          />
          <Star
            className={`w-4 h-4 transition-transform ${
              stars >= 3
                ? 'fill-yellow-400 text-yellow-300 scale-125 drop-shadow-[0_0_12px_rgba(250,204,21,1)]'
                : 'text-purple-600'
            }`}
          />
        </div>
      </div>
    </header>
  );
};
