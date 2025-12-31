
import React from 'react';
import { SOSStatus, EligibilityStatus } from '../../types';

interface StatusBadgeProps {
  status: SOSStatus | EligibilityStatus | string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case SOSStatus.CREATED:
      case 'PENDING':
      case EligibilityStatus.PENDING_VERIFICATION:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case SOSStatus.ROUTED:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case SOSStatus.ACCEPTED:
      case 'ACTIVE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case SOSStatus.DISPATCHED:
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse-soft';
      case SOSStatus.FULFILLED:
      case EligibilityStatus.ELIGIBLE:
      case 'ELIGIBLE':
      case 'STABLE':
        return 'bg-green-50 text-green-700 border-green-200';
      case SOSStatus.CANCELLED:
      case EligibilityStatus.INELIGIBLE:
      case 'INELIGIBLE':
      case 'CRITICAL':
      case 'LOW STOCK':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse-soft';
      case EligibilityStatus.DEFERRED:
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border transition-all duration-500 ${getStyles()} ${className}`}>
      {status.replace('_', ' ').replace('VERIFICATION', '')}
    </span>
  );
};

export default StatusBadge;
