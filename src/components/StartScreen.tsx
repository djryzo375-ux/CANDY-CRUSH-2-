/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, Settings, Map, ShoppingBag, BookOpen, 
  Sparkles, Crown, Volume2, VolumeX, ShieldCheck, Flame, Star,
  Gift, CheckSquare, Infinity, Rocket, User, AlertOctagon
} from 'lucide-react';
import { UserSettings } from '../types/candy';
import { sound } from '../audio/sound';

interface StartScreenProps {
  unlockedLevel: number;
  totalStars: number;
  gold: number;
  hasVipPass: boolean;
  settings: UserSettings;
  profileUsername: string;
  profileAvatar: string;
  hasUnclaimedDailyReward: boolean;
  hasUnclaimedLuckyWheel: boolean;
  dailyTasksUnclaimedCount: number;
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenMap: () => void;
  onOpenShop: () => void;
  onOpenGuide: () => void;
  onOpenDailyReward: () => void;
  onOpenLuckyWheel: () => void;
  onOpenDailyTasks: () => void;
  onOpenProfile: () => void;
  onOpenNextUpdate: () => void;
  onOpenEndlessMap: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  unlockedLevel,
  totalStars,
  gold,
  hasVipPass,
  settings,
  profileUsername,
  profileAvatar,
  hasUnclaimedDailyReward,
  hasUnclaimedLuckyWheel,
  dailyTasksUnclaimedCount,
  onPlay,
  onOpenSettings,
  onOpenMap,
  onOpenShop,
  onOpenGuide,
  onOpenDailyReward,
  onOpenLuckyWheel,
  onOpenDailyTasks,
  onOpenProfile,
  onOpenNextUpdate,
  onOpenEndlessMap,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 overflow-hidden select-none">
      
      {/* Dynamic Background Floating Candies & Light Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-8 text-5xl animate-bounce duration-1000">🍬</div>
        <div className="absolute top-28 right-10 text-6xl animate-pulse">🍭</div>
        <div className="absolute bottom-20 left-12 text-5xl animate-spin duration-3000">🍩</div>
        <div className="absolute bottom-32 right-12 text-5xl animate-bounce">🍫</div>
        <div className="absolute top-1/2 left-4 text-4xl animate-pulse">🧁</div>
        <div className="absolute top-1/3 right-6 text-4xl animate-bounce">🍒</div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar: Profile / VIP Status / Gold / Settings */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between pt-1">
        {/* Player Profile & Bio button */}
        <button
          onClick={() => {
            sound.playPop();
            onOpenProfile();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/80 hover:bg-purple-800 border border-purple-600 shadow transition-all cursor-pointer"
          title="Player Bio & Anti-Cheat Status"
        >
          <span className="text-lg">{profileAvatar}</span>
          <span className="text-xs font-black text-amber-300 max-w-[90px] truncate">{profileUsername}</span>
        </button>

        {/* Currency & Audio quick toggles */}
        <div className="flex items-center gap-2">
          {hasVipPass && (
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-black text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
              <Crown className="w-3.5 h-3.5" /> VIP PASS
            </span>
          )}

          <button
            onClick={() => {
              sound.playPop();
              onOpenShop();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/80 hover:bg-purple-800 rounded-full border border-amber-400/80 shadow cursor-pointer"
            title="Gold Shop & Passes"
          >
            <span className="text-amber-400 font-black">🪙</span>
            <span className="text-xs font-black text-amber-300">{gold.toLocaleString()}</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onOpenSettings();
            }}
            className="w-8 h-8 rounded-full bg-purple-900/80 hover:bg-purple-800 border border-purple-600 flex items-center justify-center text-purple-200 cursor-pointer shadow"
            title="Settings & Audio"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
        </div>
      </header>

      {/* Main Center Content: Title, Daily Rewards & Tasks, Big Start Actions */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-md w-full my-auto py-2">
        
        {/* Animated Main Logo */}
        <div className="relative mb-2">
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-amber-500/30 to-purple-500/30 blur-xl rounded-full"></div>
          
          <div className="relative inline-block">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-0.5 bg-gradient-to-r from-pink-600 to-amber-500 text-white rounded-full border border-white/60 shadow-lg">
              Official Edition 2.0
            </span>

            <h1 className="mt-1 text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-pink-400 to-rose-500 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] filter">
              CANDY CRUSH
            </h1>
            <div className="relative -mt-2">
              <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-[0_6px_10px_rgba(245,158,11,0.9)]">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Current Progress Pill */}
        <div className="bg-purple-950/80 border border-purple-700/80 rounded-2xl px-4 py-1.5 mb-3 flex items-center justify-between w-full max-w-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-purple-300">
            <span>Saga Progress:</span>
            <span className="font-black text-amber-300">Level {unlockedLevel} / 50</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{totalStars}</span>
          </div>
        </div>

        {/* FEATURE BAR: Daily Reward, Lucky Wheel, Daily Tasks, Endless Map & Next Update */}
        <div className="grid grid-cols-5 gap-1.5 w-full max-w-sm mb-3">
          {/* Daily Reward Button with Notification Badge */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenDailyReward();
            }}
            className={`relative p-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
              hasUnclaimedDailyReward
                ? 'bg-gradient-to-b from-amber-500/40 to-pink-500/40 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                : 'bg-purple-900/60 hover:bg-purple-800 border-purple-700 text-purple-200'
            }`}
            title="Claim Daily Login Gold"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="text-[9px] sm:text-[10px] font-black text-white mt-0.5 truncate max-w-full">Daily Gift</span>
            {hasUnclaimedDailyReward && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pink-600 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow">
                !
              </span>
            )}
          </button>

          {/* Daily Lucky Wheel Mini-Game */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenLuckyWheel();
            }}
            className={`relative p-2 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer group ${
              hasUnclaimedLuckyWheel
                ? 'bg-gradient-to-b from-pink-500/40 to-amber-500/40 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse'
                : 'bg-purple-900/60 hover:bg-purple-800 border-purple-700 text-purple-200'
            }`}
            title="Daily Lucky Wheel - Spin to win free Gold & Boosters"
          >
            <span className="text-base sm:text-lg group-hover:rotate-180 transition-transform duration-500">🎡</span>
            <span className="text-[9px] sm:text-[10px] font-black text-white mt-0.5 truncate max-w-full">Wheel</span>
            {hasUnclaimedLuckyWheel && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-purple-950 flex items-center justify-center text-[9px] font-black text-purple-950 shadow animate-bounce">
                !
              </span>
            )}
          </button>

          {/* Daily Tasks Button (English Only) */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenDailyTasks();
            }}
            className="relative p-2 rounded-2xl border bg-purple-900/60 hover:bg-purple-800 border-purple-700 text-purple-200 flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Daily Tasks & Quests (English)"
          >
            <CheckSquare className="w-5 h-5 text-cyan-300" />
            <span className="text-[10px] font-black text-white mt-0.5">Tasks</span>
            {dailyTasksUnclaimedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-purple-950 flex items-center justify-center text-[9px] font-black text-purple-950 shadow">
                {dailyTasksUnclaimedCount}
              </span>
            )}
          </button>

          {/* Endless Map Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenEndlessMap();
            }}
            className="p-2 rounded-2xl border bg-purple-900/60 hover:bg-purple-800 border-purple-700 text-purple-200 flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Endless Map with infinite procedural levels"
          >
            <Infinity className="w-5 h-5 text-pink-300" />
            <span className="text-[10px] font-black text-white mt-0.5">Endless</span>
          </button>

          {/* Next Update Teaser Button */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenNextUpdate();
            }}
            className="p-2 rounded-2xl border bg-purple-900/60 hover:bg-purple-800 border-purple-700 text-purple-200 flex flex-col items-center justify-center transition-all cursor-pointer"
            title="Next Update Coming Soon... Wait For!"
          >
            <Rocket className="w-5 h-5 text-yellow-300" />
            <span className="text-[10px] font-black text-white mt-0.5">Wait For!</span>
          </button>
        </div>

        {/* BUTTON STACK AS REQUESTED:
            "स्टार्ट फिर बहुत सारी चीज़ें जैसे कि स्टार्ट बटन, सेटिंग्स। प्ले के बटन के ऊपर ही होगा सेटिंग्स। उसपे टैप करेंगे। साउंड इफेक्ट्स, फिर ग्राफिक्स..."
        */}
        <div className="w-full max-w-xs space-y-2.5">
          
          {/* 1. SETTINGS BUTTON (Placed directly ABOVE the Play button as requested!) */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-sm border-2 border-indigo-400/80 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Settings className="w-5 h-5 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
            <div className="flex flex-col items-start text-left">
              <span className="leading-tight">Settings & Graphics (सेटिंग्स)</span>
              <span className="text-[10px] text-purple-200 font-normal">
                {settings.deviceRam}GB RAM • {settings.graphicsPreset.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </button>

          {/* 2. BIG START / PLAY BUTTON */}
          <button
            onClick={() => {
              sound.playStart();
              onPlay();
            }}
            className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-b from-amber-400 via-orange-500 to-pink-600 hover:from-amber-300 hover:via-orange-400 hover:to-pink-500 text-purple-950 font-black text-xl border-4 border-yellow-200 shadow-[0_0_35px_rgba(245,158,11,0.8)] flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-purple-950 text-amber-300 flex items-center justify-center shadow">
              <Play className="w-5 h-5 fill-amber-300 translate-x-0.5" />
            </div>
            <span className="tracking-wide drop-shadow">
              {unlockedLevel > 1 ? `PLAY LEVEL ${unlockedLevel}` : 'START GAME'}
            </span>
          </button>

          {/* 3. SECONDARY ACTION ROW: SAGA MAP & SHOP */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={() => {
                sound.playPop();
                onOpenMap();
              }}
              className="py-2 px-3 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-white font-bold text-xs border border-purple-600/80 shadow flex items-center justify-center gap-1.5 cursor-pointer hover:border-pink-400 transition-all active:scale-95"
            >
              <Map className="w-4 h-4 text-cyan-300" />
              <span>Saga Map (50)</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onOpenShop();
              }}
              className="py-2 px-3 rounded-2xl bg-gradient-to-r from-pink-600/90 to-purple-800 hover:from-pink-500 hover:to-purple-700 text-white font-bold text-xs border border-pink-400/80 shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>Shop & Pass ($)</span>
            </button>
          </div>

          {/* 4. RULES & COMBOS GUIDE */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenGuide();
            }}
            className="w-full py-1.5 rounded-xl text-purple-300 hover:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Play & Special Combos</span>
          </button>

        </div>

      </main>

      {/* Footer: Anti-Cheat Fair Play Warning */}
      <footer className="relative z-10 w-full max-w-md text-center py-1 text-[11px] text-purple-400 flex items-center justify-center gap-2">
        <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
        <span>Anti-Cheat Active: Using hacks will result in permanent ID BAN!</span>
      </footer>

    </div>
  );
};
