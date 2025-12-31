
import React from 'react';
import { useSosRequests } from '../hooks/useSos';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import SosTimeline from '../components/sos/SosTimeline';
import EmptyState from '../components/ui/EmptyState';

const PatientDashboard: React.FC = () => {
  const { data: requests, isLoading } = useSosRequests();

  if (isLoading) return <div className="p-10"><DashboardSkeleton /></div>;

  // For demo, patient sees requests where they are the ID
  const myRequests = requests?.filter(r => r.patientId === 'P-101' || r.patientId === 'P-102') || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="bg-white p-8 rounded-2xl border border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recovery Tracker</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time signal monitoring</p>
        </div>
        <div className="flex gap-4">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase text-slate-400">Node Synchronized</span>
        </div>
      </header>

      {myRequests.length === 0 ? (
        <EmptyState title="No Active Signals" description="You have no active blood requests registered in the grid." />
      ) : (
        <div className="space-y-8">
           {myRequests.map(req => (
             <div key={req.id} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-50">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Protocol</p>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{req.id}</h2>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <StatusBadge status={req.status} />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Assigned Nodes</h3>
                      <div className="space-y-4">
                         <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-black">H</div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hospital Node</p>
                               <p className="text-xs font-bold uppercase text-slate-900">{req.hospitalName}</p>
                            </div>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-black">B</div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserve Hub</p>
                               <p className="text-xs font-bold uppercase text-slate-900">{req.status === 'CREATED' ? 'Awaiting Allocation' : 'Sector-4 Metro Bank'}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                      <div className="space-y-3">
                         {[
                           { msg: 'SOS Signal accepted by National Grid', ts: 'Just now' },
                           { msg: 'Clinical narrative verified by duty officer', ts: '5m ago' },
                           { msg: 'Inventory reservation active in Sector-4', ts: '10m ago' },
                         ].map((n, i) => (
                           <div key={i} className="flex justify-between items-start p-3 hover:bg-slate-50 rounded-lg transition-colors">
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{n.msg}</p>
                              <span className="text-[9px] font-black text-slate-300 uppercase whitespace-nowrap">{n.ts}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8">Signal Progress</h3>
                  <SosTimeline currentStatus={req.status} />
                </div>
             </div>
           ))}
        </div>
      )}

      <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-200 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
          Contact your hospital ward for non-logistical medical updates. SWANIDHI tracking is restricted to blood supply chain visibility only.
        </p>
      </div>
    </div>
  );
};

export default PatientDashboard;
