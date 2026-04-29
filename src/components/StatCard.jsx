import { useRef, useEffect, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter.jsx";

export default function StatCard({ icon: Icon, label, value, sub, color = "indigo", trend }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const palette = {
    indigo: { bg:"rgba(99,102,241,0.08)",  border:"rgba(99,102,241,0.22)",  glow:"rgba(99,102,241,0.12)",  icon:"text-indigo-400",  iconBg:"rgba(99,102,241,0.15)",  iconBorder:"rgba(99,102,241,0.3)",  bar:"#6366f1" },
    purple: { bg:"rgba(168,85,247,0.08)",  border:"rgba(168,85,247,0.22)",  glow:"rgba(168,85,247,0.12)",  icon:"text-purple-400",  iconBg:"rgba(168,85,247,0.15)",  iconBorder:"rgba(168,85,247,0.3)",  bar:"#a855f7" },
    cyan:   { bg:"rgba(6,182,212,0.08)",   border:"rgba(6,182,212,0.22)",   glow:"rgba(6,182,212,0.12)",   icon:"text-cyan-400",    iconBg:"rgba(6,182,212,0.15)",   iconBorder:"rgba(6,182,212,0.3)",   bar:"#06b6d4" },
    green:  { bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.22)",  glow:"rgba(16,185,129,0.12)",  icon:"text-emerald-400", iconBg:"rgba(16,185,129,0.15)",  iconBorder:"rgba(16,185,129,0.3)",  bar:"#10b981" },
    amber:  { bg:"rgba(245,158,11,0.08)",  border:"rgba(245,158,11,0.22)",  glow:"rgba(245,158,11,0.12)",  icon:"text-amber-400",   iconBg:"rgba(245,158,11,0.15)",  iconBorder:"rgba(245,158,11,0.3)",  bar:"#f59e0b" },
  };
  const c = palette[color] || palette.indigo;

  // Determine if value is numeric for counter animation
  const isNumeric = !isNaN(parseFloat(String(value).replace(/[^0-9.]/g, "")));

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group cursor-default"
      style={{
        background: `linear-gradient(145deg, ${c.bg} 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`,
        backdropFilter: "blur(20px)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, scale 0.3s ease",
      }}
    >
      {/* Glow spot */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
        style={{ background: c.glow, transform: "translate(30%,-30%)" }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}`, boxShadow: `0 4px 12px ${c.glow}` }}
          >
            {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
          </div>
          {trend !== undefined && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              trend >= 0
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                : "bg-red-500/15 text-red-400 border border-red-500/25"
            }`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>

        <div className="text-2xl font-extrabold text-white mb-1 font-['Space_Grotesk'] tracking-tight">
          {isNumeric && inView
            ? <AnimatedCounter value={value} duration={1400} />
            : value}
        </div>
        <div className="text-sm font-semibold text-slate-300">{label}</div>
        {sub && <div className="text-xs text-slate-600 mt-0.5">{sub}</div>}
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${c.bar}, transparent)` }}
      />
    </div>
  );
}
