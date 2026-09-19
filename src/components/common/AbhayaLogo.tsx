import React from 'react';

interface AbhayaLogoProps {
  className?: string;
  strokeWidth?: number;
}

export const AbhayaLogo: React.FC<AbhayaLogoProps> = ({
  className = 'w-6 h-6',
  strokeWidth = 2.6
}) => {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M6 28V15a10 10 0 0 1 20 0v13"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="16" cy="18" r="3.2" fill="var(--accent)" />
    </svg>
  );
};
