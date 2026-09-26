/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candy, CandyColor, LevelConfig, SpecialType, Tile } from '../types/candy';

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getRandomColor(colors: CandyColor[]): CandyColor {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function createCandy(color: CandyColor, special: SpecialType = 'normal'): Candy {
  return {
    id: generateRandomId(),
    color,
    special,
  };
}

export function cloneBoard(board: Tile[][]): Tile[][] {
  return board.map((row) =>
    row.map((tile) => ({
      ...tile,
      candy: tile.candy ? { ...tile.candy } : null,
    }))
  );
}

/**
 * Creates an initial board with no 3-in-a-row matches
 */
export function createBoard(level: LevelConfig): Tile[][] {
  const { rows, cols, colors, initialJellyTiles, initialFrostingTiles, initialChocolateTiles } = level;

  // Build grid
  const board: Tile[][] = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        row: r,
        col: c,
        candy: null,
        jelly: 0,
        frosting: 0,
        chocolate: false,
      };
    }
  }

  // Set Jellies
  if (initialJellyTiles) {
    initialJellyTiles.forEach(([r, c]) => {
      if (board[r] && board[r][c]) {
        board[r][c].jelly = 1;
      }
    });
  }

  // Set Frosting
  if (initialFrostingTiles) {
    initialFrostingTiles.forEach(([r, c, layers]) => {
      if (board[r] && board[r][c]) {
        board[r][c].frosting = layers || 1;
      }
    });
  }

  // Set Chocolate
  if (initialChocolateTiles) {
    initialChocolateTiles.forEach(([r, c]) => {
      if (board[r] && board[r][c]) {
        board[r][c].chocolate = true;
      }
    });
  }

  // Spawn initial ingredients at top row if configured
  const ingredientsToSpawn = level.initialIngredientsCount || 0;
  const ingredientCols = level.ingredientSpawnCols || [Math.floor(cols / 2)];
  let spawnedIngredients = 0;

  // Fill candies ensuring no 3-in-a-row matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // If tile is chocolate, no candy sits on it
      if (board[r][c].chocolate) continue;

      // Check ingredient placement
      if (r === 0 && spawnedIngredients < ingredientsToSpawn && ingredientCols.includes(c)) {
        board[r][c].candy = {
          id: generateRandomId(),
          color: getRandomColor(colors),
          special: 'normal',
          isIngredient: level.targetIngredients?.type || 'cherry',
        };
        spawnedIngredients++;
        continue;
      }

      // Avoid 3-in-a-row
      let color: CandyColor;
      let attempts = 0;
      do {
        color = getRandomColor(colors);
        attempts++;
      } while (
        attempts < 20 &&
        ((c >= 2 &&
          board[r][c - 1].candy?.color === color &&
          board[r][c - 2].candy?.color === color) ||
          (r >= 2 &&
            board[r - 1][c].candy?.color === color &&
            board[r - 2][c].candy?.color === color))
      );

      board[r][c].candy = createCandy(color);
    }
  }

  // Verify that at least one valid move exists; if not, reshuffle
  if (!findPotentialMove(board, colors)) {
    reshuffleBoard(board, colors);
  }

  return board;
}

export interface MatchResult {
  matchedCoords: [number, number][];
  specialsToCreate: {
    row: number;
    col: number;
    type: SpecialType;
    color: CandyColor;
  }[];
}

/**
 * Finds all 3, 4, and 5-in-a-row matches, including T and L shapes
 */
export function findMatches(board: Tile[][], swappedPos?: { r1: number; c1: number; r2: number; c2: number }): MatchResult {
  const rows = board.length;
  const cols = board[0].length;

  // Track horizontal and vertical runs
  const hMatches: { r: number; cStart: number; cEnd: number; color: CandyColor }[] = [];
  const vMatches: { cStart: number; rStart: number; rEnd: number; color: CandyColor }[] = [];

  // Horizontal scan
  for (let r = 0; r < rows; r++) {
    let matchLen = 1;
    for (let c = 0; c < cols; c++) {
      const current = board[r][c].candy;
      const next = c + 1 < cols ? board[r][c + 1].candy : null;

      if (
        current &&
        !current.isIngredient &&
        next &&
        !next.isIngredient &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          hMatches.push({
            r,
            cStart: c - matchLen + 1,
            cEnd: c,
            color: current.color,
          });
        }
        matchLen = 1;
      }
    }
  }

  // Vertical scan
  for (let c = 0; c < cols; c++) {
    let matchLen = 1;
    for (let r = 0; r < rows; r++) {
      const current = board[r][c].candy;
      const next = r + 1 < rows ? board[r + 1][c].candy : null;

      if (
        current &&
        !current.isIngredient &&
        next &&
        !next.isIngredient &&
        current.color === next.color
      ) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          vMatches.push({
            cStart: c,
            rStart: r - matchLen + 1,
            rEnd: r,
            color: current.color,
          });
        }
        matchLen = 1;
      }
    }
  }

  const matchedSet = new Set<string>();
  const specialsToCreate: MatchResult['specialsToCreate'] = [];

  const addCoord = (r: number, c: number) => {
    matchedSet.add(`${r},${c}`);
  };

  // Helper to determine the best coordinate to place the special candy:
  // If player swapped candies at swappedPos, prioritize the swapped position if it lies in the match
  const getSpecialPosition = (coords: [number, number][]): [number, number] => {
    if (swappedPos) {
      for (const [r, c] of coords) {
        if (
          (r === swappedPos.r1 && c === swappedPos.c1) ||
          (r === swappedPos.r2 && c === swappedPos.c2)
        ) {
          return [r, c];
        }
      }
    }
    // Default to the middle of the match
    return coords[Math.floor(coords.length / 2)];
  };

  // 1. Detect T or L shapes (intersecting horizontal & vertical matches of the same color)
  const consumedH = new Set<number>();
  const consumedV = new Set<number>();

  for (let hIdx = 0; hIdx < hMatches.length; hIdx++) {
    const hm = hMatches[hIdx];
    for (let vIdx = 0; vIdx < vMatches.length; vIdx++) {
      const vm = vMatches[vIdx];
      if (hm.color === vm.color) {
        // Check for intersection
        if (vm.cStart >= hm.cStart && vm.cStart <= hm.cEnd && hm.r >= vm.rStart && hm.r <= vm.rEnd) {
          // Intersection found! Creates a WRAPPED CANDY at the intersection
          const intR = hm.r;
          const intC = vm.cStart;

          // Add all coords from both
          for (let c = hm.cStart; c <= hm.cEnd; c++) addCoord(hm.r, c);
          for (let r = vm.rStart; r <= vm.rEnd; r++) addCoord(r, vm.cStart);

          specialsToCreate.push({
            row: intR,
            col: intC,
            type: 'wrapped',
            color: hm.color,
          });

          consumedH.add(hIdx);
          consumedV.add(vIdx);
        }
      }
    }
  }

  // 2. Process remaining horizontal matches
  for (let hIdx = 0; hIdx < hMatches.length; hIdx++) {
    if (consumedH.has(hIdx)) continue;
    const hm = hMatches[hIdx];
    const coords: [number, number][] = [];
    for (let c = hm.cStart; c <= hm.cEnd; c++) {
      addCoord(hm.r, c);
      coords.push([hm.r, c]);
    }

    const len = hm.cEnd - hm.cStart + 1;
    const [specR, specC] = getSpecialPosition(coords);

    if (len >= 5) {
      // 5 in a row -> Color Bomb!
      specialsToCreate.push({
        row: specR,
        col: specC,
        type: 'color_bomb',
        color: hm.color,
      });
    } else if (len === 4) {
      // 4 horizontal -> Vertical striped candy (clears column)
      specialsToCreate.push({
        row: specR,
        col: specC,
        type: 'striped_v',
        color: hm.color,
      });
    }
  }

  // 3. Process remaining vertical matches
  for (let vIdx = 0; vIdx < vMatches.length; vIdx++) {
    if (consumedV.has(vIdx)) continue;
    const vm = vMatches[vIdx];
    const coords: [number, number][] = [];
    for (let r = vm.rStart; r <= vm.rEnd; r++) {
      addCoord(r, vm.cStart);
      coords.push([r, vm.cStart]);
    }

    const len = vm.rEnd - vm.rStart + 1;
    const [specR, specC] = getSpecialPosition(coords);

    if (len >= 5) {
      // 5 in a row -> Color Bomb!
      specialsToCreate.push({
        row: specR,
        col: specC,
        type: 'color_bomb',
        color: vm.color,
      });
    } else if (len === 4) {
      // 4 vertical -> Horizontal striped candy (clears row)
      specialsToCreate.push({
        row: specR,
        col: specC,
        type: 'striped_h',
        color: vm.color,
      });
    }
  }

  const matchedCoords: [number, number][] = Array.from(matchedSet).map((str) => {
    const [r, c] = str.split(',').map(Number);
    return [r, c];
  });

  return {
    matchedCoords,
    specialsToCreate,
  };
}

/**
 * Handle direct swapping of two special candies (Striped + Striped, Color Bomb + Anything, etc.)
 */
export function handleSpecialCombo(
  tile1: Tile,
  tile2: Tile,
  board: Tile[][]
): {
  tilesToClear: Set<string>;
  comboType: string;
  specialsToSpawn?: { row: number; col: number; type: SpecialType; color: CandyColor }[];
} | null {
  const c1 = tile1.candy;
  const c2 = tile2.candy;
  if (!c1 || !c2) return null;

  const rows = board.length;
  const cols = board[0].length;
  const tilesToClear = new Set<string>();

  const isSpecial1 = c1.special !== 'normal';
  const isSpecial2 = c2.special !== 'normal';

  // Double Color Bomb combo: wipe the entire board!
  if (c1.special === 'color_bomb' && c2.special === 'color_bomb') {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tilesToClear.add(`${r},${c}`);
      }
    }
    return {
      tilesToClear,
      comboType: 'ULTIMATE_APOCALYPSE',
    };
  }

  // Color Bomb + Striped Candy: Turns all candies of that color into Striped Candies, then detonates all of them!
  if (
    (c1.special === 'color_bomb' && (c2.special === 'striped_h' || c2.special === 'striped_v')) ||
    (c2.special === 'color_bomb' && (c1.special === 'striped_h' || c1.special === 'striped_v'))
  ) {
    const targetColor = c1.special === 'color_bomb' ? c2.color : c1.color;
    tilesToClear.add(`${tile1.row},${tile1.col}`);
    tilesToClear.add(`${tile2.row},${tile2.col}`);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candy = board[r][c].candy;
        if (candy && candy.color === targetColor) {
          // Clears either row or col for each matching candy
          tilesToClear.add(`${r},${c}`);
          const isH = Math.random() > 0.5;
          if (isH) {
            for (let cc = 0; cc < cols; cc++) tilesToClear.add(`${r},${cc}`);
          } else {
            for (let rr = 0; rr < rows; rr++) tilesToClear.add(`${rr},${c}`);
          }
        }
      }
    }
    return {
      tilesToClear,
      comboType: 'RAINBOW_STRIPE_STORM',
    };
  }

  // Color Bomb + Wrapped Candy: Clears all of that color, plus surrounding tiles
  if (
    (c1.special === 'color_bomb' && c2.special === 'wrapped') ||
    (c2.special === 'color_bomb' && c1.special === 'wrapped')
  ) {
    const targetColor = c1.special === 'color_bomb' ? c2.color : c1.color;
    tilesToClear.add(`${tile1.row},${tile1.col}`);
    tilesToClear.add(`${tile2.row},${tile2.col}`);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candy = board[r][c].candy;
        if (candy && candy.color === targetColor) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                tilesToClear.add(`${nr},${nc}`);
              }
            }
          }
        }
      }
    }
    return {
      tilesToClear,
      comboType: 'RAINBOW_WRAPPED_BLAST',
    };
  }

  // Color Bomb + Normal Candy: Zaps all candies of that color
  if (c1.special === 'color_bomb' || c2.special === 'color_bomb') {
    const targetColor = c1.special === 'color_bomb' ? c2.color : c1.color;
    tilesToClear.add(`${tile1.row},${tile1.col}`);
    tilesToClear.add(`${tile2.row},${tile2.col}`);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const candy = board[r][c].candy;
        if (candy && candy.color === targetColor) {
          tilesToClear.add(`${r},${c}`);
        }
      }
    }
    return {
      tilesToClear,
      comboType: 'COLOR_BOMB_ZAP',
    };
  }

  // Striped + Wrapped: Giant 3-Row & 3-Column Super Laser Beam!
  if (
    ((c1.special === 'striped_h' || c1.special === 'striped_v') && c2.special === 'wrapped') ||
    ((c2.special === 'striped_h' || c2.special === 'striped_v') && c1.special === 'wrapped')
  ) {
    const centerR = tile2.row;
    const centerC = tile2.col;

    // 3 rows across
    for (let dr = -1; dr <= 1; dr++) {
      const r = centerR + dr;
      if (r >= 0 && r < rows) {
        for (let c = 0; c < cols; c++) tilesToClear.add(`${r},${c}`);
      }
    }
    // 3 columns down
    for (let dc = -1; dc <= 1; dc++) {
      const c = centerC + dc;
      if (c >= 0 && c < cols) {
        for (let r = 0; r < rows; r++) tilesToClear.add(`${r},${c}`);
      }
    }

    return {
      tilesToClear,
      comboType: 'MEGA_STRIPE_BEAM',
    };
  }

  // Striped + Striped: Clears 1 full row AND 1 full col
  if (
    (c1.special === 'striped_h' || c1.special === 'striped_v') &&
    (c2.special === 'striped_h' || c2.special === 'striped_v')
  ) {
    for (let c = 0; c < cols; c++) tilesToClear.add(`${tile2.row},${c}`);
    for (let r = 0; r < rows; r++) tilesToClear.add(`${r},${tile2.col}`);

    return {
      tilesToClear,
      comboType: 'CROSS_STRIPE_BLAST',
    };
  }

  // Wrapped + Wrapped: Giant 5x5 explosion
  if (c1.special === 'wrapped' && c2.special === 'wrapped') {
    const centerR = tile2.row;
    const centerC = tile2.col;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const nr = centerR + dr;
        const nc = centerC + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          tilesToClear.add(`${nr},${nc}`);
        }
      }
    }
    return {
      tilesToClear,
      comboType: 'MEGA_WRAPPED_SUPERNOVA',
    };
  }

  // Not a special combo
  if (!isSpecial1 && !isSpecial2) return null;

  return null;
}

/**
 * Expand special candy detonations (striped beams, wrapped blast, etc.) recursively
 */
export function expandExplosions(
  initialCoords: [number, number][],
  board: Tile[][]
): Set<string> {
  const rows = board.length;
  const cols = board[0].length;
  const destroyed = new Set<string>();
  const queue: [number, number][] = [...initialCoords];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (destroyed.has(key)) continue;
    destroyed.add(key);

    const tile = board[r]?.[c];
    if (!tile || !tile.candy) continue;

    const special = tile.candy.special;

    if (special === 'striped_h') {
      // Clears row r
      for (let cc = 0; cc < cols; cc++) {
        if (!destroyed.has(`${r},${cc}`)) {
          queue.push([r, cc]);
        }
      }
    } else if (special === 'striped_v') {
      // Clears col c
      for (let rr = 0; rr < rows; rr++) {
        if (!destroyed.has(`${rr},${c}`)) {
          queue.push([rr, c]);
        }
      }
    } else if (special === 'wrapped') {
      // 3x3 blast
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (!destroyed.has(`${nr},${nc}`)) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return destroyed;
}

/**
 * Drops candies down and fills top slots with new candies
 */
export function applyGravityAndRefill(
  board: Tile[][],
  level: LevelConfig,
  currentIngredientsCount: number
): { board: Tile[][]; newCandiesCount: number; ingredientsDelivered: number } {
  const rows = board.length;
  const cols = board[0].length;
  let newCandiesCount = 0;
  let ingredientsDelivered = 0;

  // 1. Check for ingredients that have reached the bottom row
  for (let c = 0; c < cols; c++) {
    const bottomTile = board[rows - 1][c];
    if (bottomTile.candy && bottomTile.candy.isIngredient) {
      ingredientsDelivered++;
      bottomTile.candy = null;
    }
  }

  // 2. Drop candies column by column
  for (let c = 0; c < cols; c++) {
    // Collect all candies in column from bottom to top
    const candiesInCol: Candy[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      // Chocolate or solid blocks stay in place
      if (board[r][c].chocolate) continue;

      if (board[r][c].candy) {
        candiesInCol.push(board[r][c].candy!);
        board[r][c].candy = null;
      }
    }

    // Place collected candies back from bottom up into non-chocolate slots
    let candyIdx = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c].chocolate) continue;

      if (candyIdx < candiesInCol.length) {
        board[r][c].candy = candiesInCol[candyIdx];
        candyIdx++;
      } else {
        // Spawn a new candy
        let isIngredient = false;
        if (
          level.targetIngredients &&
          currentIngredientsCount < (level.initialIngredientsCount || 0) &&
          level.ingredientSpawnCols?.includes(c) &&
          Math.random() < 0.2
        ) {
          isIngredient = true;
          currentIngredientsCount++;
        }

        board[r][c].candy = {
          id: generateRandomId(),
          color: getRandomColor(level.colors),
          special: 'normal',
          isIngredient: isIngredient ? level.targetIngredients?.type || 'cherry' : undefined,
        };
        newCandiesCount++;
      }
    }
  }

  return { board, newCandiesCount, ingredientsDelivered };
}

/**
 * Handle chocolate spreading if no chocolate was cleared this turn
 */
export function spreadChocolate(board: Tile[][]): boolean {
  const rows = board.length;
  const cols = board[0].length;

  // Find all chocolate tiles
  const chocoTiles: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].chocolate) {
        chocoTiles.push([r, c]);
      }
    }
  }

  if (chocoTiles.length === 0) return false;

  // Shuffle chocolate tiles and find an adjacent candy tile to contaminate
  const shuffled = [...chocoTiles].sort(() => Math.random() - 0.5);
  for (const [r, c] of shuffled) {
    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of neighbors) {
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        !board[nr][nc].chocolate &&
        board[nr][nc].frosting === 0 &&
        board[nr][nc].candy &&
        !board[nr][nc].candy?.isIngredient
      ) {
        // Chocolate consumes this candy!
        board[nr][nc].chocolate = true;
        board[nr][nc].candy = null;
        return true;
      }
    }
  }

  return false;
}

/**
 * Finds a valid potential move to provide player hints
 */
export function findPotentialMove(
  board: Tile[][],
  colors: CandyColor[]
): [Tile, Tile] | null {
  const rows = board.length;
  const cols = board[0].length;

  // Try horizontal swaps
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const t1 = board[r][c];
      const t2 = board[r][c + 1];

      if (!t1.candy || !t2.candy || t1.chocolate || t2.chocolate) continue;

      // Special combos are always valid moves!
      if (t1.candy.special !== 'normal' && t2.candy.special !== 'normal') {
        return [t1, t2];
      }
      if (t1.candy.special === 'color_bomb' || t2.candy.special === 'color_bomb') {
        return [t1, t2];
      }

      // Test swap
      const testBoard = cloneBoard(board);
      const temp = testBoard[r][c].candy;
      testBoard[r][c].candy = testBoard[r][c + 1].candy;
      testBoard[r][c + 1].candy = temp;

      const matches = findMatches(testBoard);
      if (matches.matchedCoords.length > 0) {
        return [t1, t2];
      }
    }
  }

  // Try vertical swaps
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 1; r++) {
      const t1 = board[r][c];
      const t2 = board[r + 1][c];

      if (!t1.candy || !t2.candy || t1.chocolate || t2.chocolate) continue;

      if (t1.candy.special !== 'normal' && t2.candy.special !== 'normal') {
        return [t1, t2];
      }
      if (t1.candy.special === 'color_bomb' || t2.candy.special === 'color_bomb') {
        return [t1, t2];
      }

      // Test swap
      const testBoard = cloneBoard(board);
      const temp = testBoard[r][c].candy;
      testBoard[r][c].candy = testBoard[r + 1][c].candy;
      testBoard[r + 1][c].candy = temp;

      const matches = findMatches(testBoard);
      if (matches.matchedCoords.length > 0) {
        return [t1, t2];
      }
    }
  }

  return null;
}

/**
 * Reshuffle existing candies on the board when no valid moves are possible
 */
export function reshuffleBoard(board: Tile[][], colors: CandyColor[]) {
  const rows = board.length;
  const cols = board[0].length;

  const candies: Candy[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].candy && !board[r][c].candy?.isIngredient) {
        candies.push(board[r][c].candy!);
      }
    }
  }

  // Shuffle until a valid move exists
  let attempts = 0;
  while (attempts < 50) {
    attempts++;
    candies.sort(() => Math.random() - 0.5);

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].candy && !board[r][c].candy?.isIngredient && idx < candies.length) {
          board[r][c].candy = candies[idx];
          idx++;
        }
      }
    }

    // Verify no initial matches exist AND at least one move exists
    const matches = findMatches(board);
    if (matches.matchedCoords.length === 0 && findPotentialMove(board, colors)) {
      break;
    }
  }
}
