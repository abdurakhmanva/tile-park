import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Settings,
  Palette,
  Undo2,
  Magnet,
  RefreshCw,
  Tv,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import FruitIcon from './components/FruitIcon';
import {
  generateGameData,
  isTileBlocked,
  addTileToDock,
  checkMatch,
  shuffleArray,
} from './utils/gameLogic';
import { sound } from './utils/audio';
import './App.css';

export default function App() {
  const [level, setLevel] = useState(() => {
    try {
      const saved = localStorage.getItem('tile_park_level');
      return saved ? parseInt(saved, 10) : 15;
    } catch {
      return 15;
    }
  });

  const [gems, setGems] = useState(() => {
    try {
      const saved = localStorage.getItem('tile_park_gems');
      return saved ? parseInt(saved, 10) : 200;
    } catch {
      return 200;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tile_park_level', level.toString());
    } catch {}
  }, [level]);

  useEffect(() => {
    try {
      localStorage.setItem('tile_park_gems', gems.toString());
    } catch {}
  }, [gems]);

  // O'yin ma'lumotlari: maydon plitkalari va pastki 3 ta stack
  const [boardTiles, setBoardTiles] = useState([]);
  const [stacks, setStacks] = useState([[], [], []]);
  const [dockSlots, setDockSlots] = useState([]);

  // Booster hisoblagichlari
  const [undoCount, setUndoCount] = useState(3);
  const [magnetCount, setMagnetCount] = useState(2);
  const [shuffleCount, setShuffleCount] = useState(2);

  // Tarix (Undo uchun)
  const [history, setHistory] = useState([]);
  const [shakingId, setShakingId] = useState(null);
  const [blastingType, setBlastingType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  // Modallar
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Poyga (Race condition) va plitkalar yo'qolishini oldini oluvchi sinxron ref
  const stateRef = useRef({
    boardTiles: [],
    stacks: [[], [], []],
    dockSlots: [],
    isProcessing: false,
    gameStatus: 'playing',
  });

  const blastTimerRef = useRef(null);

  // O'yinni boshlash / qayta ishga tushirish
  const startNewGame = () => {
    if (blastTimerRef.current) {
      clearTimeout(blastTimerRef.current);
      blastTimerRef.current = null;
    }

    const data = generateGameData();
    stateRef.current = {
      boardTiles: data.boardTiles,
      stacks: data.stacks,
      dockSlots: [],
      isProcessing: false,
      gameStatus: 'playing',
    };

    setBoardTiles(data.boardTiles);
    setStacks(data.stacks);
    setDockSlots([]);
    setHistory([]);
    setGameStatus('playing');
    setBlastingType(null);
    setIsProcessing(false);
  };

  useEffect(() => {
    startNewGame();
    return () => {
      if (blastTimerRef.current) clearTimeout(blastTimerRef.current);
    };
  }, [level]);

  // Snapshot saqlash (Undo uchun)
  const saveSnapshot = () => {
    setHistory((prev) => [
      ...prev,
      {
        boardTiles: JSON.parse(JSON.stringify(stateRef.current.boardTiles)),
        stacks: JSON.parse(JSON.stringify(stateRef.current.stacks)),
        dockSlots: [...stateRef.current.dockSlots],
      },
    ]);
  };

  // Plitkani tanlash va Dockga joylash (Sinxron va 100% xavfsiz)
  const processTileSelection = (tile, source) => {
    if (stateRef.current.gameStatus !== 'playing') return;
    if (stateRef.current.isProcessing) return; // Portlash paytida bloklash
    if (stateRef.current.dockSlots.length >= 7) return; // Dock to'lgan

    if (source.type === 'board') {
      if (isTileBlocked(tile, stateRef.current.boardTiles)) {
        sound.playLocked();
        setShakingId(tile.id);
        setTimeout(() => setShakingId(null), 350);
        return;
      }
    }

    // Undo uchun saqlash
    saveSnapshot();
    sound.playClick();

    // 1. Manzilidan olib tashlash
    let nextBoard = stateRef.current.boardTiles;
    let nextStacks = stateRef.current.stacks;

    if (source.type === 'board') {
      nextBoard = nextBoard.filter((t) => t.id !== tile.id);
    } else if (source.type === 'stack') {
      const sIdx = source.stackIdx;
      nextStacks = nextStacks.map((s, idx) =>
        idx === sIdx ? s.slice(0, -1) : s
      );
    }

    // 2. Dockga joylash va guruhlash
    const updatedDock = addTileToDock(stateRef.current.dockSlots, tile);

    // 3. Sinxron refni darhol yangilash (Race condition bartaraf etildi)
    stateRef.current.boardTiles = nextBoard;
    stateRef.current.stacks = nextStacks;
    stateRef.current.dockSlots = updatedDock;

    // 4. React state-ni yangilash
    setBoardTiles(nextBoard);
    setStacks(nextStacks);

    // 5. 3 talik moslikni tekshirish
    const { matched, remaining } = checkMatch(updatedDock);

    if (matched) {
      setDockSlots(updatedDock);
      setBlastingType(matched);
      setIsProcessing(true);
      stateRef.current.isProcessing = true;
      sound.playMatch();

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.2 },
      });

      blastTimerRef.current = setTimeout(() => {
        stateRef.current.dockSlots = remaining;
        stateRef.current.isProcessing = false;
        setDockSlots(remaining);
        setBlastingType(null);
        setIsProcessing(false);
        blastTimerRef.current = null;

        // G'alaba yoki Deadlock tekshiruvi
        const totalRemaining =
          nextBoard.length +
          nextStacks[0].length +
          nextStacks[1].length +
          nextStacks[2].length;

        if (totalRemaining === 0) {
          if (remaining.length === 0) {
            handleWin();
          } else {
            sound.playGameOver();
            setGameStatus('lost');
            stateRef.current.gameStatus = 'lost';
          }
        }
      }, 300);
    } else {
      setDockSlots(updatedDock);

      // 7 taga to'lib qolsa mag'lubiyat
      if (updatedDock.length >= 7) {
        sound.playGameOver();
        setGameStatus('lost');
        stateRef.current.gameStatus = 'lost';
        return;
      }

      // Maydonda hech narsa qolmagan bo'lsa
      const totalRemaining =
        nextBoard.length +
        nextStacks[0].length +
        nextStacks[1].length +
        nextStacks[2].length;

      if (totalRemaining === 0) {
        if (updatedDock.length === 0) {
          handleWin();
        } else {
          sound.playGameOver();
          setGameStatus('lost');
          stateRef.current.gameStatus = 'lost';
        }
      }
    }
  };

  const handleBoardTileClick = (tile) => {
    processTileSelection(tile, { type: 'board' });
  };

  const handleStackClick = (stackIdx) => {
    const stack = stateRef.current.stacks[stackIdx];
    if (!stack || stack.length === 0) return;
    const topTile = stack[stack.length - 1];
    processTileSelection(topTile, { type: 'stack', stackIdx });
  };

  const handleWin = () => {
    sound.playWin();
    setGameStatus('won');
    stateRef.current.gameStatus = 'won';
    setGems((g) => g + 50);

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.4 },
    });
  };

  // BOOSTER 1: Undo (Orqaga qaytarish)
  const handleUndoBooster = () => {
    if (history.length === 0 || undoCount <= 0 || gameStatus === 'won') return;

    if (blastTimerRef.current) {
      clearTimeout(blastTimerRef.current);
      blastTimerRef.current = null;
    }

    sound.playUndo();
    setUndoCount((c) => c - 1);
    setBlastingType(null);
    setIsProcessing(false);

    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    stateRef.current = {
      boardTiles: lastState.boardTiles,
      stacks: lastState.stacks,
      dockSlots: lastState.dockSlots,
      isProcessing: false,
      gameStatus: 'playing',
    };

    setBoardTiles(lastState.boardTiles);
    setStacks(lastState.stacks);
    setDockSlots(lastState.dockSlots);
    setGameStatus('playing');
  };

  // BOOSTER 2: Magnet (Haqiqiy Match-3 Avtomatik terish)
  const handleMagnetBooster = () => {
    if (magnetCount <= 0 || gameStatus !== 'playing' || isProcessing) return;

    const currentBoard = stateRef.current.boardTiles;
    const currentStacks = stateRef.current.stacks;
    const currentDock = stateRef.current.dockSlots;

    // Dockdagi turlar hisobi
    const dockCounts = {};
    currentDock.forEach((t) => {
      dockCounts[t.type] = (dockCounts[t.type] || 0) + 1;
    });

    const sortedDockTypes = Object.entries(dockCounts).sort((a, b) => b[1] - a[1]);
    let targetType = null;
    let needed = 3;

    // 1-navbatda dockda bor mevani 3 taga to'ldirish
    for (const [type, count] of sortedDockTypes) {
      const inBoard = currentBoard.filter((t) => t.type === type).length;
      const inStacks = currentStacks.reduce(
        (sum, s) => sum + s.filter((t) => t.type === type).length,
        0
      );
      if (count + inBoard + inStacks >= 3) {
        targetType = type;
        needed = 3 - count;
        break;
      }
    }

    // Agar dock bo'sh bo'lsa yoki mos kelmasa, maydondan ixtiyoriy 3 talik topish
    if (!targetType) {
      const allCounts = {};
      currentBoard.forEach((t) => {
        allCounts[t.type] = (allCounts[t.type] || 0) + 1;
      });
      currentStacks.forEach((s) => {
        s.forEach((t) => {
          allCounts[t.type] = (allCounts[t.type] || 0) + 1;
        });
      });
      for (const [type, count] of Object.entries(allCounts)) {
        if (count >= 3) {
          targetType = type;
          needed = 3;
          break;
        }
      }
    }

    if (!targetType) return;
    if (currentDock.length + needed > 7) return; // Joy yetmasa o'tkazmaydi

    saveSnapshot();
    setMagnetCount((c) => c - 1);
    sound.playMatch();

    const pulled = [];
    let updatedBoard = [...currentBoard];
    let updatedStacks = currentStacks.map((s) => [...s]);

    // Ochiq maydon plitkalaridan olish
    for (let i = updatedBoard.length - 1; i >= 0 && pulled.length < needed; i--) {
      const t = updatedBoard[i];
      if (t.type === targetType && !isTileBlocked(t, updatedBoard)) {
        pulled.push(t);
        updatedBoard.splice(i, 1);
      }
    }

    // Stacklar ustidan olish
    for (let sIdx = 0; sIdx < updatedStacks.length && pulled.length < needed; sIdx++) {
      const s = updatedStacks[sIdx];
      if (s.length > 0 && s[s.length - 1].type === targetType) {
        pulled.push(s.pop());
      }
    }

    // Qolganini maydonning boshqa qatlamlaridan olish
    for (let i = updatedBoard.length - 1; i >= 0 && pulled.length < needed; i--) {
      const t = updatedBoard[i];
      if (t.type === targetType) {
        pulled.push(t);
        updatedBoard.splice(i, 1);
      }
    }

    // Qolganini stacklar ichidan olish
    for (let sIdx = 0; sIdx < updatedStacks.length && pulled.length < needed; sIdx++) {
      const s = updatedStacks[sIdx];
      for (let i = s.length - 1; i >= 0 && pulled.length < needed; i--) {
        if (s[i].type === targetType) {
          pulled.push(s.splice(i, 1)[0]);
        }
      }
    }

    let updatedDock = [...currentDock];
    for (const t of pulled) {
      updatedDock = addTileToDock(updatedDock, t);
    }

    stateRef.current.boardTiles = updatedBoard;
    stateRef.current.stacks = updatedStacks;
    stateRef.current.dockSlots = updatedDock;
    stateRef.current.isProcessing = true;
    setIsProcessing(true);

    setBoardTiles(updatedBoard);
    setStacks(updatedStacks);
    setDockSlots(updatedDock);

    const { matched, remaining } = checkMatch(updatedDock);
    if (matched) {
      setBlastingType(matched);
      confetti({ particleCount: 35, spread: 70, origin: { y: 0.2 } });

      blastTimerRef.current = setTimeout(() => {
        stateRef.current.dockSlots = remaining;
        stateRef.current.isProcessing = false;
        setDockSlots(remaining);
        setBlastingType(null);
        setIsProcessing(false);
        blastTimerRef.current = null;

        const totalRemaining =
          updatedBoard.length +
          updatedStacks[0].length +
          updatedStacks[1].length +
          updatedStacks[2].length;

        if (totalRemaining === 0) {
          if (remaining.length === 0) {
            handleWin();
          } else {
            sound.playGameOver();
            setGameStatus('lost');
            stateRef.current.gameStatus = 'lost';
          }
        }
      }, 300);
    }
  };

  // BOOSTER 3: Shuffle (Maydondagi mevalarni qayta aralashtirish)
  const handleShuffleBooster = () => {
    if (
      shuffleCount <= 0 ||
      gameStatus !== 'playing' ||
      isProcessing ||
      boardTiles.length === 0
    )
      return;

    setShuffleCount((c) => c - 1);
    sound.playUndo();

    const types = shuffleArray(boardTiles.map((t) => t.type));
    const shuffledBoard = boardTiles.map((tile, i) => ({
      ...tile,
      type: types[i],
    }));

    stateRef.current.boardTiles = shuffledBoard;
    setBoardTiles(shuffledBoard);
  };

  // 1:1 Koordinata shkalasi
  const TILE_W = 50;
  const TILE_H = 58;
  const STEP_X = 52;
  const STEP_Y = 58;

  return (
    <div className="mobile-app-shell">
      <div className="mobile-screen">
        {/* 1. TOP BAR (D:\tile.png dan 1:1) */}
        <header className="top-bar">
          {/* Palitra tugmasi */}
          <button
            className="btn-palette"
            onClick={() => setSettingsOpen(true)}
            title="Mavzular / Sozlamalar"
          >
            <Palette />
          </button>

          {/* Bosqich (Level) badge */}
          <div className="level-badge">Уровень {level}</div>

          {/* Olmoslar (Gems) */}
          <div className="gems-badge">
            <span className="gem-icon">💎</span>
            <span className="gems-amount">{gems}</span>
            <button className="btn-plus" onClick={() => setGems((g) => g + 50)}>
              +
            </button>
          </div>
        </header>

        {/* 2. DOCK BAR (7 SLOTS - AYNAN TEPADA JOYLASHTIRILGAN!) */}
        <div className="dock-container">
          <div className="dock-card-bar">
            {Array.from({ length: 7 }).map((_, index) => {
              const tile = dockSlots[index];
              const isBlasting = tile && blastingType === tile.type;

              return (
                <div key={index} className="dock-cell">
                  {tile && (
                    <div
                      className={`dock-placed-tile ${
                        isBlasting ? 'blasting' : ''
                      }`}
                    >
                      <FruitIcon type={tile.type} className="w-8 h-8" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. MAYDON (BOARD - 4 QATLAMLI MAHJONG TARTIBI) */}
        <main className="board-section">
          <div className="board-matrix">
            {boardTiles.map((tile) => {
              const blocked = isTileBlocked(tile, boardTiles);
              const isShaking = shakingId === tile.id;
              const left = 14 + tile.x * STEP_X;
              const top = 16 + tile.y * STEP_Y;
              const zIndex = tile.layer * 10 + 2;

              return (
                <div
                  key={tile.id}
                  className={`board-tile-item ${
                    blocked ? 'blocked' : 'open'
                  } ${isShaking ? 'shaking' : ''}`}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex,
                  }}
                  onClick={() => handleBoardTileClick(tile)}
                >
                  <div className="tile-box">
                    <FruitIcon type={tile.type} className="w-7 h-7" />
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* 4. PASTKI 3 TA TAXLAM (BOTTOM 3 STACKS / DECKS) */}
        <div className="bottom-stacks-row">
          {stacks.map((stack, stackIdx) => {
            if (stack.length === 0) {
              return (
                <div key={stackIdx} className="stack-column empty">
                  <div className="stack-empty-slot">
                    <span className="empty-slot-mark">✓</span>
                  </div>
                </div>
              );
            }

            const topTile = stack[stack.length - 1];

            return (
              <div
                key={stackIdx}
                className="stack-column"
                onClick={() => handleStackClick(stackIdx)}
              >
                {/* Pastki qatlamlar soyasi */}
                {stack.length > 2 && (
                  <div
                    className="stack-card-layer"
                    style={{ transform: 'translateY(-6px)' }}
                  />
                )}
                {stack.length > 1 && (
                  <div
                    className="stack-card-layer"
                    style={{ transform: 'translateY(-3px)' }}
                  />
                )}
                {/* Eng ustki faol karta */}
                <div className="stack-card-layer top-card">
                  <FruitIcon type={topTile.type} className="w-7 h-7" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. PASTKI BOSHQARUV TUGMALARI (BOTTOM ACTION BAR - 1:1 D:\tile.png) */}
        <footer className="action-bar">
          {/* 1. Reklama televizori */}
          <div
            className="btn-ad-tv"
            onClick={() => {
              setGems((g) => g + 100);
              sound.playWin();
            }}
            title="Reklama ko'rish (+100 Olmos)"
          >
            <div className="relative">
              <Tv size={36} color="#fbbf24" strokeWidth={2.5} />
              <span className="absolute -bottom-1 -right-1 bg-red-600 text-white font-black text-[9px] px-1 rounded-sm border border-white">
                AD
              </span>
            </div>
          </div>

          {/* 2. Undo (Sariq o'q) */}
          <div className="action-btn-wrapper">
            <button
              className="action-circle-btn"
              onClick={handleUndoBooster}
              disabled={undoCount <= 0 || history.length === 0 || isProcessing}
              title="Orqaga qaytarish (Undo)"
            >
              <Undo2 size={28} color="#fde047" strokeWidth={3.5} />
            </button>
            <span className="action-count-badge">{undoCount}</span>
          </div>

          {/* 3. Magnet (Magnit) */}
          <div className="action-btn-wrapper">
            <button
              className="action-circle-btn"
              onClick={handleMagnetBooster}
              disabled={magnetCount <= 0 || isProcessing}
              title="Magnit (Match-3 yig'ish)"
            >
              <Magnet size={28} color="#c084fc" strokeWidth={3} />
            </button>
            <span className="action-count-badge">{magnetCount}</span>
          </div>

          {/* 4. Shuffle (Qayta aralashtirish) */}
          <div className="action-btn-wrapper">
            <button
              className="action-circle-btn"
              onClick={handleShuffleBooster}
              disabled={shuffleCount <= 0 || isProcessing || boardTiles.length === 0}
              title="Aralashtirish (Shuffle)"
            >
              <RefreshCw size={26} color="#a855f7" strokeWidth={3} />
            </button>
            <span className="action-count-badge">{shuffleCount}</span>
          </div>

          {/* 5. Sozlamalar */}
          <button
            className="btn-settings"
            onClick={() => setSettingsOpen(true)}
            title="Sozlamalar"
          >
            <Settings />
          </button>
        </footer>

        {/* 6. G'ALABA MODAL (WIN) */}
        {gameStatus === 'won' && (
          <div className="game-modal-overlay">
            <div className="game-modal-card">
              <div className="text-6xl mb-3">🏆</div>
              <h2 className="text-2xl font-black text-emerald-400 mb-2">
                УРОВЕНЬ ПРОЙДЕН!
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                Barcha plitkalar muvaffaqiyatli tozalindi! Mukofot: +50 💎
              </p>
              <button
                className="modal-btn-confirm"
                onClick={() => {
                  setLevel((l) => l + 1);
                  startNewGame();
                }}
              >
                Keyingi Bosqich
              </button>
            </div>
          </div>
        )}

        {/* 7. MAG'LUBIYAT MODAL (GAME OVER) */}
        {gameStatus === 'lost' && (
          <div className="game-modal-overlay">
            <div className="game-modal-card">
              <div className="text-6xl mb-3">💀</div>
              <h2 className="text-2xl font-black text-rose-500 mb-2">
                ПРОИГРЫШ!
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                {dockSlots.length >= 7
                  ? "Slotlaringiz 7 taga to'lib qoldi."
                  : "Mos keluvchi plitkalar qolmadi."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-sm"
                  onClick={handleUndoBooster}
                >
                  Orqaga qaytish
                </button>
                <button
                  className="modal-btn-confirm !mt-0 !text-sm !py-2 !px-5"
                  onClick={startNewGame}
                >
                  Qayta o'ynash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. SOZLAMALAR MODALI */}
        {settingsOpen && (
          <div
            className="game-modal-overlay"
            onClick={() => setSettingsOpen(false)}
          >
            <div
              className="game-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">SOZLAMALAR</h3>

              <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl mb-3">
                <span className="text-sm font-semibold text-slate-200">
                  Ovoz effektlari
                </span>
                <button
                  className="p-2 bg-slate-700 rounded-lg text-white"
                  onClick={() => {
                    const next = sound.toggle();
                    setSoundOn(next);
                  }}
                >
                  {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-xl mb-4">
                <span className="text-sm font-semibold text-slate-200">
                  Qayta boshlash
                </span>
                <button
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
                  onClick={() => {
                    setSettingsOpen(false);
                    startNewGame();
                  }}
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              <button
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-sm"
                onClick={() => setSettingsOpen(false)}
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
