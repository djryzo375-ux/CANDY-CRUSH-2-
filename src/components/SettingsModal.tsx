/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeviceRam, GraphicsPreset, UserSettings } from '../types/candy';
import { 
  Volume2, VolumeX, Music, Mic, ShieldAlert, 
  Check, Lock, Sparkles, X, Smartphone, Flame, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { sound } from '../audio/sound';
import { haptics } from '../utils/haptics';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClose: () => void;
}

interface PresetDef {
  id: GraphicsPreset;
  title: string;
  hindiTitle: string;
  minRam: DeviceRam;
  description: string;
  recommendedFor: string;
  badge?: string;
  features: string[];
}

const GRAPHICS_PRESETS: PresetDef[] = [
  {
    id: 'very_low',
    title: 'Very Low (Potato Mode)',
    hindiTitle: 'वेरी लो (सबसे सुरक्षित)',
    minRam: 1,
    recommendedFor: '1GB - 2GB RAM Phones',
    badge: '100% Safe • Recommended for 1GB/2GB',
    description: 'Minimal load, particle sparks disabled, zero lag. Phone stays cool with no overheating risk!',
    features: ['Fast CSS renders', 'No blur overhead', 'Zero lag guarantee', 'Phone stays ice cool ❄️'],
  },
  {
    id: 'low',
    title: 'Low',
    hindiTitle: 'लो ग्राफिक्स',
    minRam: 2,
    recommendedFor: '2GB - 3GB RAM Phones',
    badge: 'Lightweight',
    description: 'Basic candy shines and light animations suitable for budget smartphones.',
    features: ['Smooth 60FPS', 'Basic burst sparkles', 'Optimized memory'],
  },
  {
    id: 'medium',
    title: 'Medium',
    hindiTitle: 'मीडियम ग्राफिक्स',
    minRam: 3,
    recommendedFor: '3GB - 4GB RAM Phones',
    badge: 'Balanced',
    description: 'Standard visuals, bouncy candy pops, and glowing combo indicators.',
    features: ['Standard candy glow', 'Combo floating popups', 'Dynamic board reflections'],
  },
  {
    id: 'ultra_medium',
    title: 'Ultra Medium',
    hindiTitle: 'अल्ट्रा मीडियम',
    minRam: 4,
    recommendedFor: '4GB - 6GB RAM Devices',
    badge: 'Enhanced',
    description: 'Juicy candy physics, enhanced shadow depth, and smooth board transitions.',
    features: ['Enhanced shadows', 'Juicy wobble physics', 'Rich jelly effects'],
  },
  {
    id: 'very_high',
    title: 'Very High',
    hindiTitle: 'वेरी हाई ग्राफिक्स',
    minRam: 6,
    recommendedFor: '6GB+ RAM Flagships',
    badge: 'Requires 6GB RAM',
    description: 'Crisp high-definition candy glow, full particle bursts, and deep sugar crush effects.',
    features: ['Full rainbow particles', 'Screen rumble on combos', 'Reflective candy glaze'],
  },
  {
    id: 'extreme',
    title: 'Extreme',
    hindiTitle: 'एक्सट्रीम ग्राफिक्स',
    minRam: 8,
    recommendedFor: '8GB+ RAM Gaming Phones',
    badge: 'Requires 8GB RAM',
    description: 'Intense visual candy firestorms, cinema-grade sugar blasts, and hyper-dynamic sparkles.',
    features: ['Hyper dynamic particles', 'Ultra glow & bloom', 'Zero frame drop'],
  },
  {
    id: 'extreme_plus',
    title: 'Extreme Plus',
    hindiTitle: 'एक्सट्रीम प्लस (32GB / 16GB)',
    minRam: 16,
    recommendedFor: '16GB / 32GB RAM Pro Devices',
    badge: 'Requires 16GB+ RAM',
    description: 'Maximum visual luxury: ray-traced candy lighting simulations, fireworks storm & 120Hz feel.',
    features: ['Infinite particle trails', 'Photorealistic candy gloss', 'Cinema sugar fireworks'],
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'audio'>('graphics');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetDef) => {
    // RAM safety check:
    // If phone RAM is less than required, it becomes whitened out and clicking is BLOCKED with a safety warning!
    if (settings.deviceRam < preset.minRam) {
      sound.playInvalid();
      setWarningMessage(
        `⚠️ Phone Protection Activated! ${preset.title} requires at least ${preset.minRam}GB RAM. Your phone has ${settings.deviceRam}GB detected. Cannot enable to avoid phone overheating or freezing! 📱💥`
      );
      setTimeout(() => setWarningMessage(null), 4500);
      return;
    }

    sound.playPop();
    onUpdateSettings({ graphicsPreset: preset.id });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in select-none">
      <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-4 border-amber-400 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-4 bg-purple-950/90 border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300">Game Settings & Graphics</h2>
              <p className="text-xs text-purple-300">Customize Sound, Audio & Visual Performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-purple-800 hover:bg-pink-600 text-white flex items-center justify-center font-black transition-all cursor-pointer shadow"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Clean 2 Tabs: Graphics & Audio, Change RAM removed as requested) */}
        <div className="flex border-b border-purple-800 bg-purple-900/60 p-1 gap-1">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'graphics'
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Graphics (ग्राफिक्स)</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-800/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio & Voice (साउंड)</span>
          </button>
        </div>

        {/* Danger Warning Toast */}
        {warningMessage && (
          <div className="mx-4 mt-3 p-3 bg-red-600/90 border-2 border-yellow-300 rounded-2xl flex items-start gap-2 text-xs font-bold text-white shadow-lg animate-bounce">
            <Flame className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{warningMessage}</p>
            </div>
            <button onClick={() => setWarningMessage(null)} className="text-white hover:text-yellow-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB 1: GRAPHICS PRESETS */}
          {activeTab === 'graphics' && (
            <div className="space-y-3">
              <div className="bg-purple-950/70 p-3 rounded-2xl border border-purple-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-300" />
                  <div>
                    <span className="text-xs text-purple-300">Device Hardware Profile:</span>
                    <h4 className="text-sm font-black text-amber-300">{settings.deviceRam} GB RAM Detected</h4>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] bg-green-950/80 text-green-300 border border-green-600 px-3 py-1 rounded-full font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hardware Locked (Change RAM Removed)</span>
                </div>
              </div>

              <p className="text-xs text-purple-300">
                Select your graphics profile. Presets requiring more RAM than your device are <span className="text-amber-300 font-bold">locked & whitened out</span> to protect your phone from overheating:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {GRAPHICS_PRESETS.map((preset) => {
                  const isLocked = settings.deviceRam < preset.minRam;
                  const isSelected = settings.graphicsPreset === preset.id;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative p-3.5 rounded-2xl border-2 transition-all select-none ${
                        isLocked
                          ? 'bg-white/10 border-white/20 opacity-45 cursor-not-allowed filter backdrop-grayscale'
                          : isSelected
                          ? 'bg-gradient-to-r from-amber-500/30 to-pink-500/30 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer'
                          : 'bg-purple-900/40 hover:bg-purple-900/70 border-purple-700 hover:border-pink-400 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected 
                              ? 'bg-amber-400 border-white text-purple-950' 
                              : isLocked
                              ? 'bg-white/20 border-white/30 text-white/50'
                              : 'bg-purple-950 border-purple-600'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            {isLocked && <Lock className="w-3 h-3 text-white/60" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`font-black text-sm sm:text-base ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                                {preset.title}
                              </h3>
                              <span className="text-[11px] text-purple-300 font-medium">({preset.hindiTitle})</span>
                            </div>
                            <span className="text-[11px] text-pink-300 font-semibold">{preset.recommendedFor}</span>
                          </div>
                        </div>

                        {/* Badge */}
                        <div>
                          {isLocked ? (
                            <span className="text-[10px] bg-red-950/80 text-red-200 border border-red-500/60 font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                              <Lock className="w-2.5 h-2.5" /> Req {preset.minRam}GB+
                            </span>
                          ) : (
                            preset.badge && (
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                preset.id === 'very_low'
                                  ? 'bg-green-900/80 text-green-300 border-green-500'
                                  : 'bg-amber-900/80 text-amber-300 border-amber-500'
                              }`}>
                                {preset.badge}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-purple-200/90 mt-2 pl-7 leading-relaxed">
                        {preset.description}
                      </p>

                      {/* Locked Overlay warning indicator */}
                      {isLocked && (
                        <div className="mt-2.5 ml-7 p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Locked: Phone Safety Mode enabled. Tap blocked to prevent phone freezing.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO CONTROLS */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Sound Effects */}
              <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Sound Effects (साउंड इफेक्ट्स)</h4>
                      <p className="text-xs text-purple-300">Candy matches, pops, explosions & combos</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !settings.soundEnabled;
                      sound.setEnabled(next);
                      if (next) sound.playPop();
                      onUpdateSettings({ soundEnabled: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      settings.soundEnabled
                        ? 'bg-green-500 text-purple-950 hover:bg-green-400'
                        : 'bg-purple-800 text-purple-400 hover:bg-purple-700'
                    }`}
                  >
                    {settings.soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                {settings.soundEnabled && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-purple-400">Volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.soundVolume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        sound.setVolume(val);
                        onUpdateSettings({ soundVolume: val });
                      }}
                      className="flex-1 accent-amber-400 h-2 bg-purple-900 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono text-amber-300 w-8">
                      {Math.round(settings.soundVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Background Music */}
              <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-pink-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Background Music (मीठी धुन)</h4>
                      <p className="text-xs text-purple-300">Sweet candy crush soundtrack</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !settings.musicEnabled;
                      sound.toggleMusic(next);
                      onUpdateSettings({ musicEnabled: next });
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      settings.musicEnabled
                        ? 'bg-pink-500 text-white hover:bg-pink-400'
                        : 'bg-purple-800 text-purple-400 hover:bg-purple-700'
                    }`}
                  >
                    {settings.musicEnabled ? 'PLAYING' : 'MUTED'}
                  </button>
                </div>
              </div>

              {/* Voice Callouts */}
              <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Voice Chimes ("Sweet!", "Tasty!")</h4>
                    <p className="text-xs text-purple-300">Complimentary voice shouts on big combos</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.voiceChimes;
                    if (next) sound.playVoice('sweet');
                    onUpdateSettings({ voiceChimes: next });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    settings.voiceChimes
                      ? 'bg-cyan-500 text-purple-950 hover:bg-cyan-400'
                      : 'bg-purple-800 text-purple-400 hover:bg-purple-700'
                  }`}
                >
                  {settings.voiceChimes ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Haptic Vibration */}
              <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Haptic Feedback (वाइब्रेशन)</h4>
                    <p className="text-xs text-purple-300">Tactile pulses when matching candies & clearing specials</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = settings.vibrationEnabled === false ? true : false;
                    haptics.setEnabled(next);
                    if (next) haptics.match(2);
                    onUpdateSettings({ vibrationEnabled: next });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    settings.vibrationEnabled !== false
                      ? 'bg-amber-400 text-purple-950 hover:bg-amber-300'
                      : 'bg-purple-800 text-purple-400 hover:bg-purple-700'
                  }`}
                >
                  {settings.vibrationEnabled !== false ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-purple-950/90 border-t border-purple-800 flex items-center justify-between">
          <div className="text-xs text-purple-300">
            Detected: <span className="text-amber-300 font-bold">{settings.deviceRam}GB RAM</span> •{' '}
            <span className="text-pink-300 font-bold uppercase">{settings.graphicsPreset.replace('_', ' ')}</span>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-purple-950 font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
