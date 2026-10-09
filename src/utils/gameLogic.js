// TILE PARK ENGINE (1:1 D:\tile.png Mobile Edition)

export const TILE_TYPES = [
  'pear',    // 🍐 Nok
  'grape',   // 🍇 Uzum
  'potion',  // 🧪 Moviy eliksir flakoni
  'cookie',  // 🍪 Pechenye
  'paw',     // 🐾 Mushuk panjasi
  'star',    // ⭐ Yulduz
  'heart',   // 💖 Yurak
  'cherry',  // 🍒 Gilos
];

/**
 * Doska koordinatalari va qatlamlari.
 * Rasmdagi (D:\tile.png) zich 4 qatlamli (L0, L1, L2, L3) Mahjong joylashuvi:
 * Maydon eni ~7 ustun, bo'yi ~6 qator.
 */
/**
 * 5 QATLAMLI STANDART SXEMA (54 ta plitka = 18 ta uchtalik)
 * Barcha plitkalar to'liq maydonda uyg'un joylashtirilgan.
 */
export const BOARD_LAYOUT = [
  // Layer 0: Asosiy poydevor (20 ta plitka)
  { layer: 0, x: 0, y: 0 }, { layer: 0, x: 1, y: 0 }, { layer: 0, x: 2, y: 0 }, { layer: 0, x: 3, y: 0 }, { layer: 0, x: 4, y: 0 }, { layer: 0, x: 5, y: 0 }, { layer: 0, x: 6, y: 0 },
  { layer: 0, x: 0, y: 1 }, { layer: 0, x: 6, y: 1 },
  { layer: 0, x: 0, y: 2 }, { layer: 0, x: 6, y: 2 },
  { layer: 0, x: 0, y: 3 }, { layer: 0, x: 6, y: 3 },
  { layer: 0, x: 0, y: 4 }, { layer: 0, x: 1, y: 4 }, { layer: 0, x: 2, y: 4 }, { layer: 0, x: 3, y: 4 }, { layer: 0, x: 4, y: 4 }, { layer: 0, x: 5, y: 4 }, { layer: 0, x: 6, y: 4 },

  // Layer 1: O'rta qatlam (14 ta plitka)
  { layer: 1, x: 0.5, y: 0.5 }, { layer: 1, x: 1.5, y: 0.5 }, { layer: 1, x: 4.5, y: 0.5 }, { layer: 1, x: 5.5, y: 0.5 },
  { layer: 1, x: 0.5, y: 1.5 }, { layer: 1, x: 5.5, y: 1.5 },
  { layer: 1, x: 0.5, y: 2.5 }, { layer: 1, x: 5.5, y: 2.5 },
  { layer: 1, x: 0.5, y: 3.5 }, { layer: 1, x: 1.5, y: 3.5 }, { layer: 1, x: 4.5, y: 3.5 }, { layer: 1, x: 5.5, y: 3.5 },
  { layer: 1, x: 2.5, y: 0.5 }, { layer: 1, x: 3.5, y: 0.5 },

  // Layer 2: Markaziy qatlam (10 ta plitka)
  { layer: 2, x: 2, y: 1 }, { layer: 2, x: 3, y: 1 }, { layer: 2, x: 4, y: 1 },
  { layer: 2, x: 1.5, y: 2 }, { layer: 2, x: 4.5, y: 2 },
  { layer: 2, x: 2, y: 3 }, { layer: 2, x: 3, y: 3 }, { layer: 2, x: 4, y: 3 },
  { layer: 2, x: 2.5, y: 2 }, { layer: 2, x: 3.5, y: 2 },

  // Layer 3: Ichki piramida (6 ta plitka)
  { layer: 3, x: 2.0, y: 1.5 }, { layer: 3, x: 4.0, y: 1.5 },
  { layer: 3, x: 3.0, y: 1.5 }, { layer: 3, x: 3.0, y: 2.5 },
  { layer: 3, x: 2.0, y: 2.5 }, { layer: 3, x: 4.0, y: 2.5 },

  // Layer 4: Cho'qqi (4 ta plitka)
  { layer: 4, x: 2.5, y: 2.0 }, { layer: 4, x: 3.5, y: 2.0 },
  { layer: 4, x: 3.0, y: 1.7 }, { layer: 4, x: 3.0, y: 2.3 },
];

/**
 * 6 QATLAMLI YAGONALASHGAN ROYAL PIRAMIDA (60 ta plitka = 20 ta uchtalik)
 * Pastdagi ortiqcha ajralib turuvchi kubchalarsiz, barchasi yagona ulug'vor Mahjong qal'asida!
 */
export const HARD_BOARD_LAYOUT = [
  // Layer 0: Asosiy poydevor (22 ta plitka)
  { layer: 0, x: 0, y: 0 }, { layer: 0, x: 1, y: 0 }, { layer: 0, x: 2, y: 0 }, { layer: 0, x: 3, y: 0 }, { layer: 0, x: 4, y: 0 }, { layer: 0, x: 5, y: 0 }, { layer: 0, x: 6, y: 0 },
  { layer: 0, x: 0, y: 1 }, { layer: 0, x: 6, y: 1 },
  { layer: 0, x: 0, y: 2 }, { layer: 0, x: 6, y: 2 },
  { layer: 0, x: 0, y: 3 }, { layer: 0, x: 6, y: 3 },
  { layer: 0, x: 0, y: 4 }, { layer: 0, x: 6, y: 4 },
  { layer: 0, x: 0, y: 5 }, { layer: 0, x: 1, y: 5 }, { layer: 0, x: 2, y: 5 }, { layer: 0, x: 3, y: 5 }, { layer: 0, x: 4, y: 5 }, { layer: 0, x: 5, y: 5 }, { layer: 0, x: 6, y: 5 },

  // Layer 1: O'rta poydevor (16 ta plitka)
  { layer: 1, x: 0.5, y: 0.5 }, { layer: 1, x: 1.5, y: 0.5 }, { layer: 1, x: 4.5, y: 0.5 }, { layer: 1, x: 5.5, y: 0.5 },
  { layer: 1, x: 0.5, y: 1.5 }, { layer: 1, x: 1.5, y: 1.5 }, { layer: 1, x: 4.5, y: 1.5 }, { layer: 1, x: 5.5, y: 1.5 },
  { layer: 1, x: 0.5, y: 2.5 }, { layer: 1, x: 5.5, y: 2.5 },
  { layer: 1, x: 0.5, y: 3.5 }, { layer: 1, x: 1.5, y: 3.5 }, { layer: 1, x: 4.5, y: 3.5 }, { layer: 1, x: 5.5, y: 3.5 },
  { layer: 1, x: 1.5, y: 4.5 }, { layer: 1, x: 4.5, y: 4.5 },

  // Layer 2: Markaziy qal'a (10 ta plitka)
  { layer: 2, x: 2.5, y: 1 }, { layer: 2, x: 3.5, y: 1 },
  { layer: 2, x: 2, y: 2 }, { layer: 2, x: 3, y: 2 }, { layer: 2, x: 4, y: 2 },
  { layer: 2, x: 2, y: 3 }, { layer: 2, x: 3, y: 3 }, { layer: 2, x: 4, y: 3 },
  { layer: 2, x: 2.5, y: 4 }, { layer: 2, x: 3.5, y: 4 },

  // Layer 3: Ichki piramida (6 ta plitka)
  { layer: 3, x: 2.5, y: 1.8 }, { layer: 3, x: 3.5, y: 1.8 },
  { layer: 3, x: 3.0, y: 2.5 },
  { layer: 3, x: 2.5, y: 3.2 }, { layer: 3, x: 3.5, y: 3.2 },
  { layer: 3, x: 3.0, y: 3.8 },

  // Layer 4: Cho'qqi (4 ta plitka)
  { layer: 4, x: 2.5, y: 2.2 }, { layer: 4, x: 3.5, y: 2.2 },
  { layer: 4, x: 2.5, y: 3.0 }, { layer: 4, x: 3.5, y: 3.0 },

  // Layer 5: Apex — Eng ustki toj (2 ta plitka)
  { layer: 5, x: 2.8, y: 2.6 }, { layer: 5, x: 3.2, y: 2.6 },
];

const OVERLAP_W = 0.92;
const OVERLAP_H = 0.92;

export function isTileBlocked(tile, allTiles) {
  for (const other of allTiles) {
    if (other.id !== tile.id && other.layer > tile.layer) {
      if (
        Math.abs(tile.x - other.x) < OVERLAP_W &&
        Math.abs(tile.y - other.y) < OVERLAP_H
      ) {
        return true;
      }
    }
  }
  return false;
}

export function getBlockers(tile, allTiles) {
  const blockers = [];
  for (const other of allTiles) {
    if (other.id !== tile.id && other.layer > tile.layer) {
      if (
        Math.abs(tile.x - other.x) < OVERLAP_W &&
        Math.abs(tile.y - other.y) < OVERLAP_H
      ) {
        blockers.push(other);
      }
    }
  }
  return blockers;
}

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Doskani generatsiya qilish.
 * Barcha plitkalar 100% asosiy doskaga birlashtirilgan.
 * - 'hard': 60 ta plitka (6 qatlamli Piramida = 20 ta uchtalik)
 * - 'normal': 54 ta plitka (5 qatlamli = 18 ta uchtalik)
 */
export function generateGameData(difficulty = 'hard') {
  const isHard = difficulty === 'hard';
  const activeLayout = isHard ? HARD_BOARD_LAYOUT : BOARD_LAYOUT;
  const totalTiles = activeLayout.length; // 60 if hard, 54 if normal

  // Mevalar basseyini (doimo qat'iy 3 ga karrali)
  const pool = [];
  TILE_TYPES.forEach((type, idx) => {
    let count = 6;
    if (isHard) {
      count = idx < 4 ? 9 : 6; // 4x9 = 36 + 4x6 = 24 => 60 ta plitka!
    } else {
      count = idx < 2 ? 9 : 6; // 2x9 = 18 + 6x6 = 36 => 54 ta plitka!
    }
    for (let c = 0; c < count; c++) {
      pool.push(type);
    }
  });

  const shuffled = shuffleArray(pool);

  // Maydon plitkalari
  const boardTiles = activeLayout.map((pos, i) => ({
    id: `board_${i + 1}`,
    type: shuffled[i],
    layer: pos.layer,
    x: pos.x,
    y: pos.y,
  }));

  // Ortiqcha pastki stacklar endi yo'q — barchasi yaxlit maydonda!
  const stacks = [[], [], []];

  return { boardTiles, stacks, totalTiles, difficulty };
}

/**
 * Dockga yangi plitka qo'shish va bir xil turlarni yonma-yon guruhlash.
 */
export function addTileToDock(dockSlots, tile) {
  const newSlots = [...dockSlots];
  let insertIdx = newSlots.length;

  for (let i = newSlots.length - 1; i >= 0; i--) {
    if (newSlots[i].type === tile.type) {
      insertIdx = i + 1;
      break;
    }
  }

  newSlots.splice(insertIdx, 0, tile);
  return newSlots;
}

/**
 * 3 ta bir xil meva to'planganini tekshirish.
 * Aniq 3 tasini xavfsiz olib tashlaydi.
 */
export function checkMatch(dockSlots) {
  const counts = {};
  for (const t of dockSlots) {
    counts[t.type] = (counts[t.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(counts)) {
    if (count >= 3) {
      let removed = 0;
      const remaining = [];
      for (const t of dockSlots) {
        if (t.type === type && removed < 3) {
          removed++;
        } else {
          remaining.push(t);
        }
      }
      return { matched: type, remaining };
    }
  }

  return { matched: null, remaining: dockSlots };
}
