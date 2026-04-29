import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

export default function IntroLoader({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 1800);
    const t3 = setTimeout(() => onDone?.(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg,#05060f 0%,#0d0a2e 50%,#05060f 100%)",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 70%)"
      }} />

      {/* Logo + wordmark */}
      <div
        style={{
          opacity: phase === "enter" ? 0 : 1,
          transform: phase === "enter" ? "scale(0.8) translateY(20px)" : "scale(1) translateY(0)",
          transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        className="flex flex-col items-center gap-5"
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)",
            boxShadow: "0 0 60px rgba(99,102,241,0.7), 0 0 120px rgba(168,85,247,0.3)",
          }}
        >
          <TrendingUp className="w-9 h-9 text-white" />
        </div>

        {/* Name */}
        <div className="text-center">
          <div
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.5rem,6vw,4rem)",
              background: "linear-gradient(135deg,#a5b4fc,#e879f9,#22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PredictX
          </div>
          <div className="text-slate-500 text-sm font-semibold tracking-[0.2em] uppercase mt-1"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            AI Market Oracle
          </div>
        </div>

        {/* Loading bar */}
        <div
          className="w-32 h-[2px] rounded-full overflow-hidden mt-2"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#6366f1,#a855f7,#06b6d4)",
              width: phase === "enter" ? "0%" : phase === "hold" ? "70%" : "100%",
              transition: phase === "enter"
                ? "width 0.5s ease"
                : phase === "hold"
                ? "width 0.8s ease"
                : "width 0.5s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
