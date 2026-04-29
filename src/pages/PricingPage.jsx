import { Link } from "react-router-dom";
import { CheckCircle, Sparkles, Zap } from "lucide-react";
import Footer from "../components/Footer.jsx";

function PricingCard({ plan, price, desc, features, cta, highlighted }) {
  return (
    <div className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 relative"
      style={{
        background: highlighted ? "linear-gradient(145deg,rgba(99,102,241,0.14),rgba(168,85,247,0.07))" : "linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))",
        border: `1px solid ${highlighted ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: highlighted ? "0 16px 48px rgba(99,102,241,0.2)" : "0 4px 24px rgba(0,0,0,0.3)",
      }}>
      {highlighted && (
        <>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full z-10"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 4px 12px rgba(99,102,241,0.5)" }}>✦ Most Popular</div>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(ellipse at top,rgba(99,102,241,0.08),transparent 60%)" }} />
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
        <Link to="/register">
          <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${highlighted ? "btn-primary relative z-10" : "btn-outline"}`}>{cta}</button>
        </Link>
      </div>
    </div>
  );
}

export default function PricingPage() {
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
      <section className="py-28 px-6 pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-400 text-[11px] font-extrabold uppercase tracking-widest">Simple Pricing</span>
            </div>
            <h1 className="section-title text-white mb-4">
              Pick your <span className="glow-text">advantage</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              No hidden fees. Cancel anytime. Start free and upgrade as you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start animate-pop-in" style={{ animationDelay: "0.15s" }}>
            {plans.map((p) => <PricingCard key={p.plan} {...p} />)}
          </div>

          <div className="mt-16 text-center animate-fade-only" style={{ animationDelay: "0.3s" }}>
            <div className="rounded-2xl p-8 max-w-2xl mx-auto" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-indigo-300 text-xs font-bold">Free Tier Available</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Not ready to commit?</h3>
              <p className="text-slate-400 text-sm mb-4">Try PredictX free with 10 analyses/month. No credit card required.</p>
              <Link to="/register"><button className="btn-primary py-2.5 px-6 text-sm relative z-10">Create Free Account</button></Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
