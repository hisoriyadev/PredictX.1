import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  error:   <XCircle    className="w-4 h-4 text-red-400 flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
  info:    <Info       className="w-4 h-4 text-indigo-400 flex-shrink-0" />,
};

const STYLES = {
  success: { border: "rgba(16,185,129,0.35)",  bg: "rgba(16,185,129,0.08)",  bar: "#10b981" },
  error:   { border: "rgba(239,68,68,0.35)",   bg: "rgba(239,68,68,0.08)",   bar: "#ef4444" },
  warning: { border: "rgba(245,158,11,0.35)",  bg: "rgba(245,158,11,0.08)",  bar: "#f59e0b" },
  info:    { border: "rgba(99,102,241,0.35)",  bg: "rgba(99,102,241,0.08)",  bar: "#6366f1" },
};

function ToastItem({ id, type = "info", title, message, onRemove }) {
  const [visible, setVisible] = useState(false);
  const s = STYLES[type] || STYLES.info;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 350);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl flex items-start gap-3 p-4 pr-10 min-w-[280px] max-w-sm w-full"
      style={{
        background: `rgba(8,12,30,0.92)`,
        border: `1px solid ${s.border}`,
        backdropFilter: "blur(28px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.9)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: s.bar }} />

      <div className="mt-0.5">{ICONS[type]}</div>
      <div className="flex-1 min-w-0">
        {title && <div className="text-sm font-bold text-white mb-0.5">{title}</div>}
        {message && <div className="text-xs text-slate-400 leading-relaxed">{message}</div>}
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-slate-600 hover:text-slate-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-[3px] right-0 h-[2px] opacity-40"
        style={{
          background: `linear-gradient(90deg, ${s.bar}, transparent)`,
          animation: "toastProgress 4s linear forwards",
        }}
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-24 right-4 z-[999] flex flex-col gap-2.5 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return {
    success: (title, msg) => ctx("success", title, msg),
    error:   (title, msg) => ctx("error",   title, msg),
    warning: (title, msg) => ctx("warning", title, msg),
    info:    (title, msg) => ctx("info",    title, msg),
  };
}
