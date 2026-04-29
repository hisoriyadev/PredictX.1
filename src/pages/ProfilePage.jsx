import { useState, useEffect } from "react";
import { User, Mail, Shield, BarChart2, Save, Zap } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [usage, setUsage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
    loadUsage();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      setProfile(res.data.data);
      setName(res.data.data.name);
      setEmail(res.data.data.email);
    } catch {
      toast.error("Error", "Could not load profile.");
    }
  };

  const loadUsage = async () => {
    try {
      const res = await api.get("/api/user/usage");
      setUsage(res.data.data);
    } catch {
      // Non-critical
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/user/profile", { name, email });
      toast.success("Profile updated", "Your changes have been saved.");
      loadProfile();
    } catch (error) {
      toast.error("Update failed", error.response?.data?.error || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const planColors = {
    free: "text-slate-400 bg-slate-500/15 border-slate-500/25",
    starter: "text-cyan-400 bg-cyan-500/15 border-cyan-500/25",
    pro: "text-indigo-400 bg-indigo-500/15 border-indigo-500/25",
    enterprise: "text-purple-400 bg-purple-500/15 border-purple-500/25",
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mb-2">
            Your Profile
          </h1>
          <p className="text-slate-500 text-sm">Manage your account settings and view usage.</p>
        </div>

        <div className="grid gap-5">
          {/* Profile Card */}
          <div className="glass-card p-6 glow-border animate-blur-in">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                <p className="text-slate-500 text-sm">{user?.email}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border mt-1 inline-block capitalize ${planColors[user?.plan] || planColors.free}`}>
                  {user?.plan || "free"} plan
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass w-full pl-11 pr-4 py-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass w-full pl-11 pr-4 py-3 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm relative z-10"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Usage & Stats Card */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="glass-card p-6 glow-border animate-blur-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Usage This Month</h3>
              </div>
              {usage ? (
                <>
                  <div className="text-3xl font-extrabold text-white font-['Space_Grotesk'] mb-1">
                    {usage.current}
                    <span className="text-lg text-slate-500 font-normal">
                      /{usage.limit === 999999 ? "∞" : usage.limit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (usage.current / (usage.limit === 999999 ? 100 : usage.limit)) * 100)}%`,
                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {usage.remaining === 999999 ? "Unlimited" : `${usage.remaining} remaining`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Loading…</p>
              )}
            </div>

            <div className="glass-card p-6 glow-border animate-blur-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Account Stats</h3>
              </div>
              {profile?.stats ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Total Analyses</span>
                    <span className="text-sm font-bold text-white">{profile.stats.totalSearches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Unique Keywords</span>
                    <span className="text-sm font-bold text-white">{profile.stats.uniqueKeywords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Member Since</span>
                    <span className="text-sm font-bold text-white">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Loading…</p>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="btn-outline flex items-center justify-center gap-2 py-3 text-sm w-full sm:w-auto sm:self-start"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
