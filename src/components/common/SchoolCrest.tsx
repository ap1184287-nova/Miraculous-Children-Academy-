import React from 'react';

interface SchoolCrestProps {
  className?: string;
}

export const SchoolCrest: React.FC<SchoolCrestProps> = ({ className = 'w-14 h-14' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Miraculous Children Academy Emblem"
    >
      <path
        d="M32 4L56 12V31C56 45.8 45.7 56.6 32 60C18.3 56.6 8 45.8 8 31V12L32 4Z"
        fill="var(--color-royal-900, #0F2859)"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
      <path
        d="M32 9L51 15.5V31C51 42.9 42.9 51.6 32 54.6C21.1 51.6 13 42.9 13 31V15.5L32 9Z"
        stroke="#D4AF37"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <path
        d="M20 26.5C23.5 24.5 28 24.5 32 27C36 24.5 40.5 24.5 44 26.5V40.5C40.5 38.8 36 38.8 32 41C28 38.8 23.5 38.8 20 40.5V26.5Z"
        fill="#FFFFFF"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 27V41" stroke="var(--color-royal-900, #0F2859)" strokeWidth="1.5" />
      <path
        d="M32 15L33.9 19.2L38.5 19.8L35.1 22.9L36 27.4L32 25.1L28 27.4L28.9 22.9L25.5 19.8L30.1 19.2L32 15Z"
        fill="#D4AF37"
      />
    </svg>
  );
};
