import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, TrendingUp, ArrowRight, Zap } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { useToast } from "../components/Toast.jsx";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", "Please make sure both passwords are identical.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password too short", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created!", "Welcome to PredictX. Let's find your first trend.");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
              }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold glow-text-static font-['Space_Grotesk']">
              PredictX
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm">
            Start predicting trends with AI-powered intelligence.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(28px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-glass w-full pl-11 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-glass w-full pl-11 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="input-glass w-full pl-11 pr-12 py-3 text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-glass w-full pl-11 pr-4 py-3 text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm relative z-10 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
            <span className="text-xs text-slate-600">or</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in <ArrowRight className="w-3 h-3 inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
