
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDonorProfile, useDonorRequests, useAcceptDonation, useDeclineDonation } from '../hooks/useDonor';
import { EligibilityStatus } from '../types';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ScreeningWizard from '../components/donor/ScreeningWizard';

const DonorDashboard: React.FC = () => {
  const { showToast } = useToast();
  const { data: donor, isLoading } = useDonorProfile();
  const { data: requests, isLoading: requestsLoading } = useDonorRequests();
  const acceptDonation = useAcceptDonation();
  const declineDonation = useDeclineDonation();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'REQUESTS' | 'HISTORY' | 'VERIFY'>('PROFILE');
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (location.pathname.includes('/requests')) setActiveTab('REQUESTS');
    else if (location.pathname.includes('/history')) setActiveTab('HISTORY');
    else if (location.pathname.includes('/verify')) setActiveTab('VERIFY');
    else setActiveTab('PROFILE');
  }, [location.pathname]);

  const handleAction = (id: string, action: 'ACCEPTED' | 'DECLINED') => {
    if (action === 'ACCEPTED') {
      acceptDonation.mutate(id, {
        onSuccess: () => {
          showToast(`Donation scheduled for ${id}. Report to hub on the scheduled date.`, 'success');
        }
      });
    } else {
      declineDonation.mutate(id, {
        onSuccess: () => {
          showToast(`Request ${id} declined. Your availability has been updated.`, 'info');
        }
      });
    }
  };

  const pendingRequests = useMemo(() => requests?.filter((r: any) => r.status === 'PENDING') || [], [requests]);
  const acceptedRequests = useMemo(() => requests?.filter((r: any) => r.status === 'ACCEPTED') || [], [requests]);

  if (isLoading || requestsLoading) return <div className="p-10"><DashboardSkeleton /></div>;
  if (!donor) return null;

  const isVerified = donor.eligibility === EligibilityStatus.ELIGIBLE;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <header className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Donor Terminal</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Authenticated Node: {donor.userId}</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'PROFILE', label: 'Profile' },
            { id: 'VERIFY', label: 'Verify', hidden: isVerified },
            { id: 'REQUESTS', label: 'Requests' },
            { id: 'HISTORY', label: 'History' }
          ].filter(t => !t.hidden).map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveTab(v.id as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === v.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {v.label}
              {v.id === 'REQUESTS' && pendingRequests.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-rose-600 text-white rounded-md text-[8px]">{pendingRequests.length}</span>
              )}
              {!isVerified && v.id === 'VERIFY' && <span className="ml-2 w-1.5 h-1.5 bg-rose-600 rounded-full inline-block animate-pulse"></span>}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'PROFILE' && (
        <div className="space-y-8">
          {!isVerified && (
            <div className="bg-rose-950 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              </div>
              <div className="space-y-3 relative z-10 text-center md:text-left">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Grid Status: Non-Eligible</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">Node Synchronization Required</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Submit clinical assets to activate emergency broadcasts.</p>
              </div>
              <Button
                onClick={() => setActiveTab('VERIFY')}
                variant="secondary"
                className="rounded-2xl px-10 py-4 shadow-xl relative z-10"
              >
                Sync Node
              </Button>
            </div>
          )}

          <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-slate-50 text-center md:text-left">
              <div className="w-28 h-28 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-slate-200">{donor.bloodType}</div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">{donor.fullName}</h2>
                <div className="flex justify-center md:justify-start gap-4 items-center">
                  <StatusBadge status={donor.eligibility} />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Member since 2024</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Availability Protocol</p>
                  <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">{donor.nextEligibleDate || 'Verified: Ready'}</p>
                </div>
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Verification</p>
                    <span className="text-[10px] font-black text-rose-600">{Math.round(donor.verificationProgress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-rose-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(225,29,72,0.3)]" style={{ width: `${donor.verificationProgress}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Encrypted Contact</p>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">{donor.email}</p>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight mt-1">+{donor.phone}</p>
                </div>
                <div className="mt-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Manual Availability Protocol</p>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-black text-slate-900 uppercase">Ready for Pulse Broadcasts</span>
                    <button
                      onClick={() => { setIsAvailable(!isAvailable); showToast(`Availability updated: ${!isAvailable ? 'ON' : 'OFF'}`, 'info'); }}
                      className={`w-14 h-7 rounded-full transition-all relative ${isAvailable ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isAvailable ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-rose-50 rounded-[3rem] border border-rose-100 flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] mb-2">Burnout Prevention Protocol</h4>
                <p className="text-xl font-black text-slate-900 uppercase">Recovery Cooldown Active</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Next safe donation window: {donor.nextEligibleDate || 'Verified: No active cooldown'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-rose-600 tracking-tighter">90<span className="text-[10px] ml-1">DAYS</span></p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Standard Gap</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'VERIFY' && (
        <ScreeningWizard donor={donor} onComplete={() => setActiveTab('PROFILE')} />
      )}

      {activeTab === 'REQUESTS' && (
        <div className="space-y-10">
          {!isVerified && (
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5" /></svg>
              </div>
              <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Broadcasting Intercepted</h4>
              <p className="text-[11px] font-bold text-amber-700/70 uppercase max-w-md mx-auto leading-relaxed">Verification incomplete. Your node is currently hidden from local emergency signals to ensure supply chain compliance.</p>
            </div>
          )}

          {acceptedRequests.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Scheduled Appointments</h3>
              {acceptedRequests.map((req: any) => (
                <div key={req.id} className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-8 group animate-in slide-in-from-left-4 duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 font-black shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5" /></svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-emerald-950 uppercase tracking-tight leading-none">{req.hub}</h4>
                      <p className="text-[10px] font-bold text-emerald-700/60 uppercase tracking-widest mt-2">Reporting Date: {req.date} • Reference: {req.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Status</p>
                      <p className="text-[10px] font-black text-emerald-950 uppercase">Ready for Pickup</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-100" onClick={() => handleAction(req.id, 'DECLINED')}>Cancel Appt</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Active SOS Broadcasts</h3>
            {pendingRequests.length === 0 ? (
              <EmptyState title="Local Grid Clear" description="No active emergency signals for your blood group in this sector." />
            ) : (
              pendingRequests.map((req: any) => (
                <div key={req.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 group hover:shadow-xl hover:border-slate-200 transition-all duration-500">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-lg transition-all group-hover:scale-110 ${req.urgency === 'High' ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-slate-900 text-white shadow-slate-100'}`}>
                      {req.bloodType}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">{req.hub}</h4>
                      <div className="flex items-center gap-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date: {req.date}</p>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${req.urgency === 'High' ? 'text-rose-600 animate-pulse' : 'text-blue-500'}`}>{req.urgency} Urgency</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button
                      onClick={() => handleAction(req.id, 'ACCEPTED')}
                      className="flex-1 md:flex-none px-10 py-4 bg-slate-950 text-white rounded-2xl text-[11px] tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleAction(req.id, 'DECLINED')}
                      variant="outline"
                      className="flex-1 md:flex-none px-8 py-4 rounded-2xl text-[10px] tracking-widest text-slate-400 border-slate-100 hover:text-rose-600 hover:bg-rose-50"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Contribution Ledger</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing last 12 months</p>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Event Date</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Facility Hub</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(!requests || requests.filter((r: any) => r.status === 'COMPLETED' || r.status === 'DECLINED').length === 0) ? (
                <tr>
                  <td colSpan={4} className="p-0">
                    <EmptyState title="Ledger Vacant" description="Your contribution record will populate once first donation cycle is finalized." />
                  </td>
                </tr>
              ) : (
                requests.filter((r: any) => r.status === 'COMPLETED' || r.status === 'DECLINED').map((log: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6 text-xs font-bold uppercase text-slate-900">{log.date}</td>
                    <td className="px-10 py-6">
                      <p className="text-xs font-black uppercase text-slate-700 tracking-tight">{log.hub}</p>
                      <p className="text-[9px] font-mono text-slate-400 mt-1">REF: {log.id}</p>
                    </td>
                    <td className="px-10 py-6">
                      <StatusBadge status={log.status === 'COMPLETED' ? 'FULFILLED' : 'CANCELLED'} />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-lg font-black text-slate-950 tabular-nums">{log.units}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase ml-1">U</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="p-10 bg-slate-50 text-center border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Records are cryptographically signed by the National Health Authority. <br />Discrepancies must be reported via the Hub Incident Terminal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
