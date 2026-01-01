
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SosTimeline from '../components/sos/SosTimeline';
import { useSosDetail } from '../hooks/useSos';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

const SOSDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sos, isLoading } = useSosDetail(id || '');

  if (isLoading || !sos) return <div className="p-10"><DashboardSkeleton /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-left-4 duration-500">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 transition-all shadow-sm focus:outline-none"
            aria-label="Return to Command"
          >
            <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Signal Trace: {sos.id}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.3em]">Institutional Logistical Stream Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none">Security: Grid Multi-Verified</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white rounded-[4rem] p-12 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in duration-700">
            <SosTimeline currentStatus={sos.status} />
          </div>

          <div className="bg-slate-900 rounded-[3.5rem] p-10 h-80 relative overflow-hidden shadow-2xl group border border-white/5">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 50Q200 100 400 50T800 100" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M0 200Q200 150 400 200T800 150" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M200 0V400" stroke="#334155" strokeWidth="1" />
                <path d="M400 0V400" stroke="#334155" strokeWidth="1" />
                <path d="M600 0V400" stroke="#334155" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-2">Satellite Telemetry</p>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Courier Trace</h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest">
                  Status: {sos.status}
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/40">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A2 2 0 013 15.487V6.035a2 2 0 011.246-1.848l5.447-2.421a2 2 0 011.614 0l5.447 2.421a2 2 0 011.246 1.848v9.452a2 2 0 01-1.246 1.848l-5.447 2.724a2 2 0 01-1.614 0z" strokeWidth="2" /></svg>
                </div>
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[65%] animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth="2" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
          <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">Allocation Protocol</h3>
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biological Class</p>
                  <p className="text-5xl font-black tracking-tighter">{sos.bloodType}</p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Volume</p>
                  <p className="text-5xl font-black tracking-tighter">{sos.units}U</p>
                </div>
                <div className="pt-10 border-t border-white/5 space-y-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Origin Authority</p>
                  <p className="text-sm font-bold uppercase tracking-tight leading-tight">{sos.hospitalName}</p>
                  <p className="text-[9px] font-mono text-slate-500 tracking-widest">REF_PATIENT: {sos.patientId}</p>
                </div>
              </div>
            </div>
          </div>

          {sos.noteUrl && (
            <div className="bg-white p-10 rounded-[3rem] border-2 border-emerald-50 shadow-sm space-y-6 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Authorization Doc</p>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Verified Node Attachment</p>
                </div>
              </div>
              <a
                href={sos.noteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="secondary" className="w-full py-4 rounded-2xl text-[10px] border-emerald-100 hover:border-emerald-500 hover:text-emerald-700">
                  Open Medical Note
                </Button>
              </a>
            </div>
          )}

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-8">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200 text-2xl font-black text-slate-950">
              HUB
            </div>
            <div>
              <p className="text-sm font-black text-slate-950 uppercase tracking-tight">Regional Hub Reserve</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Allocation Controller</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSDetail;
