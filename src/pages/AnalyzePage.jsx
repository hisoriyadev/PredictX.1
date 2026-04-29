import { useState } from "react";
import api from "../services/api.js";
import useAuth from "../hooks/useAuth.js";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Search, TrendingUp, Brain, Shield, Zap, AlertTriangle,
  CheckCircle, BarChart2, Globe, RefreshCw, Download, Sparkles
} from "lucide-react";
import ScoreRing from "../components/ScoreRing.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { useToast } from "../components/Toast.jsx";

const SAMPLE_KEYWORDS = [
  "eco-friendly bottles", "AI wearables", "vertical farming",
  "neuro gaming", "quantum SaaS", "sleep tech",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(8,12,30,0.92)",
      border: "1px solid rgba(99,102,241,0.35)",
      borderRadius: "0.875rem",
      padding: "0.75rem 1rem",
      backdropFilter: "blur(24px)",
    }}>
      <p className="text-slate-400 text-xs mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs font-bold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const LoadingSteps = () => {
  const steps = [
    "Scanning Reddit & Twitter signals",
    "Pulling Google Trends data",
    "Analysing news sentiment",
    "Scoring competitor saturation",
    "Generating AI forecast…",
  ];
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="relative mx-auto mb-8 w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        {/* Spinner */}
        <div className="spinner absolute inset-0" style={{ width: "80px", height: "80px" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-7 h-7 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <h3 className="text-white font-bold text-lg mb-2 font-['Space_Grotesk']">Analyzing market signals</h3>
      <p className="text-slate-500 text-sm mb-6">Processing millions of data points…</p>
      <div className="space-y-2.5 text-left max-w-xs mx-auto">
        {steps.map((msg, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.25}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 0.25}s` }} />
            <span className="text-sm text-slate-400">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AnalyzePage() {
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const analyze = async (kw) => {
    const target = (kw || keyword).trim();
    if (!target) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await api.post("/api/analyze-trend", { keyword: target });
      setResult(res.data.data);
      setKeyword(target);
      toast.success("Analysis complete", `Trend score: ${res.data.data.trendScore}/100 · ${res.data.data.recommendation}`);
    } catch {
      setError("Could not reach the API server.");
      toast.error("Analysis failed", "Could not connect to the API server.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictx-${result.keyword.replace(/\s+/g, "-")}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.info("Report exported", "JSON analysis file saved to your downloads.");
  };

  const recConfig = result?.recommendation === "Launch Now"
    ? { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)", text: "text-emerald-400", icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, glow: "0 0 30px rgba(16,185,129,0.2)" }
    : result?.recommendation === "Watch Closely"
    ? { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", text: "text-amber-400",   icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,   glow: "0 0 30px rgba(245,158,11,0.2)" }
    : { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.3)",  text: "text-red-400",     icon: <AlertTriangle className="w-5 h-5 text-red-400" />,     glow: "0 0 30px rgba(239,68,68,0.2)" };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ── */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">AI Trend Analyzer</span>
          </div>
          <h1 className="section-title text-white mb-3">
            Analyze Any <span className="glow-text">Market Trend</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Enter a keyword, product, or industry. Our AI scans millions of signals and returns a comprehensive market forecast.
          </p>
        </div>

        {/* ── Search Box ── */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div
            className="rounded-2xl p-1.5 flex gap-2"
            style={{
              background: "rgba(10,15,40,0.7)",
              border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.05)",
            }}
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-4.5 h-4.5 text-slate-600 flex-shrink-0 w-5 h-5" />
              <input
                id="trend-search"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder="e.g. eco-friendly bottles, AI wearables…"
                className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm py-2.5 font-medium"
              />
              {keyword && (
                <button onClick={() => { setKeyword(""); setResult(null); }}
                  className="text-slate-600 hover:text-slate-400 text-xs transition-colors px-1">✕</button>
              )}
            </div>
            <button
              id="analyze-btn"
              onClick={() => analyze()}
              disabled={loading || !keyword.trim()}
              className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 relative z-10 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>

          {/* Sample chips */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <span className="text-xs text-slate-600 self-center">Try:</span>
            {SAMPLE_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => analyze(kw)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 transition-all duration-200 hover:text-indigo-300 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)";
                  e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <LoadingSteps />}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="space-y-5 animate-scale-in">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Analysis: <span className="glow-text">"{result.keyword}"</span>
                </h2>
                <p className="text-slate-600 text-xs mt-1">
                  {new Date(result.analysisDate).toLocaleString()} · {result.sources.length} sources scanned
                </p>
              </div>
              <button onClick={handleExport} className="btn-outline flex items-center gap-2 text-sm py-2 px-4 self-start sm:self-auto">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>

            {/* ── Top 4 Cards ── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Score Ring */}
              <div className="sm:row-span-1 glass-card p-6 glow-border flex flex-col items-center justify-center gap-2">
                <ScoreRing score={result.trendScore} size={140} strokeWidth={11} />
                <p className="text-xs text-slate-600 font-medium">Trend Score /100</p>
              </div>

              {/* Growth */}
              <div className="glass-card p-5 glow-border flex flex-col justify-between"
                style={{ background: "linear-gradient(145deg,rgba(16,185,129,0.07),rgba(6,182,212,0.04))" }}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk'] tracking-tight">{result.growth}</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">Growth Rate</div>
                  <div className="text-xs text-slate-600 mt-0.5">Month-over-month</div>
                </div>
              </div>

              {/* Sentiment */}
              <div className="glass-card p-5 glow-border flex flex-col justify-between"
                style={{ background: "linear-gradient(145deg,rgba(168,85,247,0.07),rgba(99,102,241,0.04))" }}>
                <div className="w-10 h-10 rounded-xl bg-purple-500/12 border border-purple-500/25 flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className={`text-2xl font-extrabold font-['Space_Grotesk'] tracking-tight ${
                    result.sentiment.label === "Positive" ? "text-emerald-400" :
                    result.sentiment.label === "Neutral"  ? "text-slate-300"   : "text-red-400"
                  }`}>{result.sentiment.label}</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">Market Sentiment</div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400"
                      style={{ width: `${result.sentiment.score}%`, transition: "width 1s ease" }} />
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Score: {result.sentiment.score}/100</div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="glass-card p-5 flex flex-col justify-between"
                style={{ background: recConfig.bg, border: `1px solid ${recConfig.border}`, boxShadow: recConfig.glow }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: recConfig.bg, border: `1px solid ${recConfig.border}` }}>
                  {recConfig.icon}
                </div>
                <div>
                  <div className={`text-xl font-extrabold font-['Space_Grotesk'] ${recConfig.text}`}>{result.recommendation}</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">AI Recommendation</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      result.riskLevel === "Low"    ? "bg-emerald-500/15 text-emerald-400" :
                      result.riskLevel === "Medium" ? "bg-amber-500/15 text-amber-400"   :
                      "bg-red-500/15 text-red-400"
                    }`}>Risk: {result.riskLevel}</span>
                    <span className="text-xs text-slate-500">Market: {result.marketSize}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Charts ── */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Trend History */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">12-Month Score History</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 ml-6">Trend momentum over time</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={result.trendHistory} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Score"
                      activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sentiment by Source */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Sentiment by Platform</h3>
                </div>
                <p className="text-xs text-slate-600 mb-4 ml-6">Positivity score per source</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={result.sources} barSize={22} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <XAxis dataKey="source" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="sentiment" fill="#06b6d4" radius={[5, 5, 0, 0]} name="Sentiment %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Opportunities + Competitors ── */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Opportunities */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/12 border border-indigo-500/25 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Opportunity Alerts</h3>
                    <p className="text-xs text-slate-600">{result.opportunities.length} signals detected</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.opportunities.map((opp, i) => (
                    <AlertCard key={i} message={opp} type="info" index={i} />
                  ))}
                </div>
              </div>

              {/* Competitors */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/12 border border-purple-500/25 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Competitor Insights</h3>
                    <p className="text-xs text-slate-600">{result.competitors.length} players tracked</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.competitors.map((c) => (
                    <div key={c.name}
                      className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 hover:bg-white/[0.03]"
                      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{c.name}</div>
                        <div className="text-xs text-slate-600 mt-0.5">Market share: {c.marketShare}%</div>
                        <div className="w-24 h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${Math.min(c.marketShare * 2.5, 100)}%` }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-extrabold font-['Space_Grotesk'] ${c.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {c.growth >= 0 ? "+" : ""}{c.growth}%
                        </div>
                        <div className="text-xs text-slate-600">growth</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex justify-between text-xs py-1.5">
                    <span className="text-slate-500 font-medium">Market Size</span>
                    <span className="text-white font-bold">{result.marketSize}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1.5">
                    <span className="text-slate-500 font-medium">Competitor Saturation</span>
                    <span className={`font-bold ${result.competitorSaturation < 50 ? "text-emerald-400" : result.competitorSaturation < 75 ? "text-amber-400" : "text-red-400"}`}>
                      {result.competitorSaturation}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {!result && !loading && !error && (
          <div className="text-center py-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float"
              style={{
                background: "linear-gradient(145deg,rgba(99,102,241,0.12),rgba(168,85,247,0.06))",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 8px 32px rgba(99,102,241,0.15)",
              }}
            >
              <Search className="w-10 h-10 text-indigo-400 opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2 font-['Space_Grotesk']">Enter a keyword to begin</h3>
            <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
              Try a product, industry, or trend topic. Our AI will analyse millions of signals and return insights in seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
