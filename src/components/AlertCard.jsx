import { AlertTriangle, Zap, Eye } from "lucide-react";

// Alert / Opportunity alert card
export default function AlertCard({ message, type = "info", index = 0 }) {
  const styles = {
    info: {
      bg: "rgba(6,182,212,0.08)",
      border: "rgba(6,182,212,0.25)",
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      badge: "bg-cyan-500/15 text-cyan-400",
      label: "Opportunity",
    },
    warning: {
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.25)",
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      badge: "bg-amber-500/15 text-amber-400",
      label: "Watch",
    },
    success: {
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.25)",
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      badge: "bg-emerald-500/15 text-emerald-400",
      label: "Alert",
    },
    danger: {
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.25)",
      icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
      badge: "bg-red-500/15 text-red-400",
      label: "Risk",
    },
  };
  const s = styles[type] || styles.info;

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.01]"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}
      >
        {s.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
          <span className="text-xs text-slate-500">Alert #{index + 1}</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
