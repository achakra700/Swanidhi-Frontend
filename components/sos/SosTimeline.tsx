
import React from 'react';
import { SOSStatus } from '../../types';

interface Props {
  currentStatus: SOSStatus;
}

const STATUS_METADATA = {
  [SOSStatus.CREATED]: { label: 'Created', desc: 'Signal initial entry.' },
  [SOSStatus.ROUTED]: { label: 'Routed', desc: 'Node assignment complete.' },
  [SOSStatus.ACCEPTED]: { label: 'Accepted', desc: 'Inventory reserved.' },
  [SOSStatus.DISPATCHED]: { label: 'Dispatched', desc: 'In physical transit.' },
  [SOSStatus.FULFILLED]: { label: 'Fulfilled', desc: 'Received & Verified.' },
  [SOSStatus.CANCELLED]: { label: 'Cancelled', desc: 'Protocol aborted.' }
};

const STATUS_ORDER = [
  SOSStatus.CREATED,
  SOSStatus.ROUTED,
  SOSStatus.ACCEPTED,
  SOSStatus.DISPATCHED,
  SOSStatus.FULFILLED
];

const SosTimeline: React.FC<Props> = ({ currentStatus }) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === SOSStatus.CANCELLED;

  return (
    <div className="relative pl-10 space-y-12">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>
      
      {STATUS_ORDER.map((status, index) => {
        const isPast = index <= currentIndex;
        const isCurrent = index === currentIndex && !isCancelled;
        const meta = STATUS_METADATA[status];

        return (
          <div key={status} className={`relative transition-all duration-300 ${isPast ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`absolute -left-[30px] w-6 h-6 rounded-lg border-2 flex items-center justify-center bg-white transition-all ${
              isPast ? 'border-slate-900' : 'border-slate-200'
            }`}>
              {isPast && <div className="w-2 h-2 bg-slate-900 rounded-sm"></div>}
            </div>
            <div>
              <h4 className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                {meta.label}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tight">
                {meta.desc}
              </p>
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="relative pt-8 mt-8 border-t border-red-50">
          <div className="absolute -left-[30px] w-6 h-6 rounded-lg border-2 border-red-500 bg-white flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-red-600">Aborted</h4>
          <p className="text-[10px] font-bold text-red-400 uppercase mt-1 tracking-tight">
            Signal terminated by command.
          </p>
        </div>
      )}
    </div>
  );
};

export default SosTimeline;
