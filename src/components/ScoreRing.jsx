import { useEffect, useRef, useState } from "react";

export default function ScoreRing({ score = 0, size = 160, strokeWidth = 12 }) {
  const [animated, setAnimated] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(score * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animated / 100) * circumference;
  const outerRadius = (size - 4) / 2;

  const getTheme = () => {
    if (score >= 75) return {
      c1: "#10b981", c2: "#06b6d4",
      glow: "rgba(16,185,129,0.45)", glowFar: "rgba(6,182,212,0.2)",
      label: "Excellent", labelColor: "#34d399",
    };
    if (score >= 50) return {
      c1: "#f59e0b", c2: "#f97316",
      glow: "rgba(245,158,11,0.45)", glowFar: "rgba(249,115,22,0.2)",
      label: "Moderate", labelColor: "#fbbf24",
    };
    return {
      c1: "#ef4444", c2: "#ec4899",
      glow: "rgba(239,68,68,0.45)", glowFar: "rgba(236,72,153,0.2)",
      label: "Low", labelColor: "#f87171",
    };
  };

  const { c1, c2, glow, glowFar, label, labelColor } = getTheme();
  const gradId = `ring-g-${Math.round(score)}`;
  const filterId = `ring-f-${Math.round(score)}`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer pulse ring */}
      <div
        className="absolute rounded-full animate-glow-pulse"
        style={{
          width: size + 16,
          height: size + 16,
          top: -8, left: -8,
          borderRadius: "50%",
          border: `1px solid ${glow}`,
          boxShadow: `0 0 20px ${glowFar}, inset 0 0 20px ${glowFar}`,
          animation: "glowPulse 2.5s ease-in-out infinite",
        }}
      />

      <svg width={size} height={size} className="rotate-[-90deg]" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track ring */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />

        {/* Glow duplicate (blurred) */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={`url(#${gradId})`} strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          opacity="0.35" filter={`url(#${filterId})`}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
        />

        {/* Main arc */}
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={`url(#${gradId})`} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white font-['Outfit'] tracking-tight leading-none" style={{ textShadow: `0 0 20px ${glow}` }}>
          {animated}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: labelColor }}>
          {label}
        </span>
      </div>
    </div>
  );
}
