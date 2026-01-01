
import React from 'react';
import LegalLayout from './LegalLayout';
import Logo from '../../components/ui/Logo';

const Vision: React.FC = () => {
  return (
    <LegalLayout title="Strategic Roadmap" subtitle="Network Evolution 2025-2030">
      <div className="space-y-20 text-slate-600">

        <section className="space-y-10">
          <h2 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em]">The North Star</h2>
          <p className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
            Zero delay. <br />Zero loss. <br />Universal grid.
          </p>
          <p className="text-xl font-bold text-slate-500 uppercase tracking-tight leading-relaxed max-w-2xl">
            Our vision is to eliminate avoidable mortality caused by blood scarcity through the creation of a fault-tolerant, instant-access national logistics backbone.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 border-y border-slate-100 py-20 relative overflow-hidden">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <span className="w-4 h-1 bg-rose-600"></span>
              Phased National Scaling
            </h3>
            <div className="space-y-8">
              {[
                { phase: "Phase 1: Pilot", desc: "Integration of 200+ nodes across key metropolitan clusters for workflow validation." },
                { phase: "Phase 2: Regional", desc: "State-wide grid activation connecting district hospitals with peripheral primary centers." },
                { phase: "Phase 3: National", desc: "Full synchronization of the Indian blood reserve as a unified logistics layer." }
              ].map(p => (
                <div key={p.phase} className="space-y-2">
                  <p className="text-[10px] font-black text-rose-600 uppercase">{p.phase}</p>
                  <p className="text-sm font-bold uppercase tracking-tight text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-2xl space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Technological Frontiers</h3>
            <ul className="space-y-6">
              {[
                { title: "Inter-Node Analytics", desc: "Using historical fulfillment data to predict regional shortages and pre-position supplies." },
                { title: "HIS API Ecosystem", desc: "Direct integration with Hospital Information Systems to trigger SOS automatically from OT registries." },
                { title: "Mobile Dispatch Edge", desc: "Empowering logistical couriers with real-time route optimization for blood transport." }
              ].map(f => (
                <li key={f.title} className="space-y-2">
                  <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">{f.title}</h4>
                  <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400 leading-relaxed">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-12">
          <h2 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.5em]">Strategic Benchmarks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Absolute Traceability", desc: "Every unit of blood is tracked from reservation to clinical fulfillment, creating an unshakeable audit trail for healthcare authorities.", icon: "🔍" },
              { title: "Sovereign Privacy", desc: "Protecting patient and donor identifiers through a zero-knowledge architecture that ensures data is only visible to authorized providers.", icon: "🗝️" },
              { title: "Operational Velocity", desc: "Continuous UX optimization to ensure that in moments of extreme trauma, clinicians can signal for help in less than 3 taps.", icon: "⚡" },
              { title: "Institutional Equity", desc: "Ensuring that a rural community hospital has the same visibility into blood reserves as a metropolitan super-specialty facility.", icon: "⚖️" },
              { title: "Systemic Resilience", desc: "Building a decentralized communication grid that remains operational even during regional network outages or high-traffic surges.", icon: "🔋" },
              { title: "Public Trust", desc: "Maintaining a transparent, non-commercial interface that honors the selfless act of donation through professional logistics.", icon: "🤝" }
            ].map(p => (
              <div key={p.title} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-3xl opacity-20 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700">{p.icon}</div>
                <div className="space-y-4 relative z-10">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-50">{p.title}</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-rose-950 p-16 rounded-[4rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            <Logo className="h-20" variant="inverted" />
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tight leading-[0.9]">Toward an automated, life-saving grid.</h2>
            <p className="text-base font-medium uppercase tracking-tight opacity-70 leading-relaxed">
              By 2030, SWANIDHI targets a 95% reduction in blood-scarcity-related mortality across the national healthcare network.
            </p>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default Vision;
