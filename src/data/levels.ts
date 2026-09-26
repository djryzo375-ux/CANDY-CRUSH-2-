/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CandyColor, LevelConfig } from '../types/candy';

// Helper to construct structured 50 levels across 5 distinct candy chapters
const CHAPTERS = [
  { name: 'Pastel Prairie', min: 1, max: 10, theme: 'Meadows & First Confections' },
  { name: 'Lemon Mountain', min: 11, max: 20, theme: 'Citrus Peaks & Frosting Ridges' },
  { name: 'Cocoa Caverns', min: 21, max: 30, theme: 'Dark Chocolate Abyss' },
  { name: 'Soda Springs', min: 31, max: 40, theme: 'Fizzy River & Berry Falls' },
  { name: 'Sugar Metropolis', min: 41, max: 50, theme: 'Royal Candy Kingdom' },
];

function generateSagaLevels(): LevelConfig[] {
  const levels: LevelConfig[] = [
    // Chapter 1: Pastel Prairie (Levels 1 - 10)
    {
      id: 1,
      name: 'Sugar Meadows',
      chapter: 'Pastel Prairie',
      description: 'Welcome to Candy Crush 2! Score at least 6,000 points. Match 4 candies to make Striped rockets!',
      rows: 8,
      cols: 8,
      maxMoves: 22,
      colors: ['red', 'orange', 'yellow', 'green'],
      targetScore: 6000,
      starScores: [6000, 12000, 18000],
      difficulty: 'Normal',
    },
    {
      id: 2,
      name: 'Jelly Lagoon',
      chapter: 'Pastel Prairie',
      description: 'Clear all 16 translucent Jelly tiles hidden beneath the sweet candies!',
      rows: 8,
      cols: 8,
      maxMoves: 24,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 10000,
      starScores: [10000, 18000, 25000],
      targetJelly: 16,
      initialJellyTiles: [
        [2, 2], [2, 3], [2, 4], [2, 5],
        [3, 2], [3, 3], [3, 4], [3, 5],
        [4, 2], [4, 3], [4, 4], [4, 5],
        [5, 2], [5, 3], [5, 4], [5, 5],
      ],
      difficulty: 'Normal',
    },
    {
      id: 3,
      name: 'Frosting Fields',
      chapter: 'Pastel Prairie',
      description: 'Break through all the crispy sugar frosting blocks by matching adjacent candies!',
      rows: 8,
      cols: 8,
      maxMoves: 22,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 12000,
      starScores: [12000, 22000, 30000],
      targetFrosting: 12,
      initialFrostingTiles: [
        [1, 3, 1], [1, 4, 1],
        [2, 3, 2], [2, 4, 2],
        [3, 2, 1], [3, 3, 2], [3, 4, 2], [3, 5, 1],
        [4, 2, 1], [4, 5, 1],
        [5, 3, 1], [5, 4, 1],
      ],
      difficulty: 'Normal',
    },
    {
      id: 4,
      name: 'Cherry Orchard',
      chapter: 'Pastel Prairie',
      description: 'Bring 2 juicy red cherries down to the bottom row! Match candies underneath them.',
      rows: 8,
      cols: 8,
      maxMoves: 25,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 15000,
      starScores: [15000, 25000, 35000],
      targetIngredients: { type: 'cherry', required: 2 },
      ingredientSpawnCols: [2, 5],
      initialIngredientsCount: 2,
      difficulty: 'Normal',
    },
    {
      id: 5,
      name: 'Chocolate Swamp',
      chapter: 'Pastel Prairie',
      description: 'Beware expanding chocolate! Clear all chocolate blocks before they multiply across the board.',
      rows: 8,
      cols: 8,
      maxMoves: 22,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 14000,
      starScores: [14000, 24000, 34000],
      initialChocolateTiles: [
        [6, 3], [6, 4], [7, 3], [7, 4],
      ],
      difficulty: 'Normal',
    },
    {
      id: 6,
      name: 'Sweet Harmony',
      chapter: 'Pastel Prairie',
      description: 'Clear the 14 diamond jelly formation while racking up 18,000 points.',
      rows: 8,
      cols: 8,
      maxMoves: 23,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 18000,
      starScores: [18000, 28000, 40000],
      targetJelly: 14,
      initialJellyTiles: [
        [1, 3], [1, 4],
        [2, 2], [2, 5],
        [3, 1], [3, 6],
        [4, 1], [4, 6],
        [5, 2], [5, 5],
        [6, 3], [6, 4],
        [3, 3], [4, 4],
      ],
      difficulty: 'Normal',
    },
    {
      id: 7,
      name: 'Sugar Vault',
      chapter: 'Pastel Prairie',
      description: 'Shatter 16 reinforced double-frosting bricks guarding the candy treasure.',
      rows: 8,
      cols: 8,
      maxMoves: 24,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 20000,
      starScores: [20000, 35000, 50000],
      targetFrosting: 16,
      initialFrostingTiles: [
        [2, 1, 2], [2, 2, 2], [2, 5, 2], [2, 6, 2],
        [3, 2, 2], [3, 3, 2], [3, 4, 2], [3, 5, 2],
        [4, 2, 2], [4, 3, 2], [4, 4, 2], [4, 5, 2],
        [5, 1, 2], [5, 2, 2], [5, 5, 2], [5, 6, 2],
      ],
      difficulty: 'Normal',
    },
    {
      id: 8,
      name: 'Caramel Crossing',
      chapter: 'Pastel Prairie',
      description: 'Guide 3 Cherries through narrow caramel alleys down to safety!',
      rows: 8,
      cols: 8,
      maxMoves: 26,
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      targetScore: 22000,
      starScores: [22000, 36000, 52000],
      targetIngredients: { type: 'cherry', required: 3 },
      ingredientSpawnCols: [1, 3, 6],
      initialIngredientsCount: 2,
      difficulty: 'Normal',
    },
    {
      id: 9,
      name: 'Taffy Tangle',
      chapter: 'Pastel Prairie',
      description: 'Clear 20 Jellies surrounded by crunchy frosting borders.',
      rows: 8,
      cols: 8,
      maxMoves: 25,
      colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      targetScore: 24000,
      starScores: [24000, 42000, 60000],
      targetJelly: 20,
      initialJellyTiles: [
        [2, 2], [2, 3], [2, 4], [2, 5],
        [3, 1], [3, 2], [3, 5], [3, 6],
        [4, 1], [4, 2], [4, 5], [4, 6],
        [5, 2], [5, 3], [5, 4], [5, 5],
        [3, 3], [3, 4], [4, 3], [4, 4],
      ],
      initialFrostingTiles: [
        [1, 1, 1], [1, 6, 1], [6, 1, 1], [6, 6, 1]
      ],
      difficulty: 'Normal',
    },
    {
      id: 10,
      name: 'Prairie Climax - The Candy Hammer Trial',
      chapter: 'Pastel Prairie',
      description: 'MILESTONE LEVEL! Defeat the double chocolate creeping creeping invasion to unlock the LOLLIPOP HAMMER booster!',
      rows: 8,
      cols: 8,
      maxMoves: 24,
      colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
      targetScore: 28000,
      starScores: [28000, 48000, 70000],
      targetJelly: 16,
      targetFrosting: 8,
      initialChocolateTiles: [
        [0, 0], [0, 7], [7, 0], [7, 7]
      ],
      initialJellyTiles: [
        [2, 3], [2, 4], [3, 2], [3, 5], [4, 2], [4, 5], [5, 3], [5, 4],
        [3, 3], [3, 4], [4, 3], [4, 4], [1, 3], [1, 4], [6, 3], [6, 4]
      ],
      initialFrostingTiles: [
        [2, 2, 2], [2, 5, 2], [5, 2, 2], [5, 5, 2],
        [3, 1, 1], [3, 6, 1], [4, 1, 1], [4, 6, 1]
      ],
      difficulty: 'Hard',
    },
  ];

  // Helper generator for levels 11 to 50
  for (let id = 11; id <= 50; id++) {
    let chapter = 'Lemon Mountain';
    if (id >= 41) chapter = 'Sugar Metropolis';
    else if (id >= 31) chapter = 'Soda Springs';
    else if (id >= 21) chapter = 'Cocoa Caverns';

    const colors: CandyColor[] = id % 3 === 0 
      ? ['red', 'orange', 'yellow', 'green', 'blue', 'purple'] 
      : ['red', 'orange', 'yellow', 'green', 'blue'];

    let difficulty: 'Normal' | 'Hard' | 'Super Hard' | 'Nightmare' = 'Normal';
    if (id === 20 || id === 30 || id === 40) difficulty = 'Hard';
    if (id === 49) difficulty = 'Super Hard';
    if (id === 50) difficulty = 'Nightmare';

    // Different objectives across levels
    const mode = id % 4;
    const baseMoves = Math.max(18, 28 - Math.floor(id / 6));
    const targetScore = 20000 + id * 2500;
    const starScores: [number, number, number] = [
      targetScore,
      Math.round(targetScore * 1.6),
      Math.round(targetScore * 2.4),
    ];

    if (id === 30) {
      // Free Swap unlock level
      levels.push({
        id: 30,
        name: 'The Cavern Crucible',
        chapter,
        description: 'CHALLENGE LEVEL! Shatter 24 armored frosting layers & clear 16 jellies to UNLOCK FREE SWAP (⇄)!',
        rows: 8,
        cols: 8,
        maxMoves: 25,
        colors,
        targetScore,
        starScores,
        targetJelly: 16,
        targetFrosting: 16,
        initialJellyTiles: [
          [2, 2], [2, 3], [2, 4], [2, 5],
          [3, 2], [3, 3], [3, 4], [3, 5],
          [4, 2], [4, 3], [4, 4], [4, 5],
          [5, 2], [5, 3], [5, 4], [5, 5],
        ],
        initialFrostingTiles: [
          [1, 1, 2], [1, 2, 2], [1, 5, 2], [1, 6, 2],
          [2, 1, 2], [2, 6, 2], [5, 1, 2], [5, 6, 2],
          [6, 1, 2], [6, 2, 2], [6, 5, 2], [6, 6, 2],
          [3, 0, 1], [4, 0, 1], [3, 7, 1], [4, 7, 1],
        ],
        initialChocolateTiles: [
          [0, 3], [0, 4], [7, 3], [7, 4]
        ],
        difficulty: 'Hard',
      });
      continue;
    }

    if (id === 40) {
      // Color Bomb booster unlock level
      levels.push({
        id: 40,
        name: 'Soda Geyser Summit',
        chapter,
        description: 'MAJOR MILESTONE! Deliver 3 cherries through a raging chocolate flood to UNLOCK COLOR BOMB BOOSTER (💣)!',
        rows: 8,
        cols: 8,
        maxMoves: 24,
        colors,
        targetScore,
        starScores,
        targetIngredients: { type: 'cherry', required: 3 },
        ingredientSpawnCols: [1, 3, 5],
        initialIngredientsCount: 2,
        initialChocolateTiles: [
          [4, 2], [4, 5], [5, 3], [5, 4]
        ],
        initialFrostingTiles: [
          [2, 1, 2], [2, 6, 2], [3, 3, 2], [3, 4, 2], [6, 2, 2], [6, 5, 2]
        ],
        difficulty: 'Hard',
      });
      continue;
    }

    if (id === 50) {
      // Level 50 - Sweet Shuffle unlock level (Hard as user requested!)
      levels.push({
        id: 50,
        name: 'The Emperor Candy Citadel',
        chapter,
        description: 'THE GRAND CLIMAX! Super intense level! Clear 24 double jellies, break 16 fortress frostings, and tame 6 expanding chocolates to UNLOCK SWEET SHUFFLE (⚡)!',
        rows: 8,
        cols: 8,
        maxMoves: 26,
        colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
        targetScore: 120000,
        starScores: [120000, 200000, 300000],
        targetJelly: 24,
        targetFrosting: 16,
        initialChocolateTiles: [
          [0, 0], [0, 7], [3, 3], [3, 4], [7, 0], [7, 7]
        ],
        initialJellyTiles: [
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 1], [2, 6], [3, 1], [3, 6],
          [4, 1], [4, 6], [5, 1], [5, 6],
          [6, 2], [6, 3], [6, 4], [6, 5],
          [2, 2], [2, 5], [5, 2], [5, 5],
          [0, 3], [0, 4], [7, 3], [7, 4]
        ],
        initialFrostingTiles: [
          [2, 3, 2], [2, 4, 2], [5, 3, 2], [5, 4, 2],
          [3, 2, 2], [3, 5, 2], [4, 2, 2], [4, 5, 2],
          [1, 1, 2], [1, 6, 2], [6, 1, 2], [6, 6, 2],
          [4, 3, 2], [4, 4, 2], [3, 0, 1], [4, 7, 1]
        ],
        difficulty: 'Nightmare',
      });
      continue;
    }

    if (mode === 0) {
      // Jelly focused
      const jellyCount = 12 + (id % 10);
      const jellyTiles: [number, number][] = [];
      for (let r = 2; r <= 5; r++) {
        for (let c = 2; c <= 5; c++) {
          jellyTiles.push([r, c]);
        }
      }
      if (id % 2 === 0) {
        jellyTiles.push([1, 3], [1, 4], [6, 3], [6, 4]);
      }

      levels.push({
        id,
        name: `Jelly Whirlwind ${id}`,
        chapter,
        description: `Clear all ${jellyTiles.length} sparkling Jellies before you run out of moves!`,
        rows: 8,
        cols: 8,
        maxMoves: baseMoves,
        colors,
        targetScore,
        starScores,
        targetJelly: jellyTiles.length,
        initialJellyTiles: jellyTiles,
        difficulty,
      });
    } else if (mode === 1) {
      // Frosting focused
      const frostingTiles: [number, number, number][] = [
        [2, 2, 2], [2, 5, 2], [5, 2, 2], [5, 5, 2],
        [3, 3, 1], [3, 4, 1], [4, 3, 1], [4, 4, 1],
      ];
      if (id > 20) {
        frostingTiles.push([1, 3, 2], [1, 4, 2], [6, 3, 2], [6, 4, 2]);
      }

      levels.push({
        id,
        name: `Frosting Fortress ${id}`,
        chapter,
        description: `Crush through ${frostingTiles.length} layers of sturdy sweet frosting!`,
        rows: 8,
        cols: 8,
        maxMoves: baseMoves,
        colors,
        targetScore,
        starScores,
        targetFrosting: frostingTiles.length,
        initialFrostingTiles: frostingTiles,
        difficulty,
      });
    } else if (mode === 2) {
      // Cherry delivery
      const reqCherries = 2 + (id > 25 ? 1 : 0);
      levels.push({
        id,
        name: `Cherry Cascade ${id}`,
        chapter,
        description: `Guide all ${reqCherries} delicious ripe Cherries down to the delivery row!`,
        rows: 8,
        cols: 8,
        maxMoves: baseMoves + 2,
        colors,
        targetScore,
        starScores,
        targetIngredients: { type: 'cherry', required: reqCherries },
        ingredientSpawnCols: [2, 4, 6],
        initialIngredientsCount: 2,
        difficulty,
      });
    } else {
      // Mixed Chocolate / Jelly combo
      levels.push({
        id,
        name: `Chocolate Maze ${id}`,
        chapter,
        description: `Eliminate dark chocolate before it consumes the candy garden!`,
        rows: 8,
        cols: 8,
        maxMoves: baseMoves,
        colors,
        targetScore,
        starScores,
        targetJelly: 12,
        initialJellyTiles: [
          [2, 3], [2, 4], [3, 2], [3, 5], [4, 2], [4, 5],
          [5, 3], [5, 4], [3, 3], [3, 4], [4, 3], [4, 4]
        ],
        initialChocolateTiles: [
          [7, 2], [7, 5]
        ],
        difficulty,
      });
    }
  }

  return levels;
}

export const SAGA_LEVELS: LevelConfig[] = generateSagaLevels();

export const ENDLESS_LEVEL: LevelConfig = {
  id: 99,
  name: 'Endless Sweet Rush',
  chapter: 'Infinity Confection',
  description: 'Relax and match candies indefinitely! No move limit — rack up high scores and gigantic combos!',
  rows: 8,
  cols: 8,
  maxMoves: 999,
  colors: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
  targetScore: 50000,
  starScores: [25000, 75000, 150000],
  difficulty: 'Normal',
};
