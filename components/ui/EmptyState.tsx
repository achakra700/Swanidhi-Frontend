
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon }) => (
  <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 w-full min-h-[400px]">
    {icon ? (
      <div className="mb-6 text-slate-300">{icon}</div>
    ) : (
      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
    )}
    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-[11px] font-bold text-slate-400 max-w-[280px] leading-relaxed uppercase tracking-[0.2em]">{description}</p>
    <div className="mt-8 pt-8 border-t border-slate-100 w-32 flex justify-center">
      <div className="w-2 h-2 bg-slate-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

export default EmptyState;
