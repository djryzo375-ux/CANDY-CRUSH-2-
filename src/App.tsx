/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoosterState,
  BoosterType,
  ComboBanner,
  DailyRewardState,
  DailyTask,
  DeviceRam,
  GameStats,
  LevelConfig,
  PlayerProfile,
  ScorePopup,
  ShopPackage,
  Tile,
  UserSettings,
  LuckyWheelReward,
  LuckyWheelState,
} from './types/candy';
import { SAGA_LEVELS, ENDLESS_LEVEL } from './data/levels';
import {
  applyGravityAndRefill,
  cloneBoard,
  createBoard,
  expandExplosions,
  findMatches,
  findPotentialMove,
  generateRandomId,
  handleSpecialCombo,
  reshuffleBoard,
  spreadChocolate,
} from './utils/candyEngine';
import { sound } from './audio/sound';
import { haptics } from './utils/haptics';
import { GameHeader } from './components/GameHeader';
import { Board } from './components/Board';
import { BoosterBar } from './components/BoosterBar';
import { SagaMapModal } from './components/SagaMapModal';
import { WinLoseModal } from './components/WinLoseModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { StartScreen } from './components/StartScreen';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { DailyTasksModal } from './components/DailyTasksModal';
import { ProfileModal } from './components/ProfileModal';
import { NextUpdateModal } from './components/NextUpdateModal';
import { EndlessMapModal } from './components/EndlessMapModal';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { HelpCircle } from 'lucide-react';

const STORAGE_KEY_UNLOCKED = 'candy_crush_2_unlocked';
const STORAGE_KEY_SCORES = 'candy_crush_2_scores';
const STORAGE_KEY_BOOSTERS = 'candy_crush_2_boosters';
const STORAGE_KEY_SETTINGS = 'candy_crush_2_settings';
const STORAGE_KEY_GOLD = 'candy_crush_2_gold';
const STORAGE_KEY_VIP = 'candy_crush_2_vip';
const STORAGE_KEY_DAILY_REWARD = 'candy_crush_2_daily_reward';
const STORAGE_KEY_DAILY_TASKS = 'candy_crush_2_daily_tasks';
const STORAGE_KEY_PROFILE = 'candy_crush_2_profile';
const STORAGE_KEY_PURCHASED_PKGS = 'candy_crush_2_purchased_packages';
const STORAGE_KEY_LUCKY_WHEEL = 'candy_crush_2_lucky_wheel';

const INITIAL_TASKS: DailyTask[] = [
  { id: 'task_1', title: 'Match 40 Candies', description: 'Make sweet matches on any board', current: 0, target: 40, rewardGold: 300, completed: false, claimed: false, icon: '🍬' },
  { id: 'task_2', title: 'Create 3 Striped Rockets', description: 'Match 4 candies in a line', current: 0, target: 3, rewardGold: 400, completed: false, claimed: false, icon: '🚀' },
  { id: 'task_3', title: 'Clear 15 Jelly Tiles', description: 'Bust frosted jellies under candies', current: 0, target: 15, rewardGold: 450, completed: false, claimed: false, icon: '🧊' },
  { id: 'task_4', title: 'Shatter 10 Frosting Bricks', description: 'Break crispy sugar biscuit barriers', current: 0, target: 10, rewardGold: 500, completed: false, claimed: false, icon: '🧇' },
  { id: 'task_5', title: 'Spawn a Color Bomb', description: 'Align 5 candies in a single row or col', current: 0, target: 1, rewardGold: 600, completed: false, claimed: false, icon: '💣' },
  { id: 'task_6', title: 'Achieve 3 Stars on Any Level', description: 'Get maximum rating in a single stage', current: 0, target: 1, rewardGold: 750, completed: false, claimed: false, icon: '⭐' },
];

export default function App() {
  // Navigation: Starts on StartScreen as requested by user
  const [inStartScreen, setInStartScreen] = useState(true);

  // Settings & Performance specs
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const navMem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
    const detectedRam = ([1, 2, 3, 4, 6, 8, 16, 32].includes(navMem) ? navMem : 4) as DeviceRam;
    return {
      soundEnabled: true,
      musicEnabled: false,
      voiceChimes: true,
      soundVolume: 0.8,
      musicVolume: 0.5,
      deviceRam: detectedRam,
      graphicsPreset: detectedRam <= 2 ? 'very_low' : detectedRam <= 4 ? 'medium' : 'very_high',
      vibrationEnabled: true,
    };
  });

  // Saved Progress & Shop Economy
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_UNLOCKED);
    return saved ? Math.max(1, parseInt(saved, 10)) : 1;
  });

  const [levelScores, setLevelScores] = useState<Record<number, { score: number; stars: number }>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SCORES);
    return saved ? JSON.parse(saved) : {};
  });

  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GOLD);
    return saved ? parseInt(saved, 10) : 1000;
  });

  const [hasVipPass, setHasVipPass] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VIP);
    return saved === 'true';
  });

  const [boosters, setBoosters] = useState<BoosterState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOSTERS);
    return saved
      ? JSON.parse(saved)
      : {
          hammer: 5,
          switch: 5,
          bomb: 3,
          shuffle: 5,
        };
  });

  // Track purchased one-time packages (defaults to pkg_100 already purchased as requested)
  const [purchasedPackageIds, setPurchasedPackageIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PURCHASED_PKGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return ['pkg_100'];
  });

  // Daily Reward System (Tracking date for first login of the day popup)
  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyReward, setDailyReward] = useState<DailyRewardState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DAILY_REWARD);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasClaimed = parsed.lastClaimDate === todayStr;
        return {
          ...parsed,
          hasClaimedToday: hasClaimed,
        };
      } catch (e) {}
    }
    return {
      lastClaimDate: '',
      streak: 1,
      hasClaimedToday: false,
    };
  });

  // Daily Lucky Wheel (Spin once daily on first login)
  const [luckyWheel, setLuckyWheel] = useState<LuckyWheelState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LUCKY_WHEEL);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasSpun = parsed.lastSpinDate === todayStr;
        return {
          ...parsed,
          hasSpunToday: hasSpun,
        };
      } catch (e) {}
    }
    return {
      lastSpinDate: '',
      hasSpunToday: false,
    };
  });

  // Daily Tasks (English only)
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DAILY_TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  // Player Profile & Anti-Cheat Fair Play Bio
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      playerId: 'CC2-8605-PHONK-777',
      username: 'SugarMaster',
      bio: 'Sweet Confectionery Crusher 🍬 | Match-3 Legend',
      avatar: '👑',
      isBanned: false,
      antiCheatStatus: 'Clean & Verified',
      fairPlayAcknowledged: true,
    };
  });

  // Current Level & Game State
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(() => SAGA_LEVELS[0]);
  const [board, setBoard] = useState<Tile[][]>(() => createBoard(SAGA_LEVELS[0]));
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [activeBooster, setActiveBooster] = useState<BoosterType | null>(null);
  const [switchFirstTile, setSwitchFirstTile] = useState<Tile | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    movesRemaining: SAGA_LEVELS[0].maxMoves,
    jellyCleared: 0,
    totalJelly: SAGA_LEVELS[0].initialJellyTiles?.length || 0,
    frostingCleared: 0,
    totalFrosting: SAGA_LEVELS[0].initialFrostingTiles?.length || 0,
    ingredientsDelivered: 0,
    totalIngredients: SAGA_LEVELS[0].initialIngredientsCount || 0,
    stars: 0,
    combosCount: 0,
  });

  // Modals & Overlays
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(() => !dailyReward.hasClaimedToday);
  const [showLuckyWheel, setShowLuckyWheel] = useState(() => dailyReward.hasClaimedToday && !luckyWheel.hasSpunToday);
  const [showDailyTasks, setShowDailyTasks] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNextUpdate, setShowNextUpdate] = useState(false);
  const [showEndlessMap, setShowEndlessMap] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

  // FX & Animation States
  const [hintTiles, setHintTiles] = useState<[Tile, Tile] | null>(null);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [comboBanner, setComboBanner] = useState<ComboBanner | null>(null);
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [isBoardShaking, setIsBoardShaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const idleTimerRef = useRef<number | null>(null);
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const boardRef = useRef(board);
  boardRef.current = board;

  // Sync settings with audio system
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    sound.setVolume(settings.soundVolume);
    sound.toggleMusic(settings.musicEnabled);
    haptics.setEnabled(settings.vibrationEnabled !== false);
  }, [settings.soundEnabled, settings.soundVolume, settings.musicEnabled, settings.vibrationEnabled]);

  // Save changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UNLOCKED, unlockedLevel.toString());
  }, [unlockedLevel]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(levelScores));
  }, [levelScores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOSTERS, JSON.stringify(boosters));
  }, [boosters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GOLD, gold.toString());
  }, [gold]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VIP, hasVipPass ? 'true' : 'false');
  }, [hasVipPass]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DAILY_REWARD, JSON.stringify(dailyReward));
  }, [dailyReward]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DAILY_TASKS, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PURCHASED_PKGS, JSON.stringify(purchasedPackageIds));
  }, [purchasedPackageIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LUCKY_WHEEL, JSON.stringify(luckyWheel));
  }, [luckyWheel]);

  // Calculate total stars
  const totalStars = Object.values(levelScores).reduce((acc, curr) => acc + (curr.stars || 0), 0);

  // Daily Tasks unclaimed count
  const dailyTasksUnclaimedCount = dailyTasks.filter((t) => t.completed && !t.claimed).length;

  // Helper to increment daily task progress
  const updateTaskProgress = useCallback((taskId: string, increment: number) => {
    setDailyTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextCurrent = Math.min(task.target, task.current + increment);
        const isNowCompleted = nextCurrent >= task.target;
        return {
          ...task,
          current: nextCurrent,
          completed: isNowCompleted || task.completed,
        };
      })
    );
  }, []);

  // Claim Daily Reward Handler
  const handleClaimDailyReward = (day: number, rewardGold: number) => {
    setGold((prev) => prev + rewardGold);
    setDailyReward((prev) => ({
      ...prev,
      lastClaimDate: todayStr,
      streak: prev.streak >= 7 ? 1 : prev.streak + 1,
      hasClaimedToday: true,
    }));
    setTimeout(() => {
      setShowDailyReward(false);
      if (!luckyWheel.hasSpunToday) {
        setShowLuckyWheel(true);
      }
    }, 1200);
  };

  const handleCloseDailyReward = () => {
    setShowDailyReward(false);
    if (!luckyWheel.hasSpunToday) {
      setShowLuckyWheel(true);
    }
  };

  // Claim Lucky Wheel Reward Handler (Daily Spin)
  const handleClaimLuckyWheelReward = (reward: LuckyWheelReward) => {
    if (reward.gold > 0) {
      setGold((prev) => prev + reward.gold);
    }
    if (reward.hammers > 0 || reward.switches > 0 || reward.bombs > 0 || reward.shuffles > 0) {
      setBoosters((prev) => ({
        hammer: prev.hammer + reward.hammers,
        switch: prev.switch + reward.switches,
        bomb: prev.bomb + reward.bombs,
        shuffle: prev.shuffle + reward.shuffles,
      }));
    }
    setLuckyWheel({
      lastSpinDate: todayStr,
      hasSpunToday: true,
    });
  };

  // Claim Daily Task Handler
  const handleClaimDailyTask = (taskId: string, rewardGold: number) => {
    setGold((prev) => prev + rewardGold);
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, claimed: true } : t))
    );
  };

  // Update Profile Handler
  const handleUpdateProfile = (newProfile: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  // Shake trigger respected by graphics preset
  const triggerShake = useCallback(() => {
    if (settings.graphicsPreset === 'very_low' || settings.graphicsPreset === 'low') {
      return;
    }
    setIsBoardShaking(true);
    setTimeout(() => setIsBoardShaking(false), 450);
  }, [settings.graphicsPreset]);

  // Spawn Score Popup
  const addScorePopup = useCallback((x: number, y: number, text: string, color?: string) => {
    const id = generateRandomId();
    setScorePopups((prev) => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  }, []);

  // Show Sweet Combo Voice & Banner
  const showComboAlert = useCallback((comboCount: number) => {
    let title = 'SWEET!';
    let subtitle = 'Great Match!';
    let color = 'from-amber-400 to-pink-500';
    let voice: 'sweet' | 'tasty' | 'delicious' | 'divine' = 'sweet';

    if (comboCount === 2) {
      title = 'SWEET!';
      subtitle = 'Super cascade!';
      color = 'from-yellow-400 to-orange-500';
      voice = 'sweet';
    } else if (comboCount === 3) {
      title = 'TASTY!';
      subtitle = 'Triple Cascade!';
      color = 'from-emerald-400 to-teal-500';
      voice = 'tasty';
    } else if (comboCount === 4) {
      title = 'DELICIOUS!';
      subtitle = 'Incredible explosion!';
      color = 'from-pink-500 to-rose-600';
      voice = 'delicious';
    } else if (comboCount >= 5) {
      title = 'DIVINE!';
      subtitle = 'Unstoppable Sugar Rush!';
      color = 'from-purple-500 via-pink-500 to-amber-400';
      voice = 'divine';
    }

    if (settings.voiceChimes) {
      sound.playVoice(voice);
    }
    setComboBanner({ id: generateRandomId(), title, subtitle, color });
    setTimeout(() => {
      setComboBanner(null);
    }, 1400);
  }, [settings.voiceChimes]);

  // Level Initializer
  const initLevel = useCallback((lvl: LevelConfig) => {
    setCurrentLevel(lvl);
    const newBoard = createBoard(lvl);
    setBoard(newBoard);
    setSelectedTile(null);
    setActiveBooster(null);
    setSwitchFirstTile(null);
    setHintTiles(null);
    setGameResult(null);

    setStats({
      score: 0,
      movesRemaining: lvl.maxMoves,
      jellyCleared: 0,
      totalJelly: lvl.initialJellyTiles?.length || 0,
      frostingCleared: 0,
      totalFrosting: lvl.initialFrostingTiles?.length || 0,
      ingredientsDelivered: 0,
      totalIngredients: lvl.initialIngredientsCount || 0,
      stars: 0,
      combosCount: 0,
    });
  }, []);

  // Update Settings handler
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Purchase Success handler (Supports One-Time Payment Lifetime VIP Pass)
  const handlePurchaseSuccess = (pkg: ShopPackage) => {
    setGold((prev) => prev + pkg.goldBars);
    setBoosters((prev) => ({
      hammer: prev.hammer + pkg.hammers,
      switch: prev.switch + pkg.switches,
      bomb: prev.bomb + pkg.bombs,
      shuffle: prev.shuffle + pkg.shuffles,
    }));
    if (pkg.hasPass || pkg.isOneTimeLifetime) {
      setHasVipPass(true);
    }
    // Track one-time purchase
    setPurchasedPackageIds((prev) => (prev.includes(pkg.id) ? prev : [...prev, pkg.id]));
  };

  // Check victory / defeat conditions
  const checkWinLose = useCallback(() => {
    const curStats = statsRef.current;

    const jellyGoalMet = curStats.totalJelly === 0 || curStats.jellyCleared >= curStats.totalJelly;
    const frostingGoalMet = curStats.totalFrosting === 0 || curStats.frostingCleared >= curStats.totalFrosting;
    const ingredientsGoalMet = curStats.totalIngredients === 0 || curStats.ingredientsDelivered >= curStats.totalIngredients;
    const scoreGoalMet = curStats.score >= currentLevel.targetScore;

    // Victory!
    if (jellyGoalMet && frostingGoalMet && ingredientsGoalMet && scoreGoalMet) {
      if (currentLevel.id !== 99) {
        sound.playWin();
        haptics.win();
        // Unlock next level (up to 50 levels and beyond on endless map)
        if (currentLevel.id >= unlockedLevel) {
          setUnlockedLevel(currentLevel.id + 1);
        }
        // Save stars and score
        setLevelScores((prev) => ({
          ...prev,
          [currentLevel.id]: {
            score: Math.max(prev[currentLevel.id]?.score || 0, curStats.score),
            stars: Math.max(prev[currentLevel.id]?.stars || 0, curStats.stars),
          },
        }));

        // Update 3-Star task if achieved
        if (curStats.stars >= 3) {
          updateTaskProgress('task_6', 1);
        }

        setGameResult('win');
      }
      return true;
    }

    // Defeat (out of moves)
    if (curStats.movesRemaining <= 0 && currentLevel.id !== 99) {
      sound.playLose();
      setGameResult('lose');
      return true;
    }

    return false;
  }, [currentLevel, unlockedLevel, updateTaskProgress]);

  // Cascade Engine
  const runCascadeCycle = useCallback(
    async (currentBoard: Tile[][], cascadeStep = 1): Promise<Tile[][]> => {
      let workingBoard = cloneBoard(currentBoard);

      // 1. Find all matches
      const { matchedCoords, specialsToCreate } = findMatches(workingBoard);

      if (matchedCoords.length === 0) {
        // No more matches. Check if chocolate needs to grow
        const didSpread = spreadChocolate(workingBoard);
        if (didSpread) {
          sound.playChocolate();
        }

        // Check if there are valid moves remaining
        const potential = findPotentialMove(workingBoard, currentLevel.colors);
        if (!potential) {
          // Shuffle board if no moves available!
          setIsReshuffling(true);
          sound.playShuffle();
          reshuffleBoard(workingBoard, currentLevel.colors);
          setTimeout(() => setIsReshuffling(false), 900);
        }

        return workingBoard;
      }

      // 2. Clear matches and calculate score
      sound.playMatch(cascadeStep);
      const stepPoints = matchedCoords.length * 60 * cascadeStep;

      // Update Daily Task 1: Matches made
      updateTaskProgress('task_1', matchedCoords.length);

      const centerCoord = matchedCoords[Math.floor(matchedCoords.length / 2)];
      addScorePopup(centerCoord[1], centerCoord[0], `+${stepPoints}`);

      // Show Combo Banners for big cascades
      if (cascadeStep >= 2) {
        showComboAlert(cascadeStep);
        triggerShake();
      }

      // Detect special candy clears for tactile vibration feedback
      let hasColorBomb = false;
      let hasWrapped = false;
      let hasStriped = false;

      matchedCoords.forEach(([r, c]) => {
        const spec = workingBoard[r]?.[c]?.candy?.special;
        if (spec === 'color_bomb') hasColorBomb = true;
        else if (spec === 'wrapped') hasWrapped = true;
        else if (spec === 'striped_h' || spec === 'striped_v') hasStriped = true;
      });

      // 3. Shatter and clear tiles
      const destroyedKeys = expandExplosions(matchedCoords, workingBoard);
      let jelliesCleared = 0;
      let frostingsCleared = 0;

      destroyedKeys.forEach((key) => {
        const [r, c] = key.split(',').map(Number);
        const tile = workingBoard[r]?.[c];
        if (!tile) return;

        const spec = tile.candy?.special;
        if (spec === 'color_bomb') hasColorBomb = true;
        else if (spec === 'wrapped') hasWrapped = true;
        else if (spec === 'striped_h' || spec === 'striped_v') hasStriped = true;

        if (tile.chocolate) {
          tile.chocolate = false;
        }
        if (tile.frosting > 0) {
          tile.frosting--;
          frostingsCleared++;
        }
        if (tile.jelly > 0) {
          tile.jelly--;
          jelliesCleared++;
        }
        tile.candy = null;
      });

      // Haptic Vibration feedback: distinct tactile pulse based on match/special type
      if (hasColorBomb) {
        haptics.clearSpecial('color_bomb');
      } else if (hasWrapped) {
        haptics.clearSpecial('wrapped');
      } else if (hasStriped) {
        haptics.clearSpecial('striped');
      } else {
        haptics.match(cascadeStep);
      }

      // Update Daily Tasks: Jelly & Frosting
      if (jelliesCleared > 0) updateTaskProgress('task_3', jelliesCleared);
      if (frostingsCleared > 0) updateTaskProgress('task_4', frostingsCleared);

      // Spawn created specials
      specialsToCreate.forEach((spec) => {
        workingBoard[spec.row][spec.col].candy = {
          id: generateRandomId(),
          color: spec.color,
          special: spec.type,
        };
        sound.playSpecialCreate(spec.type);
        haptics.createSpecial(spec.type);

        if (spec.type === 'striped_h' || spec.type === 'striped_v') {
          updateTaskProgress('task_2', 1);
        }
        if (spec.type === 'color_bomb') {
          updateTaskProgress('task_5', 1);
        }
      });

      // 4. Update Game Stats
      setStats((prev) => {
        const newScore = prev.score + stepPoints;
        let earnedStars = 0;
        if (newScore >= currentLevel.starScores[2]) earnedStars = 3;
        else if (newScore >= currentLevel.starScores[1]) earnedStars = 2;
        else if (newScore >= currentLevel.starScores[0]) earnedStars = 1;

        return {
          ...prev,
          score: newScore,
          jellyCleared: prev.jellyCleared + jelliesCleared,
          frostingCleared: prev.frostingCleared + frostingsCleared,
          stars: earnedStars,
          combosCount: prev.combosCount + 1,
        };
      });

      setBoard(cloneBoard(workingBoard));
      await new Promise((resolve) => setTimeout(resolve, 260));

      // 5. Gravity and Refill
      const ingCount = statsRef.current.totalIngredients - statsRef.current.ingredientsDelivered;
      const gravityResult = applyGravityAndRefill(workingBoard, currentLevel, ingCount);
      workingBoard = gravityResult.board;

      if (gravityResult.ingredientsDelivered > 0) {
        sound.playSpecialCreate('color_bomb');
        setStats((prev) => ({
          ...prev,
          ingredientsDelivered: prev.ingredientsDelivered + gravityResult.ingredientsDelivered,
          score: prev.score + gravityResult.ingredientsDelivered * 2500,
        }));
      }

      setBoard(cloneBoard(workingBoard));
      await new Promise((resolve) => setTimeout(resolve, 240));

      // Recurse for chain cascades
      return runCascadeCycle(workingBoard, cascadeStep + 1);
    },
    [addScorePopup, currentLevel, showComboAlert, triggerShake, updateTaskProgress]
  );

  // User Swaps Two Candies
  const handleSwap = useCallback(
    async (t1: Tile, t2: Tile) => {
      if (isProcessing || gameResult) return;
      setHintTiles(null);
      setIsProcessing(true);

      const isAdjacent = Math.abs(t1.row - t2.row) + Math.abs(t1.col - t2.col) === 1;
      if (!isAdjacent) {
        setIsProcessing(false);
        return;
      }

      sound.playSwap();
      haptics.swap();

      // Check special candy combos
      const comboResult = handleSpecialCombo(t1, t2, board);
      if (comboResult) {
        triggerShake();
        sound.playComboBlast();
        haptics.clearSpecial('combo');
        let nextBoard = cloneBoard(board);
        let jelliesCleared = 0;
        let frostingsCleared = 0;

        comboResult.tilesToClear.forEach((key) => {
          const [r, c] = key.split(',').map(Number);
          const tile = nextBoard[r]?.[c];
          if (!tile) return;
          if (tile.chocolate) tile.chocolate = false;
          if (tile.frosting > 0) {
            tile.frosting--;
            frostingsCleared++;
          }
          if (tile.jelly > 0) {
            tile.jelly--;
            jelliesCleared++;
          }
          tile.candy = null;
        });

        const comboPts = comboResult.tilesToClear.size * 100;

        if (jelliesCleared > 0) updateTaskProgress('task_3', jelliesCleared);
        if (frostingsCleared > 0) updateTaskProgress('task_4', frostingsCleared);

        setStats((prev) => ({
          ...prev,
          movesRemaining: Math.max(0, prev.movesRemaining - 1),
          score: prev.score + comboPts,
          jellyCleared: prev.jellyCleared + jelliesCleared,
          frostingCleared: prev.frostingCleared + frostingsCleared,
        }));

        setBoard(nextBoard);
        await new Promise((resolve) => setTimeout(resolve, 350));

        const ingCount = statsRef.current.totalIngredients - statsRef.current.ingredientsDelivered;
        const gravityResult = applyGravityAndRefill(nextBoard, currentLevel, ingCount);
        nextBoard = gravityResult.board;
        setBoard(nextBoard);
        await new Promise((resolve) => setTimeout(resolve, 250));

        await runCascadeCycle(nextBoard, 2);
        checkWinLose();
        setIsProcessing(false);
        return;
      }

      // Standard Match Swap
      let testBoard = cloneBoard(board);
      const candy1 = testBoard[t1.row][t1.col].candy;
      const candy2 = testBoard[t2.row][t2.col].candy;

      testBoard[t1.row][t1.col].candy = candy2;
      testBoard[t2.row][t2.col].candy = candy1;

      const { matchedCoords } = findMatches(testBoard, {
        r1: t1.row,
        c1: t1.col,
        r2: t2.row,
        c2: t2.col,
      });

      if (matchedCoords.length === 0) {
        sound.playInvalid();
        haptics.invalid();
        setBoard(testBoard);
        await new Promise((resolve) => setTimeout(resolve, 200));

        testBoard = cloneBoard(testBoard);
        testBoard[t1.row][t1.col].candy = candy1;
        testBoard[t2.row][t2.col].candy = candy2;
        setBoard(testBoard);
        setIsProcessing(false);
        return;
      }

      // Valid Move! Spend move
      setStats((prev) => ({
        ...prev,
        movesRemaining: Math.max(0, prev.movesRemaining - 1),
      }));

      // Begin Cascade
      const finalBoard = await runCascadeCycle(testBoard, 1);
      setBoard(finalBoard);
      checkWinLose();
      setIsProcessing(false);
    },
    [board, checkWinLose, currentLevel, gameResult, isProcessing, runCascadeCycle, triggerShake, updateTaskProgress]
  );

  // User Tile Tap Handler
  const handleTileClick = useCallback(
    async (clickedTile: Tile) => {
      if (isProcessing || gameResult) return;

      // Booster Execution: Lollipop Hammer
      if (activeBooster === 'hammer') {
        sound.playHammer();
        triggerShake();
        haptics.booster();
        setActiveBooster(null);

        const newBoard = cloneBoard(board);
        const tile = newBoard[clickedTile.row][clickedTile.col];

        let points = 250;
        let jellies = 0;
        let frostings = 0;

        if (tile.chocolate) {
          tile.chocolate = false;
          points += 500;
        }
        if (tile.frosting > 0) {
          tile.frosting--;
          frostings++;
          points += 400;
        }
        if (tile.jelly > 0) {
          tile.jelly--;
          jellies++;
          points += 300;
        }
        tile.candy = null;

        if (jellies > 0) updateTaskProgress('task_3', jellies);
        if (frostings > 0) updateTaskProgress('task_4', frostings);

        setBoosters((prev) => ({ ...prev, hammer: Math.max(0, prev.hammer - 1) }));
        setStats((prev) => ({
          ...prev,
          score: prev.score + points,
          jellyCleared: prev.jellyCleared + jellies,
          frostingCleared: prev.frostingCleared + frostings,
        }));

        setBoard(newBoard);
        addScorePopup(clickedTile.col, clickedTile.row, `+${points}`, '#f59e0b');

        setIsProcessing(true);
        const ingCount = statsRef.current.totalIngredients - statsRef.current.ingredientsDelivered;
        const gravityResult = applyGravityAndRefill(newBoard, currentLevel, ingCount);
        setBoard(gravityResult.board);
        await new Promise((resolve) => setTimeout(resolve, 250));
        await runCascadeCycle(gravityResult.board, 1);
        checkWinLose();
        setIsProcessing(false);
        return;
      }

      // Booster Execution: Color Bomb Spawner
      if (activeBooster === 'bomb') {
        sound.playSpecialCreate('color_bomb');
        haptics.booster();
        setActiveBooster(null);

        const newBoard = cloneBoard(board);
        newBoard[clickedTile.row][clickedTile.col].candy = {
          id: generateRandomId(),
          color: 'yellow',
          special: 'color_bomb',
        };

        updateTaskProgress('task_5', 1);

        setBoosters((prev) => ({ ...prev, bomb: Math.max(0, prev.bomb - 1) }));
        setBoard(newBoard);
        return;
      }

      // Booster Execution: Free Switch (any two tiles anywhere)
      if (activeBooster === 'switch') {
        if (!switchFirstTile) {
          sound.playPop();
          setSwitchFirstTile(clickedTile);
          return;
        }

        // Second tile selected - perform free swap!
        sound.playSwap();
        haptics.booster();
        const newBoard = cloneBoard(board);
        const c1 = newBoard[switchFirstTile.row][switchFirstTile.col].candy;
        const c2 = newBoard[clickedTile.row][clickedTile.col].candy;

        newBoard[switchFirstTile.row][switchFirstTile.col].candy = c2;
        newBoard[clickedTile.row][clickedTile.col].candy = c1;

        setBoosters((prev) => ({ ...prev, switch: Math.max(0, prev.switch - 1) }));
        setActiveBooster(null);
        setSwitchFirstTile(null);
        setBoard(newBoard);

        setIsProcessing(true);
        await runCascadeCycle(newBoard, 1);
        checkWinLose();
        setIsProcessing(false);
        return;
      }

      // Standard Selection Click
      if (!selectedTile) {
        sound.playPop();
        setSelectedTile(clickedTile);
      } else {
        if (selectedTile.row === clickedTile.row && selectedTile.col === clickedTile.col) {
          setSelectedTile(null);
        } else {
          const prev = selectedTile;
          setSelectedTile(null);
          handleSwap(prev, clickedTile);
        }
      }
    },
    [
      activeBooster,
      addScorePopup,
      board,
      checkWinLose,
      currentLevel,
      gameResult,
      handleSwap,
      isProcessing,
      runCascadeCycle,
      selectedTile,
      switchFirstTile,
      triggerShake,
      updateTaskProgress,
    ]
  );

  // Booster Selection
  const handleSelectBooster = (type: BoosterType) => {
    sound.playPop();
    if (activeBooster === type) {
      setActiveBooster(null);
      setSwitchFirstTile(null);
      return;
    }

    if (type === 'shuffle') {
      if (boosters.shuffle <= 0) return;
      setBoosters((prev) => ({ ...prev, shuffle: Math.max(0, prev.shuffle - 1) }));
      setIsReshuffling(true);
      sound.playShuffle();
      haptics.booster();
      const nextBoard = cloneBoard(board);
      reshuffleBoard(nextBoard, currentLevel.colors);
      setBoard(nextBoard);
      setTimeout(() => {
        setIsReshuffling(false);
      }, 700);
      return;
    }

    if (boosters[type] > 0) {
      setActiveBooster(type);
      setSwitchFirstTile(null);
    }
  };

  // Smart Hint Finder
  const handleRequestHint = () => {
    sound.playPop();
    const move = findPotentialMove(board, currentLevel.colors);
    if (move) {
      sound.playHint();
      setHintTiles(move);
    }
  };

  // Extra moves on defeat
  const handleAddExtraMoves = () => {
    sound.playPop();
    setStats((prev) => ({ ...prev, movesRemaining: prev.movesRemaining + 5 }));
    setGameResult(null);
  };

  // Next level handler
  const handleNextLevel = () => {
    sound.playPop();
    const nextIdx = currentLevel.id; // Since IDs are 1-based, currentLevel.id is index of next level in SAGA_LEVELS
    if (nextIdx < SAGA_LEVELS.length) {
      initLevel(SAGA_LEVELS[nextIdx]);
    }
  };

  // Idle Hint Trigger
  useEffect(() => {
    if (isProcessing || gameResult || activeBooster || inStartScreen) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      return;
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = window.setTimeout(() => {
      const move = findPotentialMove(board, currentLevel.colors);
      if (move) {
        setHintTiles(move);
      }
    }, 7000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [board, isProcessing, gameResult, activeBooster, inStartScreen, currentLevel.colors]);

  // If in Start Screen, render the Start Screen
  if (inStartScreen) {
    return (
      <>
        <StartScreen
          unlockedLevel={unlockedLevel}
          totalStars={totalStars}
          gold={gold}
          hasVipPass={hasVipPass}
          settings={settings}
          profileUsername={profile.username}
          profileAvatar={profile.avatar}
          hasUnclaimedDailyReward={!dailyReward.hasClaimedToday}
          hasUnclaimedLuckyWheel={!luckyWheel.hasSpunToday}
          dailyTasksUnclaimedCount={dailyTasksUnclaimedCount}
          onPlay={() => {
            initLevel(SAGA_LEVELS[Math.min(unlockedLevel - 1, SAGA_LEVELS.length - 1)]);
            setInStartScreen(false);
          }}
          onOpenSettings={() => setShowSettings(true)}
          onOpenMap={() => setShowMap(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenGuide={() => setShowGuide(true)}
          onOpenDailyReward={() => setShowDailyReward(true)}
          onOpenLuckyWheel={() => setShowLuckyWheel(true)}
          onOpenDailyTasks={() => setShowDailyTasks(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenNextUpdate={() => setShowNextUpdate(true)}
          onOpenEndlessMap={() => setShowEndlessMap(true)}
        />

        {/* Global Modals accessible from start screen */}
        {showSettings && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showShop && (
          <ShopModal
            currentGold={gold}
            hasVipPass={hasVipPass}
            purchasedPackageIds={purchasedPackageIds}
            onPurchaseSuccess={handlePurchaseSuccess}
            onClose={() => setShowShop(false)}
          />
        )}

        {showDailyReward && (
          <DailyRewardModal
            rewardState={dailyReward}
            onClaim={handleClaimDailyReward}
            onClose={handleCloseDailyReward}
          />
        )}

        {showLuckyWheel && (
          <LuckyWheelModal
            wheelState={luckyWheel}
            onClaimReward={handleClaimLuckyWheelReward}
            onClose={() => setShowLuckyWheel(false)}
          />
        )}

        {showDailyTasks && (
          <DailyTasksModal
            tasks={dailyTasks}
            onClaimTask={handleClaimDailyTask}
            onClose={() => setShowDailyTasks(false)}
          />
        )}

        {showProfile && (
          <ProfileModal
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setShowProfile(false)}
          />
        )}

        {showNextUpdate && (
          <NextUpdateModal onClose={() => setShowNextUpdate(false)} />
        )}

        {showEndlessMap && (
          <EndlessMapModal
            unlockedLevel={unlockedLevel}
            levelScores={levelScores}
            onSelectLevel={(lvl) => {
              initLevel(lvl);
              setInStartScreen(false);
              setShowEndlessMap(false);
            }}
            onClose={() => setShowEndlessMap(false)}
          />
        )}

        {showMap && (
          <SagaMapModal
            currentLevelId={currentLevel.id}
            unlockedLevel={unlockedLevel}
            levelScores={levelScores}
            onSelectLevel={(lvl) => {
              initLevel(lvl);
              setInStartScreen(false);
              setShowMap(false);
            }}
            onClose={() => setShowMap(false)}
          />
        )}

        {showGuide && <RulesGuideModal onClose={() => setShowGuide(false)} />}
      </>
    );
  }

  // Active Gameplay Screen
  return (
    <div className={`min-h-screen w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-pink-950 p-2 sm:p-4 select-none ${
      settings.graphicsPreset === 'very_low' ? 'fast-render' : ''
    }`}>
      {/* Game Header Bar */}
      <GameHeader
        level={currentLevel}
        stats={stats}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        gold={gold}
        onToggleSound={() => {
          const next = !settings.soundEnabled;
          sound.setEnabled(next);
          handleUpdateSettings({ soundEnabled: next });
        }}
        onToggleMusic={() => {
          const next = !settings.musicEnabled;
          sound.toggleMusic(next);
          handleUpdateSettings({ musicEnabled: next });
        }}
        onRestart={() => initLevel(currentLevel)}
        onOpenMap={() => setShowMap(true)}
        onOpenEndlessMap={() => setShowEndlessMap(true)}
        onOpenDailyTasks={() => setShowDailyTasks(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenShop={() => setShowShop(true)}
        onGoHome={() => {
          sound.playPop();
          setInStartScreen(true);
        }}
      />

      {/* Main Interactive Board */}
      <main className="flex-1 flex flex-col items-center justify-center relative my-auto">
        <Board
          board={board}
          selectedTile={selectedTile || switchFirstTile}
          onTileClick={handleTileClick}
          onSwipe={(r1, c1, r2, c2) => {
            if (board[r1]?.[c1] && board[r2]?.[c2]) {
              handleSwap(board[r1][c1], board[r2][c2]);
            }
          }}
          hintTiles={hintTiles}
          activeBooster={activeBooster}
          scorePopups={scorePopups}
          comboBanner={comboBanner}
          isReshuffling={isReshuffling}
          isBoardShaking={isBoardShaking}
          isProcessing={isProcessing}
        />
      </main>

      {/* Boosters & Quick Help Footer with level unlock logic */}
      <footer className="w-full pb-1">
        <BoosterBar
          boosters={boosters}
          activeBooster={activeBooster}
          unlockedLevel={unlockedLevel}
          hasVipPass={hasVipPass}
          onSelectBooster={handleSelectBooster}
          onRequestHint={handleRequestHint}
          isProcessing={isProcessing}
          onOpenShop={() => setShowShop(true)}
        />

        {/* Bottom utility helper */}
        <div className="flex items-center justify-center gap-4 text-xs text-purple-300 font-semibold py-0.5">
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Play & Combos</span>
          </button>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Shop & Pass Modal */}
      {showShop && (
        <ShopModal
          currentGold={gold}
          hasVipPass={hasVipPass}
          purchasedPackageIds={purchasedPackageIds}
          onPurchaseSuccess={handlePurchaseSuccess}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Daily Reward Modal */}
      {showDailyReward && (
        <DailyRewardModal
          rewardState={dailyReward}
          onClaim={handleClaimDailyReward}
          onClose={handleCloseDailyReward}
        />
      )}

      {/* Daily Lucky Wheel Mini-Game */}
      {showLuckyWheel && (
        <LuckyWheelModal
          wheelState={luckyWheel}
          onClaimReward={handleClaimLuckyWheelReward}
          onClose={() => setShowLuckyWheel(false)}
        />
      )}

      {/* Daily Tasks Modal (English Only) */}
      {showDailyTasks && (
        <DailyTasksModal
          tasks={dailyTasks}
          onClaimTask={handleClaimDailyTask}
          onClose={() => setShowDailyTasks(false)}
        />
      )}

      {/* Player Profile & Anti-Cheat Bio Modal */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Next Update Teaser Modal */}
      {showNextUpdate && (
        <NextUpdateModal onClose={() => setShowNextUpdate(false)} />
      )}

      {/* Endless Map Modal */}
      {showEndlessMap && (
        <EndlessMapModal
          unlockedLevel={unlockedLevel}
          levelScores={levelScores}
          onSelectLevel={(lvl) => {
            initLevel(lvl);
            setShowEndlessMap(false);
          }}
          onClose={() => setShowEndlessMap(false)}
        />
      )}

      {/* Saga Level Select Modal */}
      {showMap && (
        <SagaMapModal
          currentLevelId={currentLevel.id}
          unlockedLevel={unlockedLevel}
          levelScores={levelScores}
          onSelectLevel={(lvl) => {
            initLevel(lvl);
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* Rules / Combos Guide Modal */}
      {showGuide && <RulesGuideModal onClose={() => setShowGuide(false)} />}

      {/* Level Win / Defeat Modal */}
      {gameResult && (
        <WinLoseModal
          status={gameResult}
          level={currentLevel}
          stats={stats}
          hasNextLevel={currentLevel.id < SAGA_LEVELS.length && currentLevel.id !== 99}
          onNextLevel={handleNextLevel}
          onRetry={() => initLevel(currentLevel)}
          onAddMoves={handleAddExtraMoves}
          onHome={() => {
            sound.playPop();
            setGameResult(null);
            setInStartScreen(true);
          }}
          onOpenMap={() => {
            sound.playPop();
            setGameResult(null);
            setShowMap(true);
          }}
        />
      )}
    </div>
  );
}
