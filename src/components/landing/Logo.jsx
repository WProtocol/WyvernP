export function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <polygon points="15,2 27,9 23,28 7,28 3,9" fill="rgba(139,127,255,0.08)" stroke="#8b7fff" strokeWidth="1.2"/>
      <path d="M15 6 C9 11 7 18 8 26 L15 23 L22 26 C23 18 21 11 15 6Z" fill="#8b7fff" opacity="0.25"/>
      <line x1="15" y1="6" x2="15" y2="26" stroke="#8b7fff" strokeWidth="0.8" opacity="0.6"/>
      <circle cx="15" cy="6" r="2.5" fill="#8b7fff"/>
      <circle cx="8"  cy="26" r="1.5" fill="#22d3ee" opacity="0.7"/>
      <circle cx="22" cy="26" r="1.5" fill="#22d3ee" opacity="0.7"/>
    </svg>
  );
}
