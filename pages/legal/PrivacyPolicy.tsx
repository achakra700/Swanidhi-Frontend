
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
          <p className="text-rose-500 text-xs font-black tracking-[0.4em] uppercase leading-none">Security Architecture</p>
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Privacy Governance Framework</h2>
          <p className="text-base font-medium opacity-70 uppercase tracking-tight leading-relaxed max-w-xl">
            This document outlines the zero-knowledge standards and data guardianship protocols governing the SWANIDHI national logistics grid.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">1. Data Minimization Scope</h2>
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                In accordance with the DPDP Act 2023, SWANIDHI only captures the minimum viable operational markers:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                <li><span className="text-slate-900">Institutional Identity:</span> Government-issued TIN/License IDs and facility coordinates.</li>
                <li><span className="text-slate-900">Personnel Credentials:</span> Authenticated professional signatures (encrypted).</li>
                <li><span className="text-slate-900">SOS Metadata:</span> Ephemeral biological requirements (Blood group, units, urgency).</li>
              </ul>
            </div>
          </section>

          <section className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase pb-4 border-b border-slate-50">2. Processing Logic</h2>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              Data processing is restricted to emergency synchronization. Automated routing algorithms utilize institutional telemetry solely for pre-positioning suggestions. No data is shared with third-party commercial entities.
            </p>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
              <p className="text-[9px] font-black text-rose-700 uppercase tracking-widest">Crucial: Clinical notes are never indexed or analyzed; they serve as a secure transit blob for the fulfilling node only.</p>
            </div>
          </section>
        </div>

        <section className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 space-y-12">
          <div>
            <h2 className="text-slate-900 font-black tracking-widest text-[10px] uppercase mb-6">3. Technical Safeguards</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { label: 'Transport Layer', val: 'TLS 1.3 / mTLS', desc: 'Mutually authenticated encryption at the edge.' },
                { label: 'Storage Layer', val: 'AES-256 GCM', desc: 'Hardware-backed encryption for all registration assets.' },
                { label: 'Network Sync', val: 'Proprietary WSS', desc: 'Secure websocket tunnels for real-time SOS broadcasts.' }
              ].map(s => (
                <div key={s.label} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-3">
                  <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest leading-none">{s.label}</p>
                  <p className="text-md font-black text-slate-900 tracking-tight leading-none">{s.val}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200 grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Retention Schedule</h4>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Active logs are retained for 36 months in accordance with national health records standards. Following this, records are archived for an additional 4 years in encrypted cold-storage before permanent cryptographic purging.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Access Rights</h4>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Institutions possess the "Right to Erasure" (RTK) for non-active node data. Requests are fulfilled within 48 hours of verification by the Nodal Compliance Officer.
              </p>
            </div>
          </div>
        </section>

        <section className="p-10 bg-slate-950 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nodal Privacy Officer</p>
            <p className="text-lg font-black tracking-tight uppercase">registry-privacy@swanidhi.gov.in</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status: Operational</p>
            <p className="text-[10px] font-bold uppercase tracking-tight opacity-60">Verified DPDP Compliant Node</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
