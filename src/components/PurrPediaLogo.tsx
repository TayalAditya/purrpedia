interface LogoProps {
  size?: number;
  className?: string;
}

export default function PurrPediaLogo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="64" height="64" rx="14" fill="#08070A" />

      {/* Cat head */}
      <circle cx="32" cy="36" r="18" fill="#F97316" />

      {/* Left ear */}
      <polygon points="14,22 20,10 26,24" fill="#F97316" />
      {/* Left ear inner */}
      <polygon points="16.5,21 20,13 23.5,22" fill="#FBBF24" />

      {/* Right ear */}
      <polygon points="38,24 44,10 50,22" fill="#F97316" />
      {/* Right ear inner */}
      <polygon points="40.5,22 44,13 47.5,21" fill="#FBBF24" />

      {/* Left eye */}
      <ellipse cx="25" cy="34" rx="3.5" ry="4.2" fill="#08070A" />
      <circle cx="26.2" cy="32.8" r="1.3" fill="white" />

      {/* Right eye */}
      <ellipse cx="39" cy="34" rx="3.5" ry="4.2" fill="#08070A" />
      <circle cx="40.2" cy="32.8" r="1.3" fill="white" />

      {/* Nose */}
      <polygon points="32,39.5 29.5,43 34.5,43" fill="#1C1917" />

      {/* Mouth */}
      <path d="M 29.5 43 Q 32 45.5 34.5 43" stroke="#1C1917" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Left whiskers */}
      <line x1="13" y1="41" x2="27" y2="43.5" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13" y1="45.5" x2="27" y2="45.5" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="13" y1="50" x2="27" y2="47.5" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />

      {/* Right whiskers */}
      <line x1="37" y1="43.5" x2="51" y2="41" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="37" y1="45.5" x2="51" y2="45.5" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="37" y1="47.5" x2="51" y2="50" stroke="#1C1917" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
