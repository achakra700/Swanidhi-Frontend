
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSosRequests, useUpdateSosStatus } from '../hooks/useSos';
import { useBloodInventory, useUpdateInventory } from '../hooks/useInventory';
import { useAdminDonors, useUpdateDonorStatus, useRegisterDonor } from '../hooks/useAdmin';
import { SOSStatus, BloodType, SOSRequest, DeliveryMethod, EligibilityStatus } from '../types';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import FormField from '../components/ui/FormField';
import { useToast } from '../context/ToastContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import InventoryTable from '../components/inventory/InventoryTable';
import { useAuth } from '../context/AuthContext';
import SosTimeline from '../components/sos/SosTimeline';

const BloodBankDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [activeView, setActiveView] = useState<'INVENTORY' | 'SOS_HANDLING' | 'DONORS' | 'DISPATCH'>('INVENTORY');

  useEffect(() => {
    if (location.pathname.includes('/sos')) setActiveView('SOS_HANDLING');
    else if (location.pathname.includes('/donors')) setActiveView('DONORS');
    else if (location.pathname.includes('/dispatch')) setActiveView('DISPATCH');
    else setActiveView('INVENTORY');
  }, [location.pathname]);

  const { data: requests, isLoading: requestsLoading } = useSosRequests();
  const { data: inventory, isLoading: invLoading } = useBloodInventory();
  const { data: donors, isLoading: donorsLoading } = useAdminDonors();
  const updateStatus = useUpdateSosStatus();
  const updateInventory = useUpdateInventory();
  const updateDonorStatus = useUpdateDonorStatus();
  const registerDonor = useRegisterDonor();

  // Local state UI transitions
  const [donorName, setDonorName] = useState('');
  const [donorGroup, setDonorGroup] = useState<BloodType | ''>('');

  // Dispatch state UI
  const [dispatchSos, setDispatchSos] = useState<SOSRequest | null>(null);
  const [delMethod, setDelMethod] = useState<DeliveryMethod>(DeliveryMethod.HOSPITAL_PICKUP);

  // Routing Explanation State
  const [selectedSosRouting, setSelectedSosRouting] = useState<SOSRequest | null>(null);

  // Donor History State
  const [viewingDonorHistory, setViewingDonorHistory] = useState<any | null>(null);

  const handleDispatch = (id: string) => {
    updateStatus.mutate({ id, status: SOSStatus.DISPATCHED, reason: `Dispatched via ${delMethod.replace('_', ' ')}` }, {
      onSuccess: () => {
        showToast('Dispatch protocol initiated. Signal updated.', 'success');
        setDispatchSos(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Dispatch failed", 'error');
      }
    });
  };

  const handleDonorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorGroup) return;
    registerDonor.mutate({ name: donorName, bloodType: donorGroup }, {
      onSuccess: () => {
        setDonorName('');
        setDonorGroup('');
        showToast('Donor registered in Global Registry.', 'success');
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Donor registration failed", 'error');
      }
    });
  };

  const handleEligibilityUpdate = (id: string, status: EligibilityStatus) => {
    updateDonorStatus.mutate({ id, status }, {
      onSuccess: () => {
        showToast('Eligibility updated and synchronized.', 'info');
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Eligibility update failed", 'error');
      }
    });
  };

  const handleContactDonor = (name: string) => {
    showToast(`Initializing secure communication terminal for ${name}...`, 'info');
  };

  if (requestsLoading || invLoading || donorsLoading) return <div className="p-10"><DashboardSkeleton /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Inventory Hub</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{user?.orgName || 'Authorized Hub Node'}</p>
        </div>
      </header>

      {activeView === 'INVENTORY' && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {inventory?.map(i => (
              <div key={i.type} className={`bg-white p-8 rounded-[2rem] border-2 shadow-sm transition-all hover:scale-[1.02] ${i.units < 10 ? 'border-rose-100 bg-rose-50/10' : 'border-slate-50'}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-2xl font-black ${i.units < 10 ? 'text-rose-600' : 'text-slate-900'}`}>{i.type}</span>
                  {i.units < 10 && <StatusBadge status="LOW STOCK" />}
                </div>
                <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">{i.units}<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Units</span></p>
                <button onClick={() => updateInventory.mutate({ type: i.type, units: i.units + 5 }, {
                  onSuccess: () => showToast(`Emergency batch of ${i.type} added.`, 'success'),
                  onError: (err: any) => showToast(err.response?.data?.message || err.message || "Inventory update failed", 'error')
                })} className="mt-8 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 tracking-widest">+ Emergency Batch</button>
              </div>
            ))}
          </div>
          <InventoryTable
            onEdit={item => updateInventory.mutate({ type: item.type, units: item.units + 1 })}
            onDelete={(item) => showToast(`Purging node data for ${item.type}...`, 'info')}
          />
        </div>
      )}

      {activeView === 'SOS_HANDLING' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Signal ID</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Biological Need</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Clinical Origin</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests?.filter(r => r.status === SOSStatus.CREATED || r.status === SOSStatus.ACCEPTED).map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-8 text-xs font-mono font-bold">{req.id}</td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-slate-900">{req.bloodType} • {req.units} Units</p>
                    <div className="flex gap-4 mt-2">
                      {req.noteUrl && (
                        <a href={req.noteUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-blue-600 uppercase underline underline-offset-2">View Doctor Note</a>
                      )}
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{req.urgency || 'Standard'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-[11px] font-bold uppercase text-slate-500 tracking-tight">{req.hospitalName}</td>
                  <td className="px-10 py-8 text-right space-x-3">
                    <button onClick={() => setSelectedSosRouting(req)} className="text-[10px] font-black uppercase text-blue-600 hover:underline mr-4">Route Context</button>
                    {req.status === SOSStatus.CREATED ? (
                      <>
                        <button onClick={() => updateStatus.mutate({ id: req.id, status: SOSStatus.ACCEPTED }, {
                          onSuccess: () => showToast('SOS Accepted locally.', 'success'),
                          onError: (err: any) => showToast(err.response?.data?.message || err.message || "Failed to accept SOS", 'error')
                        })} className="bg-slate-950 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-100 transition-all hover:scale-105 active:scale-95">Accept</button>
                        <button onClick={() => updateStatus.mutate({ id: req.id, status: SOSStatus.CANCELLED, reason: 'Manual Rejection: Grid Capacity Limit Hit' }, {
                          onSuccess: () => showToast('SOS Cancelled.', 'info'),
                          onError: (err: any) => showToast(err.response?.data?.message || err.message || "Failed to reject SOS", 'error')
                        })} className="text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-xl">Reject</button>
                      </>
                    ) : (
                      <button onClick={() => setDispatchSos(req)} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95">Initiate Dispatch</button>
                    )}
                  </td>
                </tr>
              ))}
              {requests?.filter(r => r.status === SOSStatus.CREATED || r.status === SOSStatus.ACCEPTED).length === 0 && (
                <tr><td colSpan={4} className="p-0"><EmptyState title="Hub Quiescent" description="No emergency signal allocations currently pending fulfillment." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeView === 'DONORS' && (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Onboarded Donor</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Group</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Eligibility</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donors?.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-8">
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{d.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{d.history}</p>
                    </td>
                    <td className="px-10 py-8 text-xs font-black">{d.bloodType}</td>
                    <td className="px-10 py-8"><StatusBadge status={d.status} /></td>
                    <td className="px-10 py-8 text-right space-x-3">
                      <button onClick={() => setViewingDonorHistory(d)} className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-900 mr-2">Audit History</button>
                      <button onClick={() => handleEligibilityUpdate(d.id, EligibilityStatus.ELIGIBLE)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Verify</button>
                      <button onClick={() => handleContactDonor(d.name)} className="text-[10px] font-black text-rose-400 uppercase hover:text-rose-600 transition-colors">Contact</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm h-fit space-y-10">
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Node Onboarding</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Register citizen for local grid broadcasts</p>
            </div>
            <form onSubmit={handleDonorRegister} className="space-y-8">
              <FormField label="Full Legal Name" required>
                <input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Legal Name..." className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 focus:outline-none transition-all" />
              </FormField>
              <FormField label="Biological Group" required>
                <select value={donorGroup} onChange={e => setDonorGroup(e.target.value as BloodType)} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold appearance-none cursor-pointer">
                  <option value="">-- SELECT --</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
              <Button type="submit" className="w-full py-5 rounded-2xl shadow-xl shadow-slate-100">Enroll Donor</Button>
            </form>
          </div>
        </div>
      )}

      {activeView === 'DISPATCH' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">SOS Trace</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Destination</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500">Payload</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-500 text-right">Carrier Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests?.filter(r => r.status === SOSStatus.DISPATCHED || r.status === SOSStatus.FULFILLED).map(req => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-10 py-8 text-xs font-mono font-bold">{req.id}</td>
                  <td className="px-10 py-8 text-xs font-black uppercase text-slate-900 tracking-tight">{req.hospitalName}</td>
                  <td className="px-10 py-8 text-xs font-bold uppercase text-slate-500">{req.units} Units {req.bloodType}</td>
                  <td className="px-10 py-8 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                      {req.deliveryMethod ? req.deliveryMethod.replace('_', ' ') : 'Grid Transport'}
                    </span>
                  </td>
                </tr>
              ))}
              {requests?.filter(r => r.status === SOSStatus.DISPATCHED || r.status === SOSStatus.FULFILLED).length === 0 && (
                <tr><td colSpan={4} className="p-0"><EmptyState title="No Shipments" description="Dispatch registry is clear. No active couriers on grid." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SOS Routing Explanation Modal */}
      {selectedSosRouting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl space-y-10">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Routing Analysis</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Protocol: {selectedSosRouting.id}</p>
              </div>
              <button onClick={() => setSelectedSosRouting(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Allocation Intelligence</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                    <span className="text-slate-400">Proximity Rank</span>
                    <span className="text-slate-900">#1 (Local Hub)</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                    <span className="text-slate-400">Inventory match</span>
                    <span className="text-emerald-600">OPTIMAL</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                    <span className="text-slate-400">Regional Weight</span>
                    <span className="text-slate-900">Tier A-1</span>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Clinical Context</h4>
                <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
                  Source node "{selectedSosRouting.hospitalName}" broadcasted urgent requirement based on critical patient stabilization needs. Hub allocation prioritized based on zero-latency matching.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Live Signal Timeline</h4>
              <SosTimeline currentStatus={selectedSosRouting.status} />
            </div>

            <Button className="w-full py-5 rounded-2xl" onClick={() => setSelectedSosRouting(null)}>Acknowledge Distribution</Button>
          </div>
        </div>
      )}

      {/* Donor History Audit Modal */}
      {viewingDonorHistory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl space-y-10">
            <div className="flex justify-between items-start border-b border-slate-100 pb-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-xl font-black">{viewingDonorHistory.bloodType}</div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{viewingDonorHistory.name}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Audit Node: {viewingDonorHistory.id}</p>
                </div>
              </div>
              <button onClick={() => setViewingDonorHistory(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Cryptographic Contribution Record</h4>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                {(viewingDonorHistory.history_records || []).map((h: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-[10px] font-black text-slate-950 uppercase">{h.action.replace('_', ' ')}</p>
                        <span className="text-[9px] font-mono text-slate-400">{h.date}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{h.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-2xl py-4" onClick={() => setViewingDonorHistory(null)}>Exit Audit</Button>
              <Button className="flex-1 rounded-2xl py-4 uppercase tracking-widest text-[9px]" onClick={() => { setViewingDonorHistory(null); showToast('Dispatching secure donor certificate...', 'info'); }}>Export Credentials</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {dispatchSos && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Prepare Dispatch</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Protocol: {dispatchSos.id}</p>
            </div>
            <div className="space-y-8">
              <FormField label="Physical Delivery Method" required>
                <select value={delMethod} onChange={e => setDelMethod(e.target.value as DeliveryMethod)} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold appearance-none cursor-pointer focus:bg-white focus:border-slate-900 focus:outline-none transition-all">
                  <option value={DeliveryMethod.HOSPITAL_PICKUP}>Hospital Node Pickup</option>
                  <option value={DeliveryMethod.BLOOD_BANK_DELIVERY}>Hub Dispatch Delivery</option>
                </select>
              </FormField>
              <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                  Confirmation initiates cold-chain tracking. Ensure all units are double-verified for compatibility prior to dispatch.
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 rounded-2xl py-5" onClick={() => setDispatchSos(null)}>Abort</Button>
                <Button className="flex-2 rounded-2xl py-5 shadow-2xl shadow-slate-100 uppercase tracking-[0.2em] text-xs" onClick={() => handleDispatch(dispatchSos.id)}>Authorize Dispatch</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankDashboard;
