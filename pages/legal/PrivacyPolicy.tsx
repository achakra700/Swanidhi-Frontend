
import React from 'react';
import LegalLayout from './LegalLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy" subtitle="v2025.01-Stable">
      <div className="space-y-10 text-slate-600 text-[13px] font-bold uppercase tracking-tight leading-relaxed">
        
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mb-8">
          <p className="text-rose-700 text-[11px] font-black tracking-widest italic">
            "This platform does not replace medical judgment or institutional protocols. Privacy is handled at the institutional node level."
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">1. Scope of Policy</h2>
          <p>
            This policy outlines how SWANIDHI collects, stores, and utilizes data pertaining to institutional entities 
            and verified individuals within the coordination grid.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">2. Information Collected</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="text-slate-900">User Account Details:</span> Authorized personnel names, official email identifiers, and role-based permissions.</li>
            <li><span className="text-slate-900">Organization Details:</span> Registered legal names, government license identifiers, and physical facility coordinates.</li>
            <li><span className="text-slate-900">Verification Assets:</span> Digital copies of operational licenses and clinical credentials for node onboarding.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">3. Purpose of Collection</h2>
          <p>
            Data is strictly utilized for emergency coordination, institutional verification, and maintaining a national 
            audit trail of life-saving logistics. No data is harvested for commercial purposes or secondary marketing.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">4. Data Storage & Security</h2>
          <p>
            All data in transit is encrypted using TLS 1.3 protocols. At rest, data is stored in secured environments with 
            restricted access controls. Platform administrators do not have access to clinical notes except during 
            authorized audit events.
          </p>
        </section>

        <section className="space-y-4 border-t border-slate-100 pt-10">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">5. Data Sharing</h2>
          <p>
            Information is shared only between participating institutional nodes (e.g., Hospital-to-Blood-Bank) during 
            an active SOS event. We comply with all legal or regulatory requirements for disclosure to national health 
            authorities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">6. User Rights</h2>
          <p>
            Institutions retain the right to access, correct, or request the deactivation of their node. Deactivation 
            may be subject to record retention laws for audit trails.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
