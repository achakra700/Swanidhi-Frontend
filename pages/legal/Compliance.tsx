
import React from 'react';
import LegalLayout from './LegalLayout';

const Compliance: React.FC = () => {
  return (
    <LegalLayout title="Regulatory Alignment" subtitle="Compliance Framework v4.2">
      <div className="space-y-16 text-slate-600">
        
        <section className="space-y-8">
          <p className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-relaxed">
            SWANIDHI is engineered as a secure coordination layer, not a direct medical repository. 
            Our compliance strategy is built on the principle of "Privacy by Design," aligning with both national healthcare standards and digital sovereignty mandates.
          </p>
        </section>

        <section className="space-y-12">
          <div className="grid gap-8">
             {[
               { 
                 title: "Alignment with ABDM (Ayushman Bharat Digital Mission)", 
                 desc: "Our data structures are designed to be interoperable with the Health Information Exchange (HIU) frameworks. We utilize standardized identifiers for facilities and verified personnel to ensure seamless future integration with the national digital health stack.",
                 badge: "Interoperability"
               },
               { 
                 title: "DPDP Act 2023 (Digital Personal Data Protection)", 
                 desc: "SWANIDHI enforces strict data minimization. We only collect the biological and logistical markers necessary for life-saving coordination. Consent is handled at the institutional level, and our role-based access control (RBAC) ensures no unauthorized data leakages occur during signal transmission.",
                 badge: "Data Sovereignty"
               },
               { 
                 title: "NBTC (National Blood Transfusion Council) Norms", 
                 desc: "Workflows within the platform are mapped to the NBTC Guidelines for Exchange of Blood. Every dispatch cycle includes verification checkpoints to maintain the integrity of the cold chain and donor-patient compatibility records.",
                 badge: "Clinical Standards"
               },
               { 
                 title: "ISO/IEC 27001 Preparedness", 
                 desc: "Information security management systems are baked into the core. This includes end-to-end encryption for verification documents (AES-256), TLS 1.3 for data in transit, and multi-factor authentication for administrative node overrides.",
                 badge: "Security Protocol"
               },
               { 
                 title: "Electronic Health Record (EHR) Security", 
                 desc: "Patient IDs within SWANIDHI are ephemeral and tokenized for logistics. We do not store permanent clinical histories, reducing the target surface for potential data breaches while ensuring delivery accuracy.",
                 badge: "Zero-Trust Architecture"
               }
             ].map(item => (
               <div key={item.title} className="flex flex-col md:flex-row gap-8 items-start p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner flex-shrink-0">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2.5" /></svg>
                  </div>
                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-3">
                        <h4 className="text-slate-900 font-black tracking-widest text-lg uppercase leading-none">{item.title}</h4>
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase rounded-full tracking-widest">{item.badge}</span>
                     </div>
                     <p className="text-sm font-bold uppercase tracking-tight leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        <section className="bg-slate-950 p-12 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-8 opacity-5">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
          </div>
          <h2 className="text-xl font-black uppercase tracking-[0.4em] text-rose-500">Audit & Accountability Policy</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Suspension Protocol</h4>
              <p className="text-xs font-bold uppercase tracking-tight opacity-70 leading-relaxed">
                In the event of a documented safety breach or non-compliance with the NBTC exchange norms, a node may be suspended within 300ms across the global grid. Re-activation requires a physical audit by a designated Regional Coordinator.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reporting Responsibility</h4>
              <p className="text-xs font-bold uppercase tracking-tight opacity-70 leading-relaxed">
                Every institutional node is legally responsible for the accuracy of stock reporting and the authenticity of SOS signals. Periodic random audits are conducted by the SWANIDHI Compliance Wing.
              </p>
            </div>
          </div>
        </section>

        <section className="pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            LAST COMPLIANCE AUDIT: 15 MARCH 2025 • GRID VERSION: 4.2-STABLE
          </p>
          <div className="flex gap-4">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">System-wide Compliance Check: PASS</span>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default Compliance;
