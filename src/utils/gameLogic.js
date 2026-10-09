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
export const BOARD_LAYOUT = [
  // Layer 0: Asosiy pastki poydevor (18 ta plitka)
  { layer: 0, x: 0, y: 0 }, { layer: 0, x: 1, y: 0 }, { layer: 0, x: 2, y: 0 }, { layer: 0, x: 3, y: 0 }, { layer: 0, x: 4, y: 0 }, { layer: 0, x: 5, y: 0 }, { layer: 0, x: 6, y: 0 },
  { layer: 0, x: 0, y: 1 }, { layer: 0, x: 6, y: 1 },
  { layer: 0, x: 0, y: 2 }, { layer: 0, x: 6, y: 2 },
  { layer: 0, x: 0, y: 3 }, { layer: 0, x: 6, y: 3 },
  { layer: 0, x: 0, y: 4 }, { layer: 0, x: 1, y: 4 }, { layer: 0, x: 2, y: 4 }, { layer: 0, x: 3, y: 4 }, { layer: 0, x: 4, y: 4 }, { layer: 0, x: 5, y: 4 }, { layer: 0, x: 6, y: 4 },

  // Layer 1: O'rta qatlam (12 ta plitka)
  { layer: 1, x: 0.5, y: 0.5 }, { layer: 1, x: 1.5, y: 0.5 }, { layer: 1, x: 4.5, y: 0.5 }, { layer: 1, x: 5.5, y: 0.5 },
  { layer: 1, x: 0.5, y: 1.5 }, { layer: 1, x: 5.5, y: 1.5 },
  { layer: 1, x: 0.5, y: 2.5 }, { layer: 1, x: 5.5, y: 2.5 },
  { layer: 1, x: 0.5, y: 3.5 }, { layer: 1, x: 1.5, y: 3.5 }, { layer: 1, x: 4.5, y: 3.5 }, { layer: 1, x: 5.5, y: 3.5 },

  // Layer 2: Markaziy qatlam (8 ta plitka)
  { layer: 2, x: 2, y: 1 }, { layer: 2, x: 3, y: 1 }, { layer: 2, x: 4, y: 1 },
  { layer: 2, x: 1.5, y: 2 }, { layer: 2, x: 4.5, y: 2 },
  { layer: 2, x: 2, y: 3 }, { layer: 2, x: 3, y: 3 }, { layer: 2, x: 4, y: 3 },

  // Layer 3: Eng ustki qatlam (6 ta plitka - boshida ochiq bo'ladi)
  { layer: 3, x: 2.5, y: 1.5 }, { layer: 3, x: 3.5, y: 1.5 },
  { layer: 3, x: 2.0, y: 2.2 }, { layer: 3, x: 3.0, y: 2.0 }, { layer: 3, x: 4.0, y: 2.2 },
  { layer: 3, x: 3.0, y: 2.8 },
];

const OVERLAP_W = 0.95;
const OVERLAP_H = 0.95;

/**
 * Ustki qatlamdagi plitka ostki qatlamdagi plitkani to'sib turganini tekshirish.
 */
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
 * Doskani va pastki 3 ta stack (zaxira)ni generatsiya qilish.
 * Jami plitkalar soni doimo 3 ga karrali (54 ta plitka = 18 ta uchtalik) bo'ladi!
 */
export function generateGameData() {
  const activeLayout = BOARD_LAYOUT.slice(0, 45); // 45 ta maydonda plitka

  // 54 ta plitka uchun mevalar basseyini:
  // Har doim 3 ga karrali qat'iy uchtaliklar!
  // 6 ta turdan 6 tadan = 36 ta
  // 2 ta turdan 9 tadan = 18 ta
  // Jami: 36 + 18 = 54 ta (18 x 3)
  const pool = [];
  TILE_TYPES.forEach((type, idx) => {
    const count = idx < 6 ? 6 : 9;
    for (let c = 0; c < count; c++) {
      pool.push(type);
    }
  });

  // Mukammal Fisher-Yates aralashtirish
  const shuffled = shuffleArray(pool);

  // Maydon plitkalari (45 ta)
  const boardTiles = activeLayout.map((pos, i) => ({
    id: `board_${i + 1}`,
    type: shuffled[i],
    layer: pos.layer,
    x: pos.x,
    y: pos.y,
  }));

  // Pastki 3 ta stack (har birida 3 tadan = 9 ta plitka)
  let offset = 45;
  const stacks = [
    [
      { id: `stack_0_0`, type: shuffled[offset++], layer: 0 },
      { id: `stack_0_1`, type: shuffled[offset++], layer: 1 },
      { id: `stack_0_2`, type: shuffled[offset++], layer: 2 },
    ],
    [
      { id: `stack_1_0`, type: shuffled[offset++], layer: 0 },
      { id: `stack_1_1`, type: shuffled[offset++], layer: 1 },
      { id: `stack_1_2`, type: shuffled[offset++], layer: 2 },
    ],
    [
      { id: `stack_2_0`, type: shuffled[offset++], layer: 0 },
      { id: `stack_2_1`, type: shuffled[offset++], layer: 1 },
      { id: `stack_2_2`, type: shuffled[offset++], layer: 2 },
    ],
  ];

  return { boardTiles, stacks };
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
