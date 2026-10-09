import React, { useState, useEffect } from 'react';
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
} from './utils/gameLogic';
import { sound } from './utils/audio';
import './App.css';

export default function App() {
  const [level, setLevel] = useState(15);
  const [gems, setGems] = useState(200);

  // O'yin ma'lumotlari: maydon plitkalari va pastki 3 ta stack
  const [boardTiles, setBoardTiles] = useState([]);
  const [stacks, setStacks] = useState([[], [], []]);
  const [dockSlots, setDockSlots] = useState([]);

  // Booster hisoblagichlari (rasmdagi badge ko'rsatkichlari)
  const [undoCount, setUndoCount] = useState(3);
  const [magnetCount, setMagnetCount] = useState(2);
  const [shuffleCount, setShuffleCount] = useState(2);

  // Tarix (Undo uchun)
  const [history, setHistory] = useState([]);
  const [shakingId, setShakingId] = useState(null);
  const [blastingType, setBlastingType] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'

  // Modallar
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // O'yinni boshlash / qayta ishga tushirish
  const startNewGame = () => {
    const data = generateGameData();
    setBoardTiles(data.boardTiles);
    setStacks(data.stacks);
    setDockSlots([]);
    setHistory([]);
    setGameStatus('playing');
    setBlastingType(null);
  };

  useEffect(() => {
    startNewGame();
  }, [level]);

  // Snapshot saqlash (Undo uchun)
  const saveSnapshot = () => {
    setHistory((prev) => [
      ...prev,
      {
        boardTiles: JSON.parse(JSON.stringify(boardTiles)),
        stacks: JSON.parse(JSON.stringify(stacks)),
        dockSlots: [...dockSlots],
      },
    ]);
  };

  // 1. Maydondagi plitkani bosish
  const handleBoardTileClick = (tile) => {
    if (gameStatus !== 'playing') return;

    if (isTileBlocked(tile, boardTiles)) {
      sound.playLocked();
      setShakingId(tile.id);
      setTimeout(() => setShakingId(null), 350);
      return;
    }

    saveSnapshot();
    sound.playClick();

    // Maydondan olib tashlash
    const updatedBoard = boardTiles.filter((t) => t.id !== tile.id);
    setBoardTiles(updatedBoard);

    // Dockga joylash va match tekshirish
    processDockAddition(tile, updatedBoard, stacks);
  };

  // 2. Pastki 3 ta taxlamdagi (stack) ustki kartani bosish
  const handleStackClick = (stackIdx) => {
    if (gameStatus !== 'playing') return;
    const stack = stacks[stackIdx];
    if (stack.length === 0) return;

    saveSnapshot();
    sound.playClick();

    // Eng ustki kartani olish
    const topTile = stack[stack.length - 1];
    const newStacks = [...stacks];
    newStacks[stackIdx] = stack.slice(0, -1);
    setStacks(newStacks);

    processDockAddition(topTile, boardTiles, newStacks);
  };

  // Dockga plitka qo'shish va guruhlash umumiy jarayoni
  const processDockAddition = (tile, currentBoard, currentStacks) => {
    const updatedDock = addTileToDock(dockSlots, tile);

    const { matched, remaining } = checkMatch(updatedDock);

    if (matched) {
      setBlastingType(matched);
      sound.playMatch();

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.2 },
      });

      setTimeout(() => {
        setDockSlots(remaining);
        setBlastingType(null);

        // G'alaba sharti: maydon va barcha stacklar tozalangan bo'lsa
        const totalRemaining =
          currentBoard.length +
          currentStacks[0].length +
          currentStacks[1].length +
          currentStacks[2].length;

        if (totalRemaining === 0 && remaining.length === 0) {
          handleWin();
        }
      }, 300);
    } else {
      setDockSlots(updatedDock);

      // Mag'lubiyat: dock 7 taga to'lib qolsa
      if (updatedDock.length >= 7) {
        sound.playGameOver();
        setGameStatus('lost');
        return;
      }

      // Doska tozalangan bo'lsa
      const totalRemaining =
        currentBoard.length +
        currentStacks[0].length +
        currentStacks[1].length +
        currentStacks[2].length;

      if (totalRemaining === 0 && updatedDock.length === 0) {
        handleWin();
      }
    }
  };

  const handleWin = () => {
    sound.playWin();
    setGameStatus('won');
    setGems((g) => g + 50);

    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.4 },
    });
  };

  // BOOSTER 1: Undo (Sariq o'q)
  const handleUndoBooster = () => {
    if (history.length === 0 || undoCount <= 0 || gameStatus === 'won') return;

    sound.playUndo();
    setUndoCount((c) => c - 1);

    const lastState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    setBoardTiles(lastState.boardTiles);
    setStacks(lastState.stacks);
    setDockSlots(lastState.dockSlots);
    setGameStatus('playing');
  };

  // BOOSTER 2: Magnet (Avtomatik 3 talik moslikni terish)
  const handleMagnetBooster = () => {
    if (magnetCount <= 0 || gameStatus !== 'playing') return;

    // Mavjud ochiq plitkalar yoki dockdagi mevalarni qidirish
    const openBoardTiles = boardTiles.filter((t) => !isTileBlocked(t, boardTiles));
    const allAvailable = [
      ...openBoardTiles,
      ...stacks.map((s) => s[s.length - 1]).filter(Boolean),
    ];

    // Dockdagi mevalardan qaysi biri ko'proq?
    const dockCounts = {};
    dockSlots.forEach((t) => {
      dockCounts[t.type] = (dockCounts[t.type] || 0) + 1;
    });

    let targetType = Object.keys(dockCounts)[0] || allAvailable[0]?.type;
    if (!targetType) return;

    // Doskadan shu turdagi bitta ochiq mevani topib olish
    const candidate = allAvailable.find((t) => t.type === targetType);
    if (candidate) {
      setMagnetCount((c) => c - 1);
      sound.playMatch();
      if (candidate.id.startsWith('board_')) {
        handleBoardTileClick(candidate);
      } else {
        const stackIdx = stacks.findIndex((s) => s[s.length - 1]?.id === candidate.id);
        if (stackIdx !== -1) handleStackClick(stackIdx);
      }
    }
  };

  // BOOSTER 3: Shuffle (Maydondagi mevalarni qayta aralashtirish)
  const handleShuffleBooster = () => {
    if (shuffleCount <= 0 || gameStatus !== 'playing' || boardTiles.length === 0) return;

    setShuffleCount((c) => c - 1);
    sound.playUndo();

    const types = boardTiles.map((t) => t.type).sort(() => Math.random() - 0.5);
    const shuffledBoard = boardTiles.map((tile, i) => ({
      ...tile,
      type: types[i],
    }));
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
                <div key={stackIdx} className="stack-column opacity-30">
                  <div className="stack-card-layer" />
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
              disabled={undoCount <= 0 || history.length === 0}
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
              disabled={magnetCount <= 0}
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
              disabled={shuffleCount <= 0}
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
                Slotlaringiz 7 taga to'lib qoldi.
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
