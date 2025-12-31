
import React from 'react';
import LegalLayout from './LegalLayout';

const AuditCharter: React.FC = () => {
  return (
    <LegalLayout title="Integrity Protocol" subtitle="System Audit Charter v4.2">
      <div className="space-y-16 text-slate-600">
        
        <section className="bg-slate-950 p-12 md:p-20 rounded-[4rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-widest leading-none">The Mandate of Immutable Accountability</h2>
            <p className="text-lg font-bold uppercase tracking-tight leading-relaxed opacity-80">
              In a national healthcare grid where minutes decide survival, the integrity of communication is paramount. 
              The SWANIDHI Audit Charter establishes the rules for a tamper-evident, permanent digital ledger that records every logistical interaction.
            </p>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              PROTOCOL AUTH: SWN-AUDIT-4.2-R3
            </p>
          </div>
        </section>

        <section className="space-y-12">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-4">1. The Scope of Forensic Logging</h2>
          <p className="text-sm font-bold uppercase tracking-tight text-slate-500">Every interaction within the grid is classified as an "Auditable Event" and is logged with the following metadata:</p>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { title: "Origin Authentication", desc: "The specific Node ID and user credentials (encrypted) that initiated the event. No 'guest' or 'unauthenticated' actions are permitted within the core protocol." },
              { title: "Temporal Precision", desc: "Events are timestamped to the millisecond using synchronized atomic clocks, ensuring a definitive sequence for post-event analysis and forensic reconstruction." },
              { title: "Payload Integrity", desc: "A cryptographic hash of the message payload (SOS details, stock levels) is stored to detect any subsequent data tampering or unauthorized modifications." },
              { title: "Contextual Narrative", desc: "Mandatory clinical or logistical reasoning for status changes (e.g., 'Accepted', 'Cancelled', 'Purged'), providing a clear chain of intent for every action." }
            ].map(item => (
              <div key={item.title} className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-500">
                 <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
                   {item.title}
                 </h4>
                 <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">2. Tiered Access & Transparency</h2>
          <div className="space-y-6 text-[13px] font-bold uppercase tracking-tight leading-relaxed">
            <p className="p-8 bg-white border border-slate-100 rounded-3xl">
              <span className="text-slate-950 block mb-2 tracking-widest">Hospital & Blood Bank Nodes:</span> 
              Each institutional node has a dedicated "Log Terminal" where it can review its own transaction history. This enables local managers to monitor staff performance and stock accuracy without exposing neighboring node data. 
              <span className="block mt-4 text-[10px] text-slate-400">Node-level logs are restricted to the facility's authorized Admin role only.</span>
            </p>
            <p className="p-8 bg-white border border-slate-100 rounded-3xl">
              <span className="text-slate-950 block mb-2 tracking-widest">Regional Hub Controllers:</span> 
              Controllers have "Supervisory Visibility" over a designated geographic cluster. They can view real-time signal traffic to identify bottlenecks or systemic delays in their jurisdiction. 
              <span className="block mt-4 text-[10px] text-slate-400">Visibility is limited to logistical markers; clinical patient data remains obfuscated.</span>
            </p>
            <p className="p-8 bg-slate-900 text-slate-400 rounded-3xl border border-white/5 shadow-2xl">
              <span className="text-white block mb-2 tracking-widest">The Federal Audit Wing:</span> 
              Global administrators possess "Absolute Read Authority." This is strictly reserved for regulatory investigations, national reserve rebalancing, and system-wide security audits. All Admin actions are themselves logged to a secondary, external audit chain.
            </p>
          </div>
        </section>

        <section className="space-y-8 border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Retention & Legal Weight</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Archival Strategy</h4>
               <p className="text-sm font-bold uppercase tracking-tight text-slate-500 leading-relaxed">
                 Active logs are maintained on high-availability clusters for 36 months. Subsequently, records are moved to "Cold Storage" for an additional 4 years, meeting the 7-year retention requirement for national clinical data. All records are indexed for instant retrieval during official inquiries.
               </p>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Judicial Validity</h4>
               <p className="text-sm font-bold uppercase tracking-tight text-slate-500 leading-relaxed">
                 Every log entry is cryptographically signed with the system's private key and optionally timestamped with a third-party TSA (Time Stamping Authority). These logs are designed to serve as admissible digital evidence in the event of medical-legal disputes or regulatory inquiries.
               </p>
            </div>
          </div>
        </section>

        <section className="p-10 bg-rose-50 border border-rose-100 rounded-[3rem] text-center">
          <p className="text-[10px] font-black text-rose-700 uppercase tracking-[0.4em] mb-4">Core Audit Principle</p>
          <p className="text-lg font-black text-rose-900 uppercase tracking-tighter leading-tight italic">
            "Visibility is the deterrent. Accuracy is the goal. Trust is the result."
          </p>
          <p className="text-[10px] text-rose-600 mt-6 uppercase tracking-widest font-black">Official System Mandate • SWANIDHI v4.2</p>
        </section>
      </div>
    </LegalLayout>
  );
};

export default AuditCharter;
