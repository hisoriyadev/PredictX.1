// Skeleton loader components
export function SkeletonBlock({ className = "", style = {} }) {
  return (
    <div
      className={`rounded-lg shimmer ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <SkeletonBlock className="w-11 h-11 rounded-xl" />
        <SkeletonBlock className="w-12 h-6 rounded-full" />
      </div>
      <SkeletonBlock className="h-8 w-24 mb-2" />
      <SkeletonBlock className="h-4 w-32 mb-1" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  );
}

export function SkeletonChart({ height = 220 }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <SkeletonBlock className="h-4 w-40 mb-2" />
      <SkeletonBlock className="h-3 w-28 mb-5" />
      <div
        className="shimmer rounded-xl"
        style={{ height, background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {[140, 80, 60, 70, 60, 90].map((w, i) => (
        <td key={i} className="py-3.5 pr-4">
          <SkeletonBlock style={{ height: 14, width: w, borderRadius: 6 }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => <SkeletonCard key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><SkeletonChart height={220} /></div>
        <SkeletonChart height={220} />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><SkeletonChart height={200} /></div>
        <SkeletonChart height={200} />
      </div>
    </div>
  );
}
