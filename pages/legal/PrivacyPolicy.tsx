
import React from 'react';
import LegalLayout from './LegalLayout';
import Logo from '../../components/ui/Logo';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy" subtitle="v2025.01-Stable">
      <div className="space-y-10 text-slate-600 text-[13px] font-bold uppercase tracking-tight leading-relaxed">

        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mb-8">
          <p className="text-rose-700 text-[11px] font-black tracking-widest italic">
            "This platform does not replace medical judgment or institutional protocols. Privacy is handled at the institutional node level."
          </p>
        </div>

        <div className="bg-slate-900 p-10 md:p-16 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Logo className="h-16" variant="inverted" />
          </div>
          <p className="text-rose-500 text-xs font-black tracking-[0.4em] uppercase leading-none">Institutional Shield</p>
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Security & Privacy Governance</h2>
          <p className="text-base font-medium opacity-70 uppercase tracking-tight leading-relaxed max-w-xl">
            Every packet on the SWANIDHI grid is encrypted. We don't just protect data; we protect the integrity of human life logistics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">1. Data Capture Scope</h2>
            <ul className="list-disc pl-5 space-y-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <li><span className="text-slate-900">Operator ID:</span> Authenticated institutional credentials.</li>
              <li><span className="text-slate-900">Facility Matrix:</span> Verified coordinates and legal licensing.</li>
              <li><span className="text-slate-900">Credential Assets:</span> Encrypted operational licensing blobs.</li>
            </ul>
          </section>

          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">2. Processing Intent</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Logistics markers are utilized strictly for SOS synchronization. Clinical justification notes are ephemeral and restricted to verified medical recipients only.
            </p>
          </section>
        </div>

        <section className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 space-y-10">
          <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase">3. Encryption Protocols</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { label: 'In Transit', val: 'TLS 1.3' },
              { label: 'At Rest', val: 'AES-256' },
              { label: 'Sync', val: 'WSS (Secure)' }
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-sm font-black text-slate-900 tracking-tight">{s.val}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 text-center bg-rose-50 border border-rose-100 rounded-[2.5rem]">
          <p className="text-[10px] font-black text-rose-700 uppercase tracking-[0.4em]">Node Autonomy</p>
          <p className="text-xs font-bold text-rose-900 uppercase tracking-tight mt-2">
            Institutions maintain absolute ownership over their data. Deactivation request fulfillment within 48 hours of audit.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
