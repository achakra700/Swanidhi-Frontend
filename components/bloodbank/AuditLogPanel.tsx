
import React from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { InventoryAction } from '../../types';
import { AuditLogSkeleton } from '../ui/Skeleton';

const AuditLogPanel: React.FC = () => {
  const { data: logs, isLoading } = useAuditLogs();

  const getActionTheme = (action: InventoryAction) => {
    switch (action) {
      case InventoryAction.NODE_AUTH:
        return {
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )
        };
      case InventoryAction.NODE_REJECT:
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case InventoryAction.SOS_DISPATCH: 
        return {
          color: 'text-orange-500',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )
        };
      case InventoryAction.SOS_ACCEPT: 
        return {
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case InventoryAction.SOS_REJECT: 
        return {
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case InventoryAction.STOCK_UPDATE: 
        return {
          color: 'text-slate-400',
          bg: 'bg-slate-400/10',
          border: 'border-slate-400/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )
        };
      default: 
        return {
          color: 'text-slate-500',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const renderDetails = (details: string) => {
    // Parsing Logic for Node Actions
    if (details.includes('AUTHORIZED Node:')) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Security Clearance Granted</p>
          </div>
          <p className="text-[13px] font-medium text-slate-200 leading-relaxed pt-1">
            {details}
          </p>
        </div>
      );
    }

    if (details.includes('REASON >>')) {
      const [msg, reason] = details.split('REASON >>').map(s => s.trim());
      return (
        <div className="space-y-4">
          <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight leading-none opacity-80">
            {msg}
          </p>
          <div className="bg-red-950/30 border-l-2 border-red-600 p-5 rounded-r-2xl shadow-lg transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">Mandatory Narrative</p>
            </div>
            <p className="text-[13px] font-medium text-slate-200 leading-relaxed italic pt-2">
              "{reason}"
            </p>
          </div>
        </div>
      );
    }
    
    if (details.includes('INFO >>')) {
      const [msg, info] = details.split('INFO >>').map(s => s.trim());
      return (
        <div className="space-y-4">
          <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-tight leading-none opacity-80">
            {msg}
          </p>
          <div className="bg-blue-950/30 border-l-2 border-blue-600 p-5 rounded-r-2xl shadow-lg transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.25em]">Allocation confirmed</p>
            </div>
            <p className="text-[11px] font-bold text-slate-200 uppercase tracking-[0.2em] pt-2">
              {info.replace(/\|/g, ' • ')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <p className="text-[13px] font-medium text-slate-400 tracking-tight leading-relaxed">
        {details}
      </p>
    );
  };

  return (
    <div className="bg-slate-950 rounded-[2.5rem] p-10 h-[700px] flex flex-col overflow-hidden shadow-2xl border border-white/5 relative group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-white/10 shadow-inner">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.45em] text-white">Security Audit Log</h3>
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em] mt-2">Immutable National Registry</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest leading-none mb-1">LIVE STREAM</span>
          <span className="text-[9px] font-mono text-green-500/40 uppercase tracking-widest">ENCRYPTED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10 scroll-smooth">
        {isLoading ? (
          <AuditLogSkeleton />
        ) : !logs || logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700">
             <div className="w-16 h-16 mb-6 border border-dashed border-slate-900 rounded-[2.5rem] flex items-center justify-center opacity-20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             </div>
             <p className="text-[11px] font-bold uppercase tracking-[0.4em]">Node Registry Vacant</p>
          </div>
        ) : (
          <div className="relative pl-7 space-y-8">
            <div className="absolute left-[13px] top-0 bottom-0 w-px bg-white/5"></div>
            {logs.map((log) => {
              const theme = getActionTheme(log.action);
              return (
                <div key={log.id} className="group relative hover:bg-white/[0.02] transition-all rounded-3xl p-5 -ml-5 border border-transparent hover:border-white/5">
                  <div className={`absolute left-[13px] top-8 w-2 h-2 rounded-full -translate-x-1/2 z-20 border-2 border-slate-950 ${theme.color.replace('text', 'bg')}`}></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 ${theme.bg} ${theme.color} rounded-xl flex items-center justify-center border ${theme.border} group-hover:scale-110 transition-transform shadow-inner`}>
                        {theme.icon}
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.25em] ${theme.color}`}>
                        {log.action.replace('SOS_', '').replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-700 group-hover:text-slate-500 transition-colors">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="pl-1">
                    {renderDetails(log.details)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-5 relative z-10">
        <button className="flex items-center gap-4 text-[11px] font-bold text-slate-600 uppercase tracking-[0.4em] hover:text-white transition-all group/btn">
          <svg className="w-4 h-4 group-hover/btn:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Audit Archive (SHA-256)
        </button>
      </div>
    </div>
  );
};

export default AuditLogPanel;