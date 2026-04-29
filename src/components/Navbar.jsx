import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Search, Menu, X, Zap, LayoutDashboard, Home, BarChart2, LogIn, UserPlus, User, Clock, LogOut, ChevronDown } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: "Home", to: "/", icon: Home },
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Analyze", to: "/analyze", icon: BarChart2 },
    { label: "Pricing", to: "/pricing", icon: null },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-0"}`}>
        <div className={`absolute inset-0 transition-all duration-500 ${scrolled ? "bg-[rgba(2,8,24,0.82)] backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/40" : "bg-transparent"}`} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>
                <TrendingUp className="w-5 h-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight glow-text-static font-['Space_Grotesk']">PredictX</span>
                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-[0.15em] hidden sm:block">AI Market Oracle</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-2 py-1.5 backdrop-blur-md">
              {navLinks.map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(to) ? "bg-indigo-500/15 text-indigo-300 shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"}`}>
                  {Icon && <Icon className="w-3.5 h-3.5" />}{label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2.5">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/[0.05] border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-semibold text-slate-300 max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 z-50"
                      style={{ background: "rgba(8,12,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(24px)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
                      <div className="px-3 py-2 mb-1">
                        <div className="text-sm font-bold text-white truncate">{user?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                      </div>
                      <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors">
                        <User className="w-4 h-4 text-slate-500" /> Profile
                      </Link>
                      <Link to="/history" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors">
                        <Clock className="w-4 h-4 text-slate-500" /> History
                      </Link>
                      <Link to="/analyze" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors">
                        <Search className="w-4 h-4 text-slate-500" /> New Analysis
                      </Link>
                      <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                      <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn-outline flex items-center gap-2 py-2 px-4 text-sm">
                      <LogIn className="w-3.5 h-3.5" /> Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="btn-primary flex items-center gap-2 py-2 px-4 text-sm relative z-10">
                      <Zap className="w-3.5 h-3.5" /> Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden relative w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <span className={`absolute transition-all duration-200 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}><X className="w-4 h-4" /></span>
              <span className={`absolute transition-all duration-200 ${mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}><Menu className="w-4 h-4" /></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="glass-strong rounded-2xl mb-4 p-3 space-y-1 border border-white/10">
              {navLinks.map(({ label, to, icon: Icon }) => (
                <Link key={label} to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive(to) ? "bg-indigo-500/15 text-indigo-300" : "text-slate-300 hover:bg-white/[0.05] hover:text-white"}`}>
                  {Icon && <Icon className="w-4 h-4 opacity-70" />}{label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"><User className="w-4 h-4 opacity-70" /> Profile</Link>
                  <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.05]"><Clock className="w-4 h-4 opacity-70" /> History</Link>
                </>
              )}
              <div className="flex gap-2 pt-2 border-t border-white/[0.06] mt-2">
                {isAuthenticated ? (
                  <button onClick={logout} className="btn-outline w-full text-sm py-2.5 flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><button className="btn-outline w-full text-sm py-2.5">Sign In</button></Link>
                    <Link to="/register" className="flex-1"><button className="btn-primary w-full text-sm py-2.5 relative z-10">Get Started</button></Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
