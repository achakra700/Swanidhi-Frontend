
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
            This agreement governs the activation and operational conduct of institutional nodes within the SWANIDHI National Logistics Grid.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">1. Node Eligibility & Conduct</h2>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Access is strictly restricted to licensed clinical facilities and registered blood banks holding valid NBTC/State Health Department credentials.
              </p>
              <ul className="space-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <li><span className="text-slate-950">Non-Commerciality:</span> The grid is a public good resource; any monetization of SOS signals is a criminal offense.</li>
                <li><span className="text-slate-950">Identity Integrity:</span> Credentials must be used only by authorized clinical officers.</li>
              </ul>
            </div>
          </section>

          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-8">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">2. Grid Misuse Penalties</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Misuse of the "Emergency SOS" signal for non-clinical scenarios or reporting fraudulent stock levels results in immediate node termination.
            </p>
            <div className="p-6 bg-slate-950 rounded-2xl border border-white/10">
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2">Notice of Prosecution</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">
                Fraudulent signals are logged and forwarded to the Central Healthcare Regulatory Wing for legal action under federal healthcare acts.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-12">
          {[
            {
              title: "3. Service Level Agreement (SLA)",
              desc: "While the synchronization grid targets 99.9% uptime, it is provided as a facilitation layer. Institutions must maintain local contingency plans for network outages."
            },
            {
              title: "4. Intellectual Property & Sovereignty",
              desc: "The SWANIDHI interface and proprietary routing logic remain the intellectual property of the Registry. Institutional data remains the property of the originating node, granted to the grid for logistical synchronization only."
            },
            {
              title: "5. Limitation of Clinical Liability",
              desc: "SWANIDHI is a coordination protocol. It does not verify blood compatibility or clinical outcomes. Physical verification remains the absolute responsibility of the fulfillment and recipient clinicians."
            },
            {
              title: "6. Force Majeure & Grid Resilience",
              desc: "During national emergencies or large-scale network failures, the grid functions in 'Static Mode', providing last-known-good stock snapshots only. Tactical autonomy is expected from regional hubs."
            }
          ].map(item => (
            <div key={item.title} className="p-10 hover:bg-slate-50 rounded-3xl transition-all border-l-8 border-slate-900 pl-16 group">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 group-hover:text-rose-600 transition-colors">{item.title}</h4>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="bg-rose-50 p-12 rounded-[3.5rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-rose-700 uppercase tracking-[0.4em]">Governance Board</p>
            <p className="text-lg font-black text-rose-900 uppercase">registry-legal@swanidhi.gov.in</p>
          </div>
          <div className="px-8 py-4 bg-white rounded-full border border-rose-200">
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Effective January 2025</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};

export default TermsOfService;
