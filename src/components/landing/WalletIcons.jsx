// Recognizable SVG versions of Phantom, Solflare, and Backpack wallet logos

export const PhantomIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" style={{ borderRadius: size * 0.22, display: "block" }}>
    <rect width="128" height="128" fill="#AB9FF2" />
    {/* chubby ghost with wavy bottom */}
    <path
      d="M30 66c0-19 15-34 34-34s34 15 34 34v30c0 2-2 3-4 2l-7-5c-2-1-4-1-6 1l-4 4c-2 2-5 2-7 0l-4-4c-2-2-5-2-7 0l-4 4c-2 2-5 2-7 0l-4-4c-2-2-5-2-7 0l-5 4c-2 1-4 0-4-2 0-2 0-4 1-6V66z"
      fill="#FFFDF8"
    />
    {/* two eyes on the right side, signature Phantom look */}
    <ellipse cx="70" cy="58" rx="4" ry="6" fill="#1A1240" />
    <ellipse cx="86" cy="58" rx="4" ry="6" fill="#1A1240" />
  </svg>
);

export const SolflareIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" style={{ borderRadius: size * 0.22, display: "block" }}>
    <rect width="128" height="128" fill="#FEE94B" />
    {/* stylized angular S monogram */}
    <path
      d="M36 28 L92 28 L92 46 L58 46 Q48 46 48 54 Q48 60 56 62 L76 66 Q100 70 100 90 Q100 108 84 112 L28 112 L28 94 L72 94 Q82 94 82 86 Q82 80 74 78 L54 74 Q30 70 30 50 Q30 30 36 28 Z"
      fill="#1A1A1A"
    />
    {/* diagonal slash through middle */}
    <path
      d="M14 82 L114 58 L116 68 L16 92 Z"
      fill="#1A1A1A"
    />
  </svg>
);

export const BackpackIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 128 128" style={{ borderRadius: size * 0.22, display: "block" }}>
    <rect width="128" height="128" fill="#FFFFFF" />
    {/* top strap/handle */}
    <path d="M50 24 Q64 18 78 24 L76 32 Q64 28 52 32 Z" fill="#E33E3F" />
    {/* main body (rounded top) */}
    <path
      d="M34 38 Q34 32 40 32 h48 Q94 32 94 38 V76 h-60 Z"
      fill="#E33E3F"
    />
    {/* body fills out as rounded rectangle */}
    <path
      d="M34 38 h60 V76 h-60 Z M34 50 Q34 38 46 38 h36 Q94 38 94 50 V76 h-60 Z"
      fill="#E33E3F"
    />
    <rect x="28" y="46" width="72" height="36" rx="10" fill="#E33E3F" />
    {/* front pocket circle with inner */}
    <circle cx="64" cy="60" r="10" fill="#FFFFFF" />
    <circle cx="64" cy="60" r="5" fill="#E33E3F" />
    {/* bottom compartment */}
    <rect x="30" y="88" width="68" height="18" rx="6" fill="#E33E3F" />
  </svg>
);
