/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';

interface RulesGuideModalProps {
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/80 backdrop-blur-md animate-pop-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-purple-900 via-fuchsia-950 to-purple-950 border-4 border-amber-300 rounded-3xl shadow-2xl p-4 sm:p-6 text-white flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-10 h-10 bg-pink-600 hover:bg-pink-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer z-20"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master The Confectionery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide drop-shadow-md">
            Candy Crush 2 Guide
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm text-purple-100">
          {/* Section 1: Special Candies */}
          <div className="bg-purple-900/60 p-3.5 rounded-2xl border border-purple-700">
            <h3 className="text-amber-300 font-black text-sm uppercase flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Special Candies</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="font-bold text-white">Striped Candy (Match 4 in a line)</div>
                  <div className="text-purple-200 text-xs">
                    Horizontal stripes blast an entire row; vertical stripes blast an entire column!
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-xl">🎁</span>
                <div>
                  <div className="font-bold text-white">Wrapped Candy (Match 5 in T or L shape)</div>
                  <div className="text-purple-200 text-xs">
                    Detonates a 3x3 explosion, falls, and explodes a second time!
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-xl">🌈</span>
                <div>
                  <div className="font-bold text-white">Color Bomb (Match 5 in a straight line)</div>
                  <div className="text-purple-200 text-xs">
                    Swap with any candy to zap all candies of that color from the entire board!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Special Combos */}
          <div className="bg-purple-900/60 p-3.5 rounded-2xl border border-purple-700">
            <h3 className="text-yellow-300 font-black text-sm uppercase flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Epic Special Combos</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-purple-200">
              <li>
                <strong className="text-pink-300">Striped + Striped:</strong> Cross blast clearing both a row and column!
              </li>
              <li>
                <strong className="text-pink-300">Striped + Wrapped:</strong> Mega 3-row & 3-column giant laser beam wipeout!
              </li>
              <li>
                <strong className="text-pink-300">Color Bomb + Striped:</strong> Turns all candies of that color into Striped Candies & triggers an explosive cascade!
              </li>
              <li>
                <strong className="text-pink-300">Color Bomb + Color Bomb:</strong> Supernova apocalypse clearing the whole board!
              </li>
            </ul>
          </div>

          {/* Section 3: Obstacles & Targets */}
          <div className="bg-purple-900/60 p-3.5 rounded-2xl border border-purple-700">
            <h3 className="text-pink-300 font-black text-sm uppercase flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Obstacles & Targets</span>
            </h3>
            <div className="space-y-2 text-xs text-purple-200">
              <div>
                <span className="font-bold text-white">🍬 Jellies:</span> Match candies resting on frosted tiles to clear the jelly beneath.
              </div>
              <div>
                <span className="font-bold text-white">🍪 Frosting Blocks:</span> Match adjacent candies to crack and break through sugar icing layers.
              </div>
              <div>
                <span className="font-bold text-white">🍫 Chocolate:</span> Spreads to adjacent tiles if not hit! Match candies adjacent to chocolate to stop its advance.
              </div>
              <div>
                <span className="font-bold text-white">🍒 Ingredients (Cherries):</span> Clear candies beneath cherries to guide them down to the bottom row!
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-black text-sm rounded-2xl shadow-lg border border-white cursor-pointer active:scale-95 transition-all"
        >
          Sweet, Let’s Play!
        </button>
      </div>
    </div>
  );
};
