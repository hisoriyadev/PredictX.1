import { Link } from "react-router-dom";
import { TrendingUp, Twitter, Github, Linkedin, Mail, Zap } from "lucide-react";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Docs", "API", "Status", "Support"],
    Legal: ["Privacy", "Terms", "Cookies"],
  };

  return (
    <footer className="border-t border-white/5 bg-[#020817]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div
          className="rounded-3xl p-10 md:p-14 text-center mb-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.1) 50%,rgba(6,182,212,.08))",
            border: "1px solid rgba(99,102,241,.3)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,.12),transparent_70%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-sm font-semibold mb-5">
              <Zap className="w-4 h-4" /> Start Free — No Credit Card Required
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-['Space_Grotesk'] mb-4">
              Ready to predict the future?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join 12,000+ founders using PredictX to spot opportunities before competitors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analyze">
                <button className="btn-primary text-base px-8 py-3.5 relative z-10">Get Started Free</button>
              </Link>
              <Link to="/dashboard">
                <button className="btn-outline text-base px-8 py-3.5">View Live Demo</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold glow-text font-['Space_Grotesk']">PredictX</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              AI-powered market intelligence. Spot trends before competitors.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">{cat}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-sm text-slate-600">© 2026 PredictX Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
