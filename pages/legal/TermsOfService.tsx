
import React from 'react';
import LegalLayout from './LegalLayout';

const TermsOfService: React.FC = () => {
  return (
    <LegalLayout title="Terms of Service" subtitle="Institutional Master Agreement">
      <div className="space-y-10 text-slate-600 text-[13px] font-bold uppercase tracking-tight leading-relaxed">
        
        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">1. Platform Purpose</h2>
          <p>
            SWANIDHI is a Coordination-as-a-Service platform. It provides the technological infrastructure for 
            blood logistics and does not act as a blood supplier, medical provider, or logistics carrier.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">2. Eligibility & Authorized Use</h2>
          <p>
            Access is restricted to licensed hospitals and registered blood banks in the Republic of India. 
            Unauthorized access by individuals or non-medical entities is strictly prohibited and subject to 
            legal prosecution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">3. User Responsibilities</h2>
          <p>
            Users are responsible for the accuracy of stock levels and emergency signals initiated from their nodes. 
            All SOS requests must correspond to a genuine clinical emergency.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">4. Institutional Verification</h2>
          <p>
            Nodes are activated only after a federal audit of registration documents. SWANIDHI reserves the right 
            to suspend any node found to be in violation of health safety norms or data integrity protocols.
          </p>
        </section>

        <section className="space-y-4 border-t border-slate-100 pt-10">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">5. Limitations of Liability</h2>
          <p>
            While we strive for 99.9% uptime, SWANIDHI is not liable for outcomes resulting from network outages, 
            incorrect stock reporting by institutions, or delays in physical logistics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">6. Suspension & Termination</h2>
          <p>
            Violation of these terms or misuse of the emergency signal will result in immediate node termination 
            and reporting to the appropriate regulatory hub.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-slate-900 font-black tracking-widest text-sm">7. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction 
            of the courts in the region of the primary administrative hub.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
};

export default TermsOfService;
