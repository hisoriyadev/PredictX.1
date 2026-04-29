import { useState, useEffect } from "react";
import api from "../services/api.js";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, Activity, Bell, Layers, Download,
  RefreshCw, Zap, AlertTriangle, CheckCircle, ArrowUpRight
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { SkeletonDashboard } from "../components/Skeleton.jsx";
import { useToast } from "../components/Toast.jsx";

const COLORS = ["#6366f1", "#10b981", "#06b6d4", "#a855f7", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(8,12,30,0.92)",
      border: "1px solid rgba(99,102,241,0.35)",
      borderRadius: "0.875rem",
      padding: "0.75rem 1rem",
      backdropFilter: "blur(24px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <p className="text-slate-400 text-xs mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs font-bold">
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

function SectionHeader({ icon: Icon, title, sub, color = "indigo" }) {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/dashboard-data");
      setData(res.data.data);
      if (silent) toast.success("Dashboard refreshed", "Latest market data loaded.");
    } catch {
      setError("Could not reach the API server.");
      toast.error("Connection failed", "Could not connect to the API server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictx-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="h-5 w-48 rounded-lg shimmer mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-9 w-64 rounded-lg shimmer" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-6 gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Server not connected</h3>
          <p className="text-slate-400 text-sm max-w-md">{error}</p>
        </div>
        <button onClick={fetchData} className="btn-primary flex items-center gap-2 relative z-10">
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const { overallMetrics, recentAnalyses, marketOverview, weeklyActivity } = data;
  const topTrend = recentAnalyses?.[0];

  const total = marketOverview.reduce((a, c) => a + c.value, 0);
  const pieData = marketOverview.map((d) => ({
    ...d,
    value: Math.round((d.value / total) * 100),
  }));

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-1">
              Market Dashboard
            </h1>
            <p className="text-slate-500 text-sm">AI-powered trend analytics · Real-time data</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={() => fetchData(true)}
              className="btn-outline flex items-center gap-2 py-2.5 px-4 text-sm">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={() => { handleExport(); toast.success("Report exported", "JSON file saved to your downloads."); }}
              className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm relative z-10">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="animate-pop-in delay-100"><StatCard icon={Activity}   label="Total Analyses"   value={overallMetrics.totalAnalyses.toLocaleString()} sub="All time"      color="indigo" trend={12} /></div>
          <div className="animate-pop-in delay-200"><StatCard icon={TrendingUp} label="Trends Tracked"   value={overallMetrics.trendsTracked.toLocaleString()} sub="Active"        color="purple" trend={8}  /></div>
          <div className="animate-pop-in delay-300"><StatCard icon={Bell}       label="Alerts Generated" value={overallMetrics.alertsGenerated}               sub="This month"   color="cyan"   trend={24} /></div>
          <div className="animate-pop-in delay-400"><StatCard icon={Zap}        label="Accuracy Rate"   value={overallMetrics.accuracyRate}                  sub="AI predictions" color="green" trend={3}  /></div>
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5 animate-blur-in" style={{ animationDelay: "0.35s" }}>

          {/* Line Chart */}
          <div className="lg:col-span-2 glass-card p-6 glow-border">
            <div className="flex items-start justify-between mb-5">
              <SectionHeader icon={TrendingUp} title="Trend Growth Over Time" sub="Monthly score & search volume" color="indigo" />
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full border"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  borderColor: "rgba(99,102,241,0.25)",
                  color: "#a5b4fc",
                }}
              >
                {topTrend?.keyword}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={topTrend?.trendHistory || []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Score" activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                <Line type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={1.5} dot={false} name="Volume" strokeDasharray="5 4" activeDot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="glass-card p-6 glow-border">
            <SectionHeader icon={Layers} title="Market Sector Share" sub="By industry" color="purple" />
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6 animate-blur-in" style={{ animationDelay: "0.5s" }}>

          {/* Bar Chart */}
          <div className="lg:col-span-2 glass-card p-6 glow-border">
            <SectionHeader icon={Activity} title="Weekly Activity" sub="Analyses and alerts by day" color="cyan" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity} barSize={14} barGap={6} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b", paddingTop: "8px" }} />
                <Bar dataKey="analyses" fill="#6366f1" radius={[4, 4, 0, 0]} name="Analyses" />
                <Bar dataKey="alerts"   fill="#06b6d4" radius={[4, 4, 0, 0]} name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts Panel */}
          <div className="glass-card p-6 glow-border">
            <SectionHeader icon={Bell} title="Live Alerts" sub="Latest AI signals" color="indigo" />
            <div className="space-y-2.5">
              {recentAnalyses.slice(0, 4).map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.03] group"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ring-4 ${
                    a.recommendation === "Launch Now"
                      ? "bg-emerald-400 ring-emerald-500/20"
                      : a.recommendation === "Watch Closely"
                      ? "bg-amber-400 ring-amber-500/20"
                      : "bg-red-400 ring-red-500/20"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-white truncate">{a.keyword}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        a.recommendation === "Launch Now"   ? "bg-emerald-500/15 text-emerald-400" :
                        a.recommendation === "Watch Closely"? "bg-amber-500/15 text-amber-400"   :
                        "bg-red-500/15 text-red-400"
                      }`}>{a.recommendation}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Score <span className="text-slate-300 font-semibold">{a.trendScore}</span> · <span className="text-emerald-400 font-semibold">{a.growth}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Analyses Table ── */}
        <div className="glass-card p-6 glow-border animate-blur-in" style={{ animationDelay: "0.65s" }}>
          <div className="flex items-center justify-between mb-6">
            <SectionHeader icon={Layers} title="Recent Trend Analyses" sub={`${recentAnalyses.length} results`} color="indigo" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Keyword", "Score", "Growth", "Sentiment", "Risk", "Recommendation"].map((h) => (
                    <th key={h} className="pb-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-widest pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((a, i) => (
                  <tr
                    key={i}
                    className="group transition-colors duration-150 hover:bg-white/[0.025]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-white text-sm">{a.keyword}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${a.trendScore}%`,
                              background: a.trendScore >= 75 ? "linear-gradient(90deg,#10b981,#06b6d4)" :
                                          a.trendScore >= 50 ? "linear-gradient(90deg,#f59e0b,#f97316)" :
                                          "linear-gradient(90deg,#ef4444,#f97316)",
                            }}
                          />
                        </div>
                        <span className="text-sm font-extrabold text-white font-['Space_Grotesk']">{a.trendScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-emerald-400 font-bold text-sm">{a.growth}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        a.sentiment.label === "Positive" ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20" :
                        a.sentiment.label === "Neutral"  ? "bg-slate-500/12 text-slate-400 border border-slate-500/20"   :
                        "bg-red-500/12 text-red-400 border border-red-500/20"
                      }`}>{a.sentiment.label}</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        a.riskLevel === "Low"    ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20" :
                        a.riskLevel === "Medium" ? "bg-amber-500/12 text-amber-400 border border-amber-500/20"   :
                        "bg-red-500/12 text-red-400 border border-red-500/20"
                      }`}>{a.riskLevel}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        {a.recommendation === "Launch Now"
                          ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        <span className="text-slate-300 text-xs font-semibold">{a.recommendation}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
