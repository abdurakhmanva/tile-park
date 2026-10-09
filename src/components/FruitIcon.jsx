import React from 'react';

/**
 * D:\tile.png dagi 8 xil original plitka belgilari (Vektorli HD SVG render)
 * 1. pear (nok)
 * 2. grape (uzum)
 * 3. potion (moviy shisha idish)
 * 4. cookie (pechenye / marmeladli tart)
 * 5. paw (mushuk panjasi)
 * 6. star (oltin yulduz)
 * 7. heart (pushti yurak)
 * 8. cherry (gilos)
 */
export default function FruitIcon({ type, className = "w-8 h-8" }) {
  switch (type) {
    case 'pear':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Barg va novda */}
          <path d="M34 10 C34 6, 38 4, 42 4" stroke="#5d4037" strokeWidth="3" strokeLinecap="round" />
          <path d="M35 8 C40 5, 46 7, 48 12 C44 14, 38 12, 35 8 Z" fill="#4caf50" stroke="#2e7d32" strokeWidth="1.5" />
          {/* Nok tanasi */}
          <path
            d="M32 14 C24 14, 21 22, 23 30 C17 35, 14 44, 17 52 C20 59, 28 62, 34 62 C43 62, 50 56, 49 48 C49 40, 44 33, 40 28 C41 21, 38 14, 32 14 Z"
            fill="url(#pearGrad)"
            stroke="#558b2f"
            strokeWidth="2.5"
          />
          {/* Yorug'lik nuri (highlight) */}
          <ellipse cx="26" cy="42" rx="4" ry="7" transform="rotate(-25 26 42)" fill="rgba(255,255,255,0.45)" />
          <defs>
            <linearGradient id="pearGrad" x1="20" y1="14" x2="44" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cddc39" />
              <stop offset="60%" stopColor="#8bc34a" />
              <stop offset="100%" stopColor="#689f38" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'grape':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Novda va barg */}
          <path d="M32 12 C32 6, 36 4, 38 2" stroke="#5d4037" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 10 C39 6, 47 9, 49 14 C43 16, 36 14, 33 10 Z" fill="#66bb6a" stroke="#2e7d32" strokeWidth="1.5" />
          {/* Uzum donachalari */}
          <g filter="url(#dropGlow)">
            {/* 1-qator */}
            <circle cx="25" cy="22" r="7.5" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            <circle cx="39" cy="22" r="7.5" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            {/* 2-qator */}
            <circle cx="18" cy="33" r="7.5" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="8" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            <circle cx="46" cy="33" r="7.5" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            {/* 3-qator */}
            <circle cx="25" cy="43" r="7" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            <circle cx="39" cy="43" r="7" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
            {/* Pastki */}
            <circle cx="32" cy="52" r="6.5" fill="url(#grapeGrad)" stroke="#4a148c" strokeWidth="1.5" />
          </g>
          {/* Highlights */}
          <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.6)" />
          <circle cx="23" cy="20" r="1.8" fill="rgba(255,255,255,0.6)" />
          <circle cx="37" cy="20" r="1.8" fill="rgba(255,255,255,0.6)" />
          <defs>
            <linearGradient id="grapeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ab47bc" />
              <stop offset="50%" stopColor="#7b1fa2" />
              <stop offset="100%" stopColor="#4a148c" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'potion':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Probka */}
          <rect x="27" y="6" width="10" height="6" rx="2" fill="#d7a15c" stroke="#8d5b24" strokeWidth="1.5" />
          {/* Bo'yin */}
          <rect x="28" y="12" width="8" height="6" fill="#b3e5fc" stroke="#0288d1" strokeWidth="1.5" />
          <rect x="25" y="11" width="14" height="3" rx="1.5" fill="#e1f5fe" stroke="#0288d1" strokeWidth="1.5" />
          {/* Shisha idish */}
          <path
            d="M28 18 C28 22, 16 26, 16 40 C16 52, 22 58, 32 58 C42 58, 48 52, 48 40 C48 26, 36 22, 36 18 Z"
            fill="url(#potionLiquid)"
            stroke="#0288d1"
            strokeWidth="2.5"
          />
          {/* Suyuqlik darajasi va pufakchalar */}
          <path
            d="M17 38 C22 36, 26 40, 32 38 C38 36, 43 40, 47 38 C48 46, 44 56, 32 56 C20 56, 16 46, 17 38 Z"
            fill="url(#potionDeep)"
          />
          <circle cx="28" cy="48" r="2.5" fill="rgba(255,255,255,0.7)" />
          <circle cx="36" cy="44" r="1.8" fill="rgba(255,255,255,0.7)" />
          {/* Shisha yaltirashi */}
          <path d="M20 30 C19 36, 19 46, 22 52" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="potionLiquid" x1="32" y1="18" x2="32" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e1f5fe" />
              <stop offset="30%" stopColor="#81d4fa" />
              <stop offset="100%" stopColor="#0288d1" />
            </linearGradient>
            <linearGradient id="potionDeep" x1="32" y1="36" x2="32" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#29b6f6" />
              <stop offset="100%" stopColor="#01579b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'cookie':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Qovurg'ali pechenye cheti */}
          <g stroke="#b45309" strokeWidth="2.5">
            <circle cx="32" cy="32" r="26" fill="url(#cookieBase)" />
            {/* Tishli qirralar */}
            <circle cx="32" cy="32" r="24" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
          </g>
          {/* Ichki chuqurcha */}
          <circle cx="32" cy="32" r="15" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          {/* Murabbo / Djem markazi */}
          <circle cx="32" cy="32" r="9" fill="url(#jamGrad)" stroke="#b45309" strokeWidth="1.5" />
          <ellipse cx="30" cy="30" rx="3" ry="2" fill="rgba(255,255,255,0.6)" />
          <defs>
            <linearGradient id="cookieBase" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="jamGrad" x1="26" y1="26" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'paw':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Asosiy panja yostig'i */}
          <path
            d="M32 26 C22 26, 17 34, 20 45 C23 52, 28 56, 32 56 C36 56, 41 52, 44 45 C47 34, 42 26, 32 26 Z"
            fill="url(#pawBase)"
            stroke="#78350f"
            strokeWidth="2.5"
          />
          {/* Ichki doira */}
          <circle cx="32" cy="42" r="8" fill="#78350f" />
          <circle cx="32" cy="42" r="6" fill="#fbcfe8" />
          {/* 4 ta barmoq yostiqchalari */}
          <circle cx="17" cy="22" r="6.5" fill="url(#pawBase)" stroke="#78350f" strokeWidth="2" />
          <circle cx="17" cy="22" r="4" fill="#fbcfe8" />

          <circle cx="27" cy="14" r="7" fill="url(#pawBase)" stroke="#78350f" strokeWidth="2" />
          <circle cx="27" cy="14" r="4.5" fill="#fbcfe8" />

          <circle cx="37" cy="14" r="7" fill="url(#pawBase)" stroke="#78350f" strokeWidth="2" />
          <circle cx="37" cy="14" r="4.5" fill="#fbcfe8" />

          <circle cx="47" cy="22" r="6.5" fill="url(#pawBase)" stroke="#78350f" strokeWidth="2" />
          <circle cx="47" cy="22" r="4" fill="#fbcfe8" />
          <defs>
            <linearGradient id="pawBase" x1="20" y1="14" x2="44" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fba770" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* 3D yumaloq oltin yulduz */}
          <path
            d="M32 6 C33.5 6, 34.5 7, 36 10 L41 21 C41.8 22.8, 43.5 24, 45.5 24.3 L57 26 C60 26.5, 61 29.5, 59 31.5 L50.5 39.8 C49 41.2, 48.3 43.3, 48.7 45.3 L51 57 C51.5 60, 48.5 62, 46 60.5 L35.5 55 C33.5 54, 30.5 54, 28.5 55 L18 60.5 C15.5 62, 12.5 60, 13 57 L15.3 45.3 C15.7 43.3, 15 41.2, 13.5 39.8 L5 31.5 C3 29.5, 4 26.5, 7 26 L18.5 24.3 C20.5 24, 22.2 22.8, 23 21 L28 10 C29.5 7, 30.5 6, 32 6 Z"
            fill="url(#starGrad)"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Nur va ichki yaltiroqlik */}
          <ellipse cx="28" cy="22" rx="5" ry="3" transform="rotate(-30 28 22)" fill="rgba(255,255,255,0.6)" />
          <defs>
            <linearGradient id="starGrad" x1="16" y1="6" x2="48" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* 3D Yaltiroq pushti yurak */}
          <path
            d="M32 56 C20 46, 8 36, 8 23 C8 13, 16 7, 25 7 C29 7, 31 10, 32 12 C33 10, 35 7, 39 7 C48 7, 56 13, 56 23 C56 36, 44 46, 32 56 Z"
            fill="url(#heartGrad)"
            stroke="#9d174d"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Yaltiroq nur (specular highlight) */}
          <ellipse cx="21" cy="18" rx="6" ry="3.5" transform="rotate(-35 21 18)" fill="rgba(255,255,255,0.6)" />
          <defs>
            <linearGradient id="heartGrad" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'cherry':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          {/* Yashil barg va tutqichlar */}
          <path d="M22 10 C26 4, 34 5, 36 9 C32 12, 26 12, 22 10 Z" fill="#4caf50" stroke="#2e7d32" strokeWidth="1.5" />
          <path d="M30 8 C30 18, 22 28, 20 40" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 8 C32 18, 42 26, 44 40" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
          {/* 2 ta meva */}
          <circle cx="19" cy="45" r="12" fill="url(#cherryGrad1)" stroke="#881337" strokeWidth="2" />
          <circle cx="45" cy="45" r="12" fill="url(#cherryGrad2)" stroke="#881337" strokeWidth="2" />
          {/* Highlights */}
          <ellipse cx="15" cy="40" rx="3.5" ry="2" transform="rotate(-30 15 40)" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="41" cy="40" rx="3.5" ry="2" transform="rotate(-30 41 40)" fill="rgba(255,255,255,0.7)" />
          <defs>
            <linearGradient id="cherryGrad1" x1="12" y1="36" x2="26" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="40%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
            <linearGradient id="cherryGrad2" x1="38" y1="36" x2="52" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="40%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return <span>❓</span>;
  }
}
