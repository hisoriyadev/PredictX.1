import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Search, Trash2, Eye } from "lucide-react";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";

export default function HistoryPage() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const toast = useToast();

  const loadHistory = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/history?page=${p}&limit=15`);
      setSearches(res.data.data);
      setPagination(res.data.pagination);
      setPage(p);
    } catch {
      toast.error("Error", "Could not load search history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/history/${id}`);
      setSearches((prev) => prev.filter((s) => s._id !== id));
      toast.success("Deleted", "Search history item removed.");
    } catch {
      toast.error("Error", "Could not delete item.");
    }
  };

  const getRecBadge = (rec) => {
    if (rec === "Launch Now") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    if (rec === "Watch Closely") return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    return "bg-red-500/15 text-red-400 border-red-500/25";
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Search History</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-1">Past Analyses</h1>
            <p className="text-slate-500 text-sm">{pagination ? `${pagination.total} total` : "Loading…"}</p>
          </div>
          <Link to="/analyze">
            <button className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm relative z-10">
              <Search className="w-4 h-4" /> New Analysis
            </button>
          </Link>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="spinner mx-auto mb-4" style={{ width: 48, height: 48 }} />
            <p className="text-slate-500 text-sm">Loading history…</p>
          </div>
        )}

        {!loading && searches.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.12),rgba(168,85,247,0.06))", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Clock className="w-9 h-9 text-indigo-400 opacity-70" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">No history yet</h3>
            <p className="text-slate-600 text-sm mb-6">Run your first analysis to see it here.</p>
            <Link to="/analyze"><button className="btn-primary py-2.5 px-6 text-sm relative z-10">Analyze a Trend</button></Link>
          </div>
        )}

        {!loading && searches.length > 0 && (
          <div className="space-y-3 animate-blur-in">
            {searches.map((s) => (
              <div key={s._id} className="glass-card p-5 flex items-center justify-between gap-4 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold text-white truncate">{s.keyword}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRecBadge(s.recommendation)}`}>{s.recommendation}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Score: <span className="text-white font-semibold">{s.trendScore}</span></span>
                    <span>Growth: <span className="text-emerald-400 font-semibold">{s.growth}</span></span>
                    <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/report/${s._id}`}>
                    <button className="btn-outline py-2 px-3 text-xs flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> View</button>
                  </Link>
                  <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => loadHistory(page - 1)} disabled={page <= 1} className="btn-outline py-2 px-4 text-xs disabled:opacity-30">Previous</button>
                <span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span>
                <button onClick={() => loadHistory(page + 1)} disabled={page >= pagination.pages} className="btn-outline py-2 px-4 text-xs disabled:opacity-30">Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
