/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { BoosterType, ComboBanner, ScorePopup, Tile } from '../types/candy';
import { CandyPiece } from './CandyPiece';

interface BoardProps {
  board: Tile[][];
  selectedTile: Tile | null;
  onTileClick: (tile: Tile) => void;
  onSwipe: (r1: number, c1: number, r2: number, c2: number) => void;
  hintTiles: [Tile, Tile] | null;
  activeBooster: BoosterType | null;
  scorePopups: ScorePopup[];
  comboBanner: ComboBanner | null;
  isReshuffling: boolean;
  isBoardShaking: boolean;
  isProcessing: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  selectedTile,
  onTileClick,
  onSwipe,
  hintTiles,
  activeBooster,
  scorePopups,
  comboBanner,
  isReshuffling,
  isBoardShaking,
  isProcessing,
}) => {
  const rows = board.length;
  const cols = board[0].length;

  // Touch and drag swipe state
  const touchStartPos = useRef<{ x: number; y: number; r: number; c: number } | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ r: number; c: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    if (isProcessing) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY, r, c };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || isProcessing) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;
    const minSwipeDist = 20;

    const { r, c } = touchStartPos.current;
    touchStartPos.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > minSwipeDist && c < cols - 1) {
        onSwipe(r, c, r, c + 1);
      } else if (dx < -minSwipeDist && c > 0) {
        onSwipe(r, c, r, c - 1);
      }
    } else {
      if (dy > minSwipeDist && r < rows - 1) {
        onSwipe(r, c, r + 1, c);
      } else if (dy < -minSwipeDist && r > 0) {
        onSwipe(r, c, r - 1, c);
      }
    }
  };

  // Mouse Drag support for Desktop
  const handleMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    if (isProcessing) return;
    touchStartPos.current = { x: e.clientX, y: e.clientY, r, c };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartPos.current || isProcessing) return;
    const dx = e.clientX - touchStartPos.current.x;
    const dy = e.clientY - touchStartPos.current.y;
    const minSwipeDist = 25;

    const { r, c } = touchStartPos.current;
    touchStartPos.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > minSwipeDist && c < cols - 1) {
        onSwipe(r, c, r, c + 1);
      } else if (dx < -minSwipeDist && c > 0) {
        onSwipe(r, c, r, c - 1);
      }
    } else {
      if (dy > minSwipeDist && r < rows - 1) {
        onSwipe(r, c, r + 1, c);
      } else if (dy < -minSwipeDist && r > 0) {
        onSwipe(r, c, r - 1, c);
      }
    }
  };

  // Cursor style depending on booster
  const getCursorClass = () => {
    if (activeBooster === 'hammer') return 'cursor-crosshair';
    if (activeBooster === 'switch') return 'cursor-grab';
    if (activeBooster === 'bomb') return 'cursor-copy';
    return 'cursor-pointer';
  };

  return (
    <div className="relative flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Outer Fancy Candy Border */}
      <div
        className={`relative p-2.5 sm:p-3.5 rounded-3xl candy-board-wood border-4 border-amber-300/40 shadow-2xl transition-transform duration-100 ${
          isBoardShaking ? 'translate-x-1 translate-y-1 scale-[1.01]' : ''
        }`}
      >
        {/* Active Booster Banner if selecting */}
        {activeBooster && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-400 text-purple-950 font-black px-4 py-1 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-lg animate-bounce border-2 border-white z-40 whitespace-nowrap">
            {activeBooster === 'hammer' && '🔨 Tap any candy to crush it!'}
            {activeBooster === 'switch' && '⇄ Tap two candies anywhere to swap!'}
            {activeBooster === 'bomb' && '💣 Tap any candy to turn into Color Bomb!'}
          </div>
        )}

        {/* Board Tiles Grid */}
        <div
          className="grid gap-1 sm:gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((rowArr, r) =>
            rowArr.map((tile, c) => {
              const isSelected = selectedTile?.row === r && selectedTile?.col === c;
              const isHint = hintTiles
                ? (hintTiles[0].row === r && hintTiles[0].col === c) ||
                  (hintTiles[1].row === r && hintTiles[1].col === c)
                : false;
              const isHovered = hoveredTile?.r === r && hoveredTile?.c === c;

              return (
                <div
                  key={`${r}-${c}`}
                  onTouchStart={(e) => handleTouchStart(e, r, c)}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={(e) => handleMouseDown(e, r, c)}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={() => setHoveredTile({ r, c })}
                  onMouseLeave={() => setHoveredTile(null)}
                  onClick={() => onTileClick(tile)}
                  className={`relative w-9 h-9 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl flex items-center justify-center candy-tile-slot transition-colors duration-150 ${getCursorClass()} ${
                    isSelected ? 'ring-2 sm:ring-4 ring-yellow-300 z-20' : ''
                  }`}
                >
                  {/* Frosted Jelly Layer underneath */}
                  {tile.jelly > 0 && (
                    <div
                      className={`absolute inset-0.5 rounded-lg border border-pink-300/60 pointer-events-none z-10 transition-all ${
                        tile.jelly === 2
                          ? 'bg-gradient-to-br from-pink-400/60 to-purple-500/70 shadow-[inset_0_0_8px_rgba(236,72,153,0.8)]'
                          : 'bg-gradient-to-br from-pink-300/40 to-pink-500/40 shadow-[inset_0_0_4px_rgba(244,114,182,0.6)]'
                      }`}
                    >
                      <div className="absolute top-1 left-1 w-2 h-1 bg-white/70 rounded-full" />
                    </div>
                  )}

                  {/* Frosting / Sugar Biscuit Blocker */}
                  {tile.frosting > 0 && (
                    <div
                      className={`absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none z-20 transition-all shadow-md ${
                        tile.frosting === 2
                          ? 'bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-300'
                          : 'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200/80 opacity-90'
                      }`}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center p-1">
                        <div className="w-full h-0.5 bg-amber-400/40 mb-1" />
                        <div className="text-[10px] sm:text-xs font-black text-amber-800 tracking-tighter">
                          {tile.frosting === 2 ? 'ICING' : 'CRACK'}
                        </div>
                        <div className="w-full h-0.5 bg-amber-400/40 mt-1" />
                      </div>
                    </div>
                  )}

                  {/* Chocolate Block */}
                  {tile.chocolate && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#451a03] via-[#291102] to-[#170801] border-2 border-[#78350f] shadow-inner flex items-center justify-center pointer-events-none z-20">
                      <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#5c2506] border border-[#92400e] flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#361303] border border-[#a16207]" />
                      </div>
                    </div>
                  )}

                  {/* Candy Piece */}
                  {tile.candy && !tile.chocolate && (
                    <div className="relative z-15">
                      <CandyPiece
                        candy={tile.candy}
                        isSelected={isSelected}
                        isHinted={isHint}
                      />
                    </div>
                  )}

                  {/* Hammer / Booster target preview */}
                  {activeBooster === 'hammer' && isHovered && (
                    <div className="absolute inset-0 rounded-xl border-2 border-red-500 bg-red-500/20 pointer-events-none z-30 animate-pulse flex items-center justify-center">
                      <span className="text-lg">🔨</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Reshuffle Overlay */}
        {isReshuffling && (
          <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-50 animate-pop-in">
            <span className="text-4xl sm:text-5xl animate-spin mb-2">🍭</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-md">
              RESHUFFLING!
            </div>
            <div className="text-xs sm:text-sm text-purple-200 mt-1 font-semibold">
              Finding sweet new matches...
            </div>
          </div>
        )}

        {/* Floating Score Popups */}
        {scorePopups.map((popup) => (
          <div
            key={popup.id}
            className="absolute pointer-events-none z-50 font-black animate-pop-in transition-all duration-700 -translate-y-4"
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              color: popup.color || '#fde047',
              fontSize: popup.fontSize || '1.25rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
            }}
          >
            {popup.text}
          </div>
        ))}

        {/* Big Combo Word Banner: SWEET! / TASTY! / DELICIOUS! / DIVINE! */}
        {comboBanner && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-center animate-pop-in bg-purple-950/90 px-6 py-4 rounded-3xl border-4 border-yellow-300 shadow-2xl backdrop-blur-sm">
              <div
                className="text-3xl sm:text-5xl font-black tracking-wider uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                style={{ color: comboBanner.color }}
              >
                {comboBanner.title}
              </div>
              <div className="text-xs sm:text-sm text-yellow-200 font-bold uppercase tracking-widest mt-1">
                {comboBanner.subtitle}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
