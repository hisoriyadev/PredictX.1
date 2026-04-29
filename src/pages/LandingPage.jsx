import { Link } from "react-router-dom";
import {
  TrendingUp, Brain, Bell, Users, BarChart2, Search,
  ArrowRight, Zap, Shield, Star, CheckCircle, Sparkles
} from "lucide-react";
import HeroBackground from "../components/HeroBackground.jsx";
import Footer from "../components/Footer.jsx";

/* ── Feature Card ─────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color }) {
  const map = {
    indigo: { ring: "rgba(99,102,241,0.3)",  bg: "rgba(99,102,241,0.1)",  text: "text-indigo-400",  hover: "rgba(99,102,241,0.12)" },
    purple: { ring: "rgba(168,85,247,0.3)",  bg: "rgba(168,85,247,0.1)",  text: "text-purple-400",  hover: "rgba(168,85,247,0.12)" },
    cyan:   { ring: "rgba(6,182,212,0.3)",   bg: "rgba(6,182,212,0.1)",   text: "text-cyan-400",    hover: "rgba(6,182,212,0.12)"  },
    green:  { ring: "rgba(16,185,129,0.3)",  bg: "rgba(16,185,129,0.1)",  text: "text-emerald-400", hover: "rgba(16,185,129,0.12)" },
    amber:  { ring: "rgba(245,158,11,0.3)",  bg: "rgba(245,158,11,0.1)",  text: "text-amber-400",   hover: "rgba(245,158,11,0.12)" },
    pink:   { ring: "rgba(236,72,153,0.3)",  bg: "rgba(236,72,153,0.1)",  text: "text-pink-400",    hover: "rgba(236,72,153,0.12)" },
  };
  const c = map[color] || map.indigo;

  return (
    <div className="feature-card group">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{ background: c.bg, border: `1px solid ${c.ring}`, boxShadow: `0 4px 16px ${c.hover}` }}
      >
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <h3 className="text-base font-bold text-white mb-2.5 font-['Space_Grotesk'] group-hover:text-slate-100 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── How It Works Step ─────────────────────────── */
function StepCard({ num, title, desc, active }) {
  return (
    <div
      className="relative flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2"
      style={{
        background: active
          ? "linear-gradient(145deg,rgba(99,102,241,0.12),rgba(168,85,247,0.06))"
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${active ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.07)"}`,
        boxShadow: active ? "0 8px 32px rgba(99,102,241,0.15)" : "none",
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold mb-4 font-['Space_Grotesk']"
        style={{
          background: active
            ? "linear-gradient(135deg,#6366f1,#a855f7)"
            : "rgba(255,255,255,0.06)",
          color: active ? "white" : "#64748b",
          border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: active ? "0 4px 20px rgba(99,102,241,0.5)" : "none",
        }}
      >
        {num}
      </div>
      <h4 className="text-sm font-bold text-white mb-2 font-['Space_Grotesk']">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      {active && (
        <div className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.08),transparent)", borderRadius: "inherit" }} />
      )}
    </div>
  );
}

/* ── Testimonial Card ──────────────────────────── */
function TestimonialCard({ name, role, company, text, rating }) {
  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/30 group"
      style={{
        background: "linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-6 group-hover:text-slate-200 transition-colors">"{text}"</p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
        >
          {name[0]}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{name}</div>
          <div className="text-xs text-slate-500">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Pricing Card ──────────────────────────────── */
function PricingCard({ plan, price, desc, features, cta, highlighted }) {
  return (
    <div
      className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 relative"
      style={{
        background: highlighted
          ? "linear-gradient(145deg,rgba(99,102,241,0.14),rgba(168,85,247,0.07))"
          : "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))",
        border: `1px solid ${highlighted ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: highlighted ? "0 16px 48px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.05)" : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {highlighted && (
        <>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full z-10"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 4px 12px rgba(99,102,241,0.5)" }}>
            ✦ Most Popular
          </div>
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top,rgba(99,102,241,0.08),transparent 60%)" }} />
        </>
      )}
      <div className="relative z-10">
        <div className="mb-5">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 mb-2.5">{plan}</div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">{price}</span>
            {price !== "Custom" && <span className="text-slate-500 text-sm">/month</span>}
          </div>
          <p className="text-slate-400 text-sm">{desc}</p>
        </div>
        <div className="h-px mb-5" style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)" }} />
        <ul className="space-y-3 mb-8">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{f}</span>
            </li>
          ))}
        </ul>
        <Link to="/analyze">
          <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${highlighted ? "btn-primary relative z-10" : "btn-outline"}`}>
            {cta}
          </button>
        </Link>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────── */
export default function LandingPage() {
  const features = [
    { icon: TrendingUp, title: "Trend Prediction", desc: "AI forecasts emerging trends 2–6 weeks before they peak using multi-source signal analysis.", color: "indigo" },
    { icon: Brain,      title: "Sentiment Analysis", desc: "Deep NLP across Reddit, Twitter, and 200+ news outlets to measure positive/negative market signals.", color: "purple" },
    { icon: Bell,       title: "Opportunity Alerts", desc: "Real-time push alerts when a trend enters your niche with demand spike detection.", color: "cyan" },
    { icon: Users,      title: "Competitor Insights", desc: "Monitor competitor market share, growth trajectory, and saturation levels in real time.", color: "green" },
    { icon: BarChart2,  title: "Real-time Dashboard", desc: "Live analytics with line, bar, and pie charts to visualise trend momentum at a glance.", color: "amber" },
    { icon: Search,     title: "Search Growth Tracking", desc: "Track Google Trends, keyword velocity, and search volume spikes across 50+ categories.", color: "pink" },
  ];

  const steps = [
    { num: "01", title: "Data Collection",   desc: "Ingests signals from Reddit, Twitter, Google Trends, and 200+ news sources simultaneously.", active: false },
    { num: "02", title: "AI Signal Analysis",desc: "Our LLM engine scores sentiment, velocity, and demand patterns across all collected data.", active: true },
    { num: "03", title: "Trend Forecasting", desc: "Predictive models generate a Trend Score /100 with growth % and risk classification.", active: false },
    { num: "04", title: "Opportunity Alerts",desc: "Actionable recommendations: Launch Now, Watch Closely, or Avoid Entry — delivered instantly.", active: false },
  ];

  const testimonials = [
    { name: "Sarah Chen",   role: "Founder",     company: "GreenLoop",  rating: 5, text: "PredictX told us eco-packaging was trending 5 weeks before it exploded on TikTok. We launched at the peak and hit $400K ARR in 3 months." },
    { name: "Marcus Webb",  role: "CMO",          company: "NovaBrand",  rating: 5, text: "We replaced 3 analytics tools with PredictX. The competitor saturation score alone saved us from entering a dying market." },
    { name: "Priya Sharma", role: "Growth Lead",  company: "TechVault",  rating: 5, text: "The sentiment analysis is scary accurate. Our campaign CTR jumped 67% because we timed launches based on PredictX predictions." },
  ];

  const plans = [
    { plan: "Starter", price: "$29", desc: "Perfect for solopreneurs validating ideas.", highlighted: false, cta: "Start Free Trial",
      features: ["50 trend analyses/month", "Basic sentiment reports", "Email alerts", "7-day data history", "CSV export"] },
    { plan: "Pro", price: "$99", desc: "For founders and marketing teams moving fast.", highlighted: true, cta: "Get Pro",
      features: ["Unlimited analyses", "Advanced sentiment NLP", "Real-time Slack alerts", "90-day history", "Competitor dashboard", "PDF report export", "API access"] },
    { plan: "Enterprise", price: "Custom", desc: "For agencies and large-scale operations.", highlighted: false, cta: "Contact Sales",
      features: ["Everything in Pro", "Custom integrations", "Dedicated AI model", "White-label reports", "SLA guarantee", "Priority support", "Team seats"] },
  ];

  return (
    <div className="overflow-hidden">

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 grid-bg overflow-hidden">
        <HeroBackground />

        {/* Big vivid glow orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(79,70,229,0.22) 0%,transparent 65%)", filter: "blur(50px)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(147,51,234,0.18) 0%,transparent 65%)", filter: "blur(50px)" }} />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 65%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          {/* Animated badge */}
          <div className="animate-blur-in delay-100 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 group cursor-default"
            style={{
              background: "linear-gradient(135deg,rgba(79,70,229,0.15),rgba(147,51,234,0.1))",
              border: "1px solid rgba(99,102,241,0.35)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-indigo-400" />
            </span>
            <span className="text-indigo-200 text-xs font-bold tracking-wide">AI-Powered Intelligence · Trusted by 12,000+ Founders</span>
            <ArrowRight className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
          </div>

          {/* Main headline */}
          <div className="animate-reveal-left delay-200">
          <h1 className="mb-6 text-white" style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em" }}>
            <span className="block text-slate-400 font-semibold mb-2" style={{ fontSize: "clamp(1rem,2vw,1.25rem)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              PredictX-Market Oracle
            </span>
            <span className="block glow-text">Spot Tomorrow's</span>
            <span className="block text-white">Trend <span className="aurora-text">Today</span></span>
          </h1>
          </div>

          <p className="animate-fade-only delay-300 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            AI-powered market intelligence that predicts emerging trends using social media, news, Reddit &amp; search signals, <br />
            <span className="text-slate-200 font-semibold"> weeks before your competitors.</span>
          </p>

          {/* CTAs */}
          <div className="animate-pop-in delay-400 flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/analyze">
              <button className="btn-primary flex items-center gap-2.5 text-base px-9 py-4 relative z-10 rounded-2xl" style={{ fontSize: "1rem", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                <Zap className="w-5 h-5" /> Get Started Free
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn-outline flex items-center gap-2.5 text-base px-9 py-4 rounded-2xl" style={{ fontSize: "1rem", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                <BarChart2 className="w-4 h-4" /> Live Demo <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-scale-in delay-500 flex flex-wrap justify-center gap-0 divide-x divide-white/10">
            {[
              { val: "12K+",  label: "Active Users",        sub: "growing 40%/mo" },
              { val: "94%",   label: "Accuracy",            sub: "AI predictions" },
              { val: "2–6wk", label: "Lead Time",           sub: "before competitors" },
              { val: "200+",  label: "Data Sources",        sub: "scanned in real-time" },
            ].map(({ val, label, sub }) => (
              <div key={label} className="text-center px-8 py-2 group">
                <div className="text-2xl md:text-3xl font-extrabold glow-text-static tracking-tight group-hover:scale-105 transition-transform duration-200" style={{ fontFamily: "'Outfit',sans-serif" }}>{val}</div>
                <div className="text-xs font-bold text-slate-300 mt-0.5">{label}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-indigo-400 text-[11px] font-extrabold uppercase tracking-widest">Core Features</span>
            </div>
            <h2 className="section-title text-white mb-4">
              Everything you need to <span className="glow-text">stay ahead</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Six AI-powered modules working in concert to give you an unbeatable market edge.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-400 text-[11px] font-extrabold uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="section-title text-white mb-4">
              From raw data to <span className="glow-text">actionable insight</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Our 4-step AI pipeline turns millions of signals into one clear recommendation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),rgba(168,85,247,0.4),transparent)" }} />
            {steps.map((s) => <StepCard key={s.num} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── USP Banner ───────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-16 relative overflow-hidden text-center"
            style={{
              background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08) 50%,rgba(6,182,212,0.06))",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.04)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center,rgba(99,102,241,0.1),transparent 65%)" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-indigo-300 text-xs font-bold">The PredictX Difference</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white font-['Space_Grotesk'] mb-5 leading-tight tracking-tight">
                Unlike tools that show <span className="text-slate-500 line-through">past data</span>,<br />
                <span className="glow-text">PredictX predicts future opportunities</span><br />
                before competitors even know they exist.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                Our forward-looking AI trains on leading indicators, not lagging ones. Consistently see 2–6 weeks ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title text-white mb-3">
              Loved by <span className="glow-text">market leaders</span>
            </h2>
            <p className="text-slate-500 text-sm">Real results from founders and marketers who moved first.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-400 text-[11px] font-extrabold uppercase tracking-widest">Simple Pricing</span>
            </div>
            <h2 className="section-title text-white mb-3">
              Pick your <span className="glow-text">advantage</span>
            </h2>
            <p className="text-slate-500 text-sm">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p) => <PricingCard key={p.plan} {...p} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
