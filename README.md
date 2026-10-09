# 🌳 Tile Park — Web Edition (React + Vite)

Zamonaviy **Match-3 Tile / Solitaire** o'yini brauzer interfeysi bilan.

## 🚀 Ishga tushirish (Getting Started)

### 1. VS Code'da ochish:
Loyihani to'g'ridan-to'g'ri VS Code orqali ochish uchun terminalda:
```bash
code C:\Users\user\tile-park-web
```

### 2. Dasturni ishga tushirish:
```bash
cd C:\Users\user\tile-park-web
npm run dev
```
Brauzerda `http://localhost:5173` manziliga o'ting.

---

## 🎮 O'yin Mexanikasi va Xususiyatlari
- **3D Qatlamli plitkalar (Layers 0, 1, 2):** Bounding-box overlap mantiqi. Ustida boshqa plitka bo'lsa, avtomatik `🔒 Qulflangan` holatga o'tadi.
- **7 talik Dock Bar:** Plitkalar slotga tushganda avtomatik guruhlanadi.
- **Match-3 va Portlash:** Bir xil 3 ta meva yig'ilganda portlab yo'qoladi va confetti salyuti otiladi.
- **Undo (Orqaga qaytarish):** Barcha yurishlar tarixi saqlanadi.
- **Sintezlangan Ovozlar (Web Audio API):** Tashqi audio fayllarsiz toza brauzer tovushlari (click, match, error, win, lose).
- **100% Yechiladigan doskalar:** DFS Solver orqali kafolatlangan kombinatsiyalar.
- **3 xil qiyinlik darajasi:** Oson (18 ta), O'rta (24 ta), Qiyin (30 ta).
