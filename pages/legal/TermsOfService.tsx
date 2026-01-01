
import React from 'react';
import LegalLayout from './LegalLayout';
import Logo from '../../components/ui/Logo';

const TermsOfService: React.FC = () => {
  return (
    <LegalLayout title="Terms of Service" subtitle="Institutional Master Agreement">
      <div className="space-y-10 text-slate-600 text-[13px] font-bold uppercase tracking-tight leading-relaxed">

        <div className="bg-slate-50 p-10 md:p-16 rounded-[4rem] border border-slate-100 space-y-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-[0.03] scale-150">
            <Logo className="h-48" />
          </div>
          <p className="text-rose-600 text-[10px] font-black tracking-[0.4em] uppercase leading-none">Institutional Protocol</p>
          <h2 className="text-4xl font-[900] text-slate-900 uppercase tracking-tight leading-none">Master Access Agreement</h2>
          <p className="text-base font-bold text-slate-500 uppercase tracking-tight leading-relaxed max-w-xl">
            By activating an institutional node, you agree to the binding synchronization protocols and ethical mandates of the SWANIDHI National Grid.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">1. Node Eligibility</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Access is strictly limited to licensed clinical facilities within the Republic of India. Unauthorized attempts to signal the grid are monitored and reported to the National Registry Authority.
            </p>
          </section>

          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">2. Operational Accuracy</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Operators are legally responsible for the truth-value of stock reported on the grid. SOS signals must match verified clinician notes attached during the request sequence.
            </p>
          </section>
        </div>

        <div className="space-y-12">
          {[
            { title: "3. Institutional Verification", desc: "Nodes undergo mandatory biometric and document audit. Suspension occurs within 300ms of any verified data breach or identity misuse." },
            { title: "4. Liability Limitation", desc: "As a facilitation layer, SWANIDHI is not liable for outcomes resulting from physical transport delays, clinical misjudgment, or local power outages." },
            { title: "5. Jurisdiction & Governance", desc: "This agreement is governed by federal law. Disputes fall under the exclusive purview of the Central Health Coordination Tribunal." }
          ].map(item => (
            <div key={item.title} className="p-8 hover:bg-slate-50 rounded-3xl transition-colors border-l-4 border-rose-600 pl-12">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">{item.title}</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </LegalLayout>
  );
};

export default TermsOfService;
