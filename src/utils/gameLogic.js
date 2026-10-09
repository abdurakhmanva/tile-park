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

/**
 * Doskani va pastki 3 ta stack (zaxira)ni generatsiya qilish.
 * Jami plitkalar soni doimo 3 ga karrali bo'ladi!
 */
export function generateGameData() {
  const boardCount = BOARD_LAYOUT.length; // 44 ta plitka
  // Har bir pastki stackda 3 tadan karta bo'ladi = 9 ta plitka
  // Jami: 44 + 9 = 53 ta? 53 ta 3 ga bo'linmaydi (53 % 3 = 2).
  // Shuning uchun doskani 42 ta qilamiz: 42 + 9 = 51 ta (51 = 17 * 3).
  // Yoki doskani 45 ta qilamiz: 45 + 9 = 54 ta (54 = 18 * 3, 8 x 6 = 48 + 6 = 54!).
  // 54 ta plitka ayni muddao!
  const activeLayout = BOARD_LAYOUT.slice(0, 45); // 45 ta maydonda

  // 54 ta plitka uchun mevalar basseyini:
  // 8 xil meva. 6 tasidan 7 tadan bo'lmaydi.
  // 6 tasidan 6 tadan = 36 ta.
  // 2 tasidan 9 tadan = 18 ta.
  // Jami: 36 + 18 = 54 ta plitka (har biri 3 ga karrali!).
  const pool = [];
  TILE_TYPES.forEach((type, idx) => {
    const count = idx < 6 ? 6 : 9;
    for (let c = 0; c < count; c++) {
      pool.push(type);
    }
  });

  // Aralashtirish
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Maydon plitkalari (45 ta)
  const boardTiles = activeLayout.map((pos, i) => ({
    id: `board_${i + 1}`,
    type: shuffled[i],
    layer: pos.layer,
    x: pos.x,
    y: pos.y,
  }));

  // Pastki 3 ta stack (har birida 3 tadan = 9 ta)
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
 * Dockga yangi plitka qo'shish va guruhlash.
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
 */
export function checkMatch(dockSlots) {
  const counts = {};
  for (const t of dockSlots) {
    counts[t.type] = (counts[t.type] || 0) + 1;
  }

  for (const [type, count] of Object.entries(counts)) {
    if (count === 3) {
      const remaining = dockSlots.filter((t) => t.type !== type);
      return { matched: type, remaining };
    }
  }

  return { matched: null, remaining: dockSlots };
}
