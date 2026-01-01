
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

const TrustBadge: React.FC<{ icon: React.ReactNode; label: string; sub: string }> = ({ icon, label, sub }) => (
  <div className="flex items-center gap-4 group/badge">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 group-hover/badge:bg-rose-500 group-hover/badge:text-white transition-all duration-500 shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">{label}</p>
      <p className="text-[9px] font-bold uppercase tracking-tight text-slate-400 group-hover/badge:text-slate-200 transition-colors">{sub}</p>
    </div>
  </div>
);

const Footer: React.FC = () => {
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  const trustItems = [
    {
      label: "Privacy-first",
      sub: "End-to-end Encrypted",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: "Audit-ready",
      sub: "Real-time Traceability",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: "Built for India",
      sub: "National Scalability",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#020617] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden" role="contentinfo">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%">
          <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24 mb-20">

          <div className="space-y-8">
            <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 inline-block">
              <Logo variant="monochrome" className="h-7 text-white" />
            </Link>
            <p className="text-slate-400 font-medium text-sm leading-relaxed uppercase tracking-tight max-w-xs">
              Synchronizing the nation's blood reserves with a unified, real-time logistics layer.
              Built for institutional public health excellence.
            </p>
            <div className="flex gap-4">
              {[
                { id: 'Twitter', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                { id: 'LinkedIn', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
                { id: 'GitHub', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> }
              ].map((social) => (
                <a
                  key={social.id}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-all duration-300"
                  aria-label={`Official ${social.id} profile`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase">Institutional</h4>
              <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Link to="/about" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">About Us</Link>
                <Link to="/vision" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Vision</Link>
                <Link to="/audit-charter" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Audit Charter</Link>
                <Link to="/compliance" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Compliance</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase">Governance</h4>
              <nav className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <Link to="/privacy" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Terms of Service</Link>
                <Link to="/contact" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Contact</Link>
                <Link to="/brand" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded p-1 transition-colors">Brand Assets</Link>
              </nav>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black tracking-[0.4em] text-rose-500 uppercase">Registry Support</h4>
              <div className="space-y-2">
                <Link to="/contact" className="text-xl font-black tracking-tighter hover:text-rose-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded block">Institutional Hotline</Link>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Available 24/7 for Global Nodes</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 shadow-inner">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Grid News</p>
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-tight leading-relaxed line-clamp-2">
                  Audit integrity protocols updated for FY2025 across all Tier-1 hubs.
                </p>
                <button className="text-[9px] font-black uppercase tracking-widest text-white border-b border-white/20 pb-0.5 hover:border-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Latest Directive
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full mb-12" aria-hidden="true"></div>

        <div className="hidden md:flex justify-between items-center mb-12">
          <div className="flex gap-12">
            {trustItems.map((item) => (
              <TrustBadge key={item.label} {...item} />
            ))}
          </div>
        </div>

        <div className="md:hidden mb-12 border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => setIsTrustOpen(!isTrustOpen)}
            aria-expanded={isTrustOpen}
            className="w-full flex items-center justify-between p-6 bg-white/5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:bg-white/10"
          >
            Trust & Security Protocol
            <svg className={`w-4 h-4 transition-transform ${isTrustOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isTrustOpen && (
            <div className="p-6 space-y-8 animate-in slide-in-from-top-2 duration-300" role="region">
              {trustItems.map((item) => (
                <TrustBadge key={item.label} {...item} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center md:text-left">
            © SWANIDHI 2025 • A National Institutional Coordination Layer
          </p>
          <div className="max-w-sm">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed text-center md:text-right italic">
              Platform content is for institutional coordination only. Verified news links open in external tabs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
