import React, { useMemo } from 'react';

interface KolamRosetteProps {
  progress?: number; // 0 to 1
  size?: number;
  className?: string;
  isHolding?: boolean;
}

export const KolamRosette: React.FC<KolamRosetteProps> = ({
  progress = 0,
  size = 220,
  className = '',
  isHolding = false
}) => {
  // Generate closed rosette path: r = 88 + 6*cos(8*t), point (100 + r*cos(t), 100 + r*sin(t))
  const pathData = useMemo(() => {
    const points: string[] = [];
    const steps = 360;
    for (let i = 0; i <= steps; i++) {
      const t = (i * Math.PI * 2) / steps;
      const r = 88 + 6 * Math.cos(8 * t);
      const x = 100 + r * Math.cos(t);
      const y = 100 + r * Math.sin(t);
      if (i === 0) {
        points.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
      } else {
        points.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
      }
    }
    points.push('Z');
    return points.join(' ');
  }, []);

  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const dashOffset = 1 - clampedProgress;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Faint static copy in --line */}
      <path
        d={pathData}
        fill="none"
        stroke="var(--line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Animated active rosette in accent color (marigold) */}
      <path
        d={pathData}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={dashOffset}
        style={{
          transition: isHolding ? 'stroke-dashoffset 50ms linear' : 'stroke-dashoffset 200ms ease-out'
        }}
      />
    </svg>
  );
};
