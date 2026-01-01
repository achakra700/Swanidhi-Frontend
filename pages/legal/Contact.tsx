
import React from 'react';
import LegalLayout from './LegalLayout';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const Contact: React.FC = () => {
  return (
    <LegalLayout title="Contact" subtitle="Institutional Support Grid">
      <div className="space-y-12 text-slate-600">

        <section className="space-y-8">
          <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Logo className="h-12" variant="inverted" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-rose-500">24/7 Grid Support</h2>
            <p className="text-base font-bold uppercase tracking-tight leading-relaxed opacity-80">
              Authorized institutional nodes have access to the priority support hotline.
              For registration inquiries or node incidents, please use the following official channels:
            </p>
            <div className="pt-8 border-t border-white/10 space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Electronic Mail</p>
                <a href="mailto:support@swanidhi.gov.in" className="text-2xl font-black tracking-tighter hover:text-rose-500 transition-colors">SUPPORT@SWANIDHI.GOV.IN</a>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Administrative Headquarters</p>
                <p className="text-base font-bold uppercase tracking-tight leading-none">Sector-4 Regional Hub • New Delhi, IN</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Reporting Incidents</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              If you observe a security breach or stock discrepancy on the grid, please file an Incident Report (IR)
              immediately via your node dashboard or the official hotline.
            </p>
            <Button variant="outline" className="w-full py-4 rounded-2xl text-[10px]">Generate Incident Report</Button>
          </div>
          <div className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Partnership Inquiries</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
              State health departments or large hospital chains wishing to integrate their HIS with the SWANIDHI
              API should contact the Partnerships Division.
            </p>
            <Button variant="secondary" className="w-full py-4 rounded-2xl text-[10px]">Contact Partnerships</Button>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
};

export default Contact;
