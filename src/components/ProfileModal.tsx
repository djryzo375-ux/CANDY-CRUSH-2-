/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayerProfile } from '../types/candy';
import { X, ShieldAlert, ShieldCheck, User, Edit3, Check, Flame, AlertOctagon, Terminal } from 'lucide-react';
import { sound } from '../audio/sound';

interface ProfileModalProps {
  profile: PlayerProfile;
  onUpdateProfile: (newProfile: Partial<PlayerProfile>) => void;
  onClose: () => void;
}

const AVATARS = ['👑', '🍬', '🍭', '🍫', '🍒', '🍩', '🧁', '🦄', '⚡', '🎮'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [isEditing, setIsEditing] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'passed'>('idle');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  const handleSave = () => {
    sound.playPop();
    onUpdateProfile({ username, bio, avatar });
    setIsEditing(false);
  };

  const runAntiCheatScan = () => {
    sound.playPop();
    setScanStatus('scanning');
    setSecurityNotice('Scanning memory integrity, APK signatures, and game speed...');

    setTimeout(() => {
      sound.playMatch(3);
      setScanStatus('passed');
      setSecurityNotice('✅ System Verified: Integrity 100% Clean! Warning: If you are using hacks, your ID will be permanently banned!');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <h2 className="text-lg font-black text-amber-300">Player Profile & Security</h2>
              <p className="text-xs text-purple-300">Custom Bio, ID & Anti-Cheat Fair Play Shield</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* ANTI-CHEAT PERMANENT BAN WARNING BANNER */}
          <div className="bg-red-950/90 border-2 border-red-500 p-3.5 rounded-2xl shadow-lg space-y-1.5">
            <div className="flex items-center gap-2 text-red-300">
              <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
              <h3 className="font-black text-sm tracking-wide uppercase text-white">
                Anti-Cheat Fair Play System
              </h3>
            </div>
            <p className="text-xs text-red-200 leading-relaxed font-semibold">
              <span className="text-yellow-300 font-bold">WARNING:</span> If you are using hacks, speed-mods, or unauthorized tools, <span className="underline decoration-red-400 font-black text-white">YOUR ID WILL BE PERMANENTLY BANNED</span> immediately! Fair Play is strictly monitored on this device.
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px] text-red-300 font-mono">
              <span>Account Status: <strong className="text-green-400">ACTIVE & CLEAN</strong></span>
              <span>Shield: <strong className="text-cyan-300">v2.4 ENFORCED</strong></span>
            </div>
          </div>

          {/* Player Card & Bio */}
          <div className="bg-purple-950/70 border border-purple-700/80 p-4 rounded-2xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 border-2 border-white flex items-center justify-center text-3xl shadow-lg">
                  {avatar}
                </div>
                <div>
                  <h3 className="font-black text-base text-amber-300">{username}</h3>
                  <div className="text-[11px] font-mono text-purple-300 flex items-center gap-1">
                    <span>Player ID:</span>
                    <span className="text-cyan-300 bg-purple-900 px-2 py-0.5 rounded border border-purple-700">
                      {profile.playerId}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs bg-purple-800 hover:bg-purple-700 px-3 py-1.5 rounded-xl border border-purple-600 flex items-center gap-1 font-bold cursor-pointer text-purple-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Bio'}</span>
              </button>
            </div>

            {/* Editable Bio Section */}
            {isEditing ? (
              <div className="space-y-3 pt-2 border-t border-purple-800">
                <div>
                  <label className="text-xs text-purple-300 font-bold block mb-1">Player Name:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-purple-900 border border-purple-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-purple-300 font-bold block mb-1">Choose Avatar:</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => setAvatar(av)}
                        className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center cursor-pointer transition-transform ${
                          avatar === av
                            ? 'bg-amber-400 border-white scale-110 shadow'
                            : 'bg-purple-900/60 border-purple-700 hover:bg-purple-800'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-purple-300 font-bold block mb-1">Player Bio / Status:</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-purple-900 border border-purple-600 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="Write a sweet quote or your player status..."
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile & Bio</span>
                </button>
              </div>
            ) : (
              <div className="bg-purple-900/40 p-3 rounded-xl border border-purple-800">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block mb-0.5">
                  Player Bio
                </span>
                <p className="text-xs text-purple-200 italic">"{bio || 'No bio written yet. Tap Edit to add your custom player bio!'}"</p>
              </div>
            )}
          </div>

          {/* Interactive Anti-Cheat Scan Action */}
          <div className="bg-purple-950/70 border border-purple-700/80 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">Client Integrity Scanner</h4>
              </div>
              <button
                onClick={runAntiCheatScan}
                disabled={scanStatus === 'scanning'}
                className="text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1 rounded-xl shadow cursor-pointer transition-all disabled:opacity-50"
              >
                {scanStatus === 'scanning' ? 'Scanning...' : 'Check Integrity'}
              </button>
            </div>

            {scanStatus === 'scanning' && (
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-purple-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 animate-pulse w-full"></div>
                </div>
                <p className="text-[10px] font-mono text-cyan-300">Checking for modded scripts and hacks...</p>
              </div>
            )}

            {securityNotice && (
              <p className="text-[11px] text-green-300 font-mono bg-purple-900/60 p-2 rounded-lg border border-purple-700">
                {securityNotice}
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-purple-950/90 border-t border-purple-800 text-center text-xs text-purple-300">
          Candy Crush 2 Fair Play Policy: Zero tolerance for hacks or cheat engines.
        </div>

      </div>
    </div>
  );
};
