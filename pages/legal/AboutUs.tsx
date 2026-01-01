
import React from 'react';
import LegalLayout from './LegalLayout';
import Logo from '../../components/ui/Logo';

const AboutUs: React.FC = () => {
  return (
    <LegalLayout title="Institutional Profile" subtitle="Platform Overview v4.2">
      <div className="space-y-16 text-slate-600">

        <section className="space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
            <Logo className="h-24" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">1. Architectural Intent</h2>
          <div className="space-y-6 text-lg font-medium leading-relaxed uppercase tracking-tight">
            <p>
              SWANIDHI represents the first national-scale attempt to transition emergency blood logistics from a "pull-based" manual inquiry system to a "push-based" real-time synchronization layer.
              Historically, the Indian healthcare system has functioned through fragmented silos where blood availability was communicated via telephonic calls, informal social groups, and unverified public requests.
            </p>
            <p>
              Our infrastructure introduces a neutral, centralized registry that acts as a Single Source of Truth (SSoT) for hospitals and blood banks. By digitizing the "Golden Hour" workflow, we reduce the time-to-allocation from hours to minutes, ensuring clinical readiness is always prioritized over logistical guesswork.
            </p>
            <p className="text-base text-slate-400">
              The platform architecture is built on a distributed node model, where each facility maintains its own data sovereignty while participating in a shared visibility grid. This ensures that while local control is preserved, national-level insights can be derived to prevent regional stock-outs before they occur.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10 border-b border-slate-200 pb-4">2. The Ethos of SWANIDHI</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">SWA (Self/Collective)</div>
              <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-relaxed">
                Refers to the collective autonomy of the medical fraternity. It signifies a system where every participating hospital and donor functions as an active node of a self-healing grid. "Swa" is the commitment to local accountability within a national mission.
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-tight">
                Empowering regional hubs to manage local reserves without external dependence.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">NIDHI (Resource/Trust)</div>
              <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-relaxed">
                Positions life-saving blood not as a commodity, but as a national treasure—a "Nidhi" that belongs to the people. SWANIDHI is the repository that guards this treasure through rigorous audit trails and institutional gatekeeping.
              </p>
              <p className="text-[11px] text-slate-400 uppercase tracking-tight">
                Securing the public good through tamper-evident digital guardianship.
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
              SYNTHESIS: COLLECTIVE RESPONSIBILITY OVER A SHARED PUBLIC RESOURCE.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. Strategic Problem Statements</h2>
          <div className="grid sm:grid-cols-2 gap-10">
            {[
              {
                title: "Logistical Fragmentation",
                desc: "Reliance on manual coordination leads to information decay. Real-time reserves are often invisible to trauma centers until it is too late."
              },
              {
                title: "Information Asymmetry",
                desc: "Patient families are often forced to find donors themselves, leading to exploitation. SWANIDHI shifts this burden back to institutional logistics."
              },
              {
                title: "Audit Incapacity",
                desc: "Informal requests leave no paper trail. SWANIDHI creates a permanent, encrypted audit log for every unit of blood requested and dispatched."
              },
              {
                title: "Geospatial Gaps",
                desc: "Blood reserves are often concentrated in urban hubs. Our grid enables visibility across district lines to optimize resource balancing."
              }
            ].map(item => (
              <div key={item.title} className="space-y-3">
                <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest">{item.title}</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">4. National Grid Standards</h2>
          <div className="space-y-6 text-sm font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
            <p>
              Every node on the SWANIDHI network must adhere to the "Minimum Viable Verification" protocol. This ensures that no signal enters the grid without clinical justification. The platform utilizes a Zero-Trust Security Model, meaning every interaction is verified, authorized, and logged regardless of its origin.
            </p>
            <p>
              To maintain system integrity, regional hubs perform periodic "Pulse Checks" on stock levels. Any discrepancy between digital inventory and physical units triggers an immediate administrative audit, preventing "ghost inventory" that could jeopardize trauma care schedules.
            </p>
          </div>
        </section>

        <section className="space-y-8 border-t border-slate-100 pt-16">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">5. Operational Stakeholders</h2>
          <div className="space-y-8">
            <div className="p-8 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Tier 1: Clinical Facilitators (Hospitals)
              </h4>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Authorized hospitals initiate emergency signals (SOS) verified by clinical notes. They are responsible for the clinical justification of every request on the grid. They act as the primary interface for patient-critical needs.
              </p>
            </div>
            <div className="p-8 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Tier 2: Logistical Reservoirs (Blood Banks)
              </h4>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Registered banks manage live inventory and fulfill SOS mandates. They act as the physical guardians of the national blood reserve, ensuring cold-chain integrity and rapid-response dispatch protocols are met at every step.
              </p>
            </div>
            <div className="p-8 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                Tier 3: The Unified Registry (Admins)
              </h4>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                Federal administrators oversee node authorization, security audits, and system health to ensure the integrity of the coordination layer. They manage the high-level policy engine that governs the network's behavior.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};

export default AboutUs;
