import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Download, Bookmark, TrendingUp, Brain, Shield, BarChart2, Globe, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import api from "../services/api.js";
import ScoreRing from "../components/ScoreRing.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { useToast } from "../components/Toast.jsx";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(8,12,30,0.92)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "0.875rem", padding: "0.75rem 1rem", backdropFilter: "blur(24px)" }}>
      <p className="text-slate-400 text-xs mb-1.5">{label}</p>
      {payload.map((p) => (<p key={p.name} style={{ color: p.color }} className="text-xs font-bold">{p.name}: {p.value}</p>))}
    </div>
  );
};

export default function ReportPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/report/${id}`);
        setResult(res.data.data);
      } catch {
        toast.error("Error", "Could not load report.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `predictx-${result.keyword?.replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
    toast.info("Exported", "Report saved as JSON.");
  };

  const handleSave = async () => {
    try {
      await api.post("/api/report/save", { searchId: id });
      toast.success("Saved!", "Report bookmarked successfully.");
    } catch {
      toast.error("Error", "Could not save report.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center"><div className="spinner mx-auto mb-4" style={{ width: 48, height: 48 }} /><p className="text-slate-500 text-sm">Loading report…</p></div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
      <AlertTriangle className="w-10 h-10 text-amber-400" />
      <h2 className="text-xl font-bold text-white">Report not found</h2>
      <Link to="/history"><button className="btn-primary py-2.5 px-5 text-sm relative z-10">Back to History</button></Link>
    </div>
  );

  const recConfig = result.recommendation === "Launch Now"
    ? { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)", text: "text-emerald-400", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> }
    : result.recommendation === "Watch Closely"
    ? { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", text: "text-amber-400", icon: <AlertTriangle className="w-5 h-5 text-amber-400" /> }
    : { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", text: "text-red-400", icon: <AlertTriangle className="w-5 h-5 text-red-400" /> };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 animate-fade-in-up">
          <div>
            <Link to="/history" className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 mb-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to History
            </Link>
            <h1 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Report: <span className="glow-text">"{result.keyword}"</span>
            </h1>
            <p className="text-slate-600 text-xs mt-1">{new Date(result.createdAt || result.analysisDate).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-outline flex items-center gap-2 text-sm py-2 px-4"><Bookmark className="w-3.5 h-3.5" /> Save</button>
            <button onClick={handleExport} className="btn-outline flex items-center gap-2 text-sm py-2 px-4"><Download className="w-3.5 h-3.5" /> Export</button>
          </div>
        </div>

        <div className="space-y-5 animate-scale-in">
          {/* Top Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-6 glow-border flex flex-col items-center justify-center gap-2">
              <ScoreRing score={result.trendScore} size={130} strokeWidth={10} />
              <p className="text-xs text-slate-600">Trend Score</p>
            </div>
            <div className="glass-card p-5 glow-border" style={{ background: "linear-gradient(145deg,rgba(16,185,129,0.07),rgba(6,182,212,0.04))" }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mb-4"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
              <div className="text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">{result.growth}</div>
              <div className="text-sm font-bold text-slate-300 mt-1">Growth Rate</div>
            </div>
            <div className="glass-card p-5 glow-border" style={{ background: "linear-gradient(145deg,rgba(168,85,247,0.07),rgba(99,102,241,0.04))" }}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/12 border border-purple-500/25 flex items-center justify-center mb-4"><Brain className="w-5 h-5 text-purple-400" /></div>
              <div className={`text-2xl font-extrabold font-['Space_Grotesk'] ${result.sentiment?.label === "Positive" ? "text-emerald-400" : result.sentiment?.label === "Neutral" ? "text-slate-300" : "text-red-400"}`}>{result.sentiment?.label}</div>
              <div className="text-sm font-bold text-slate-300 mt-1">Sentiment</div>
              <div className="text-xs text-slate-600 mt-1">Score: {result.sentiment?.score}/100</div>
            </div>
            <div className="glass-card p-5" style={{ background: recConfig.bg, border: `1px solid ${recConfig.border}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: recConfig.bg, border: `1px solid ${recConfig.border}` }}>{recConfig.icon}</div>
              <div className={`text-xl font-extrabold font-['Space_Grotesk'] ${recConfig.text}`}>{result.recommendation}</div>
              <div className="text-sm font-bold text-slate-300 mt-1">Recommendation</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass-card p-6 glow-border">
              <div className="flex items-center gap-2 mb-4"><BarChart2 className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-bold text-white">Score History</h3></div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.trendHistory || []} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card p-6 glow-border">
              <div className="flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-bold text-white">Sentiment by Platform</h3></div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={result.sources || []} barSize={22} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <XAxis dataKey="source" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sentiment" fill="#06b6d4" radius={[5, 5, 0, 0]} name="Sentiment %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Opportunities & Competitors */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass-card p-6 glow-border">
              <div className="flex items-center gap-2 mb-5"><Zap className="w-4 h-4 text-indigo-400" /><h3 className="text-sm font-bold text-white">Opportunities</h3></div>
              <div className="space-y-3">
                {(result.opportunities || []).map((opp, i) => (<AlertCard key={i} message={opp} type="info" index={i} />))}
              </div>
            </div>
            <div className="glass-card p-6 glow-border">
              <div className="flex items-center gap-2 mb-5"><Shield className="w-4 h-4 text-purple-400" /><h3 className="text-sm font-bold text-white">Competitors</h3></div>
              <div className="space-y-3">
                {(result.competitors || []).map((c) => (
                  <div key={c.name} className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-slate-600">Share: {c.marketShare}%</div>
                    </div>
                    <span className={`text-sm font-extrabold ${c.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>{c.growth >= 0 ? "+" : ""}{c.growth}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
