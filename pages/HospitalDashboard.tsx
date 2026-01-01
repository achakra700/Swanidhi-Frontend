
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSosRequests, useCreateSosRequest, useUpdateSosStatus } from '../hooks/useSos';
import { usePatients, useCreatePatient, useTogglePatient } from '../hooks/usePatient';
import { SOSStatus, BloodType } from '../types';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import StatusBadge from '../components/ui/StatusBadge';
import { useToast } from '../context/ToastContext';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import SosTimeline from '../components/sos/SosTimeline';

const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  const { data: requests, isLoading: requestsLoading } = useSosRequests();
  const { data: patients, isLoading: patientsLoading } = usePatients();
  const createSos = useCreateSosRequest();
  const updateStatus = useUpdateSosStatus();
  const createPatient = useCreatePatient();
  const togglePatient = useTogglePatient();

  const [activeTab, setActiveTab] = useState<'PATIENTS' | 'REQUESTS' | 'TRACKING'>('PATIENTS');

  useEffect(() => {
    if (location.pathname.includes('/request')) setActiveTab('REQUESTS');
    else if (location.pathname.includes('/sos')) setActiveTab('TRACKING');
    else setActiveTab('PATIENTS');
  }, [location.pathname]);

  const [newPatientName, setNewPatientName] = useState('');

  // Local state for New Request
  const [reqBloodType, setReqBloodType] = useState<BloodType | ''>('');
  const [reqUnits, setReqUnits] = useState(1);
  const [reqUrgency, setReqUrgency] = useState<'Standard' | 'High' | 'Immediate'>('Standard');
  const [reqPatientId, setReqPatientId] = useState('');
  const [reqDoc, setReqDoc] = useState<File | null>(null);

  // Fulfillment State
  const [confirmingReceiptId, setConfirmingReceiptId] = useState<string | null>(null);
  const [fulfillmentRemark, setFulfillmentRemark] = useState('');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;
    createPatient.mutate({ fullName: newPatientName }, {
      onSuccess: () => {
        setNewPatientName('');
        showToast('Patient ID Generated', 'success');
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Failed to create patient record", 'error');
      }
    });
  };

  const handleTogglePatient = (id: string, currentStatus: boolean) => {
    togglePatient.mutate({ id, isActive: !currentStatus }, {
      onSuccess: () => {
        showToast('Patient access state updated', 'info');
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Failed to toggle patient state", 'error');
      }
    });
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqBloodType || !reqPatientId || !reqDoc) {
      showToast('Mandatory clinical note/doctor note missing', 'error');
      return;
    }

    createSos.mutate({
      patientId: reqPatientId,
      bloodType: reqBloodType,
      units: reqUnits,
      urgency: reqUrgency,
      document: [reqDoc]
    }, {
      onSuccess: () => {
        showToast('SOS Signal Transmitted to Grid', 'success');
        setActiveTab('TRACKING');
        // Reset form
        setReqBloodType('');
        setReqUnits(1);
        setReqUrgency('Standard');
        setReqPatientId('');
        setReqDoc(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "SOS transmission failed", 'error');
      }
    });
  };

  const handleConfirmReceipt = () => {
    if (!confirmingReceiptId) return;
    updateStatus.mutate({
      id: confirmingReceiptId,
      status: SOSStatus.FULFILLED,
      reason: `Blood units verified by Clinical Officer. Remarks: ${fulfillmentRemark || 'None'}`
    }, {
      onSuccess: () => {
        showToast('Receipt Confirmed. Lifecycle Complete.', 'success');
        setConfirmingReceiptId(null);
        setFulfillmentRemark('');
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || err.message || "Confirmation failed", 'error');
      }
    });
  };

  if (requestsLoading || patientsLoading) return <div className="p-10"><DashboardSkeleton /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Clinical Operations</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{user?.orgName || 'Facility Delta'}</p>
        </div>
      </header>

      {activeTab === 'PATIENTS' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Registry ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Legal Name</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 text-xs font-mono font-bold">{p.id}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 uppercase tracking-tight">{p.fullName}</td>
                    <td className="px-8 py-5"><StatusBadge status={p.isActive ? 'ACTIVE' : 'DEACTIVATED'} /></td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => handleTogglePatient(p.id, p.isActive)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Toggle Access</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm h-fit">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8">Provision ID</h3>
            <form onSubmit={handleAddPatient} className="space-y-6">
              <FormField label="Patient Legal Name" required>
                <input value={newPatientName} onChange={e => setNewPatientName(e.target.value)} placeholder="Legal Name..." className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-slate-900 focus:outline-none transition-all" />
              </FormField>
              <Button type="submit" className="w-full py-4 rounded-2xl">Generate ID</Button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'REQUESTS' && (
        <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">Initiate SOS Signal</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Institutional protocol v4.2</p>
          </div>
          <form onSubmit={handleCreateRequest} className="space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <FormField label="Registry ID" required>
                <select value={reqPatientId} onChange={e => setReqPatientId(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold appearance-none cursor-pointer">
                  <option value="">-- SELECT --</option>
                  {patients?.filter((p: any) => p.isActive).map((p: any) => (<option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>))}
                </select>
              </FormField>
              <FormField label="Blood Type" required>
                <select value={reqBloodType} onChange={e => setReqBloodType(e.target.value as BloodType)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold appearance-none cursor-pointer">
                  <option value="">-- SELECT --</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <FormField label="Units (U)" required>
                <input type="number" min={1} max={10} value={reqUnits} onChange={e => setReqUnits(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" />
              </FormField>
              <FormField label="Urgency" required>
                <select value={reqUrgency} onChange={e => setReqUrgency(e.target.value as any)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold appearance-none cursor-pointer">
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                  <option value="Immediate">Immediate</option>
                </select>
              </FormField>
            </div>
            <FormField label="Clinical Authorization (PDF/IMG)" required>
              <div className="relative border-4 border-dashed border-slate-100 p-12 rounded-[2.5rem] bg-slate-50 hover:bg-white transition-all cursor-pointer text-center group">
                <input type="file" accept="image/*,.pdf" onChange={e => setReqDoc(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center text-slate-300 group-hover:text-rose-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{reqDoc ? reqDoc.name : 'Upload Doc Note'}</p>
              </div>
            </FormField>
            <Button type="submit" variant="emergency" className="w-full py-6 rounded-2xl shadow-2xl shadow-rose-100 uppercase tracking-[0.3em]">Broadcast SOS Signal</Button>
          </form>
        </div>
      )}

      {activeTab === 'TRACKING' && (
        <div className="space-y-8">
          {requests?.length === 0 ? (
            <EmptyState title="No Active Signals" description="Facility is currently clinical-ready. No broadcasts originated from this node." />
          ) : (
            requests?.map(req => (
              <div key={req.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-50">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl ${req.urgency === 'Immediate' ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-slate-900 text-white shadow-slate-100'}`}>{req.bloodType}</div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{req.id}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient: {req.patientId} • Requirement: {req.units}U • Urgency: {req.urgency || 'Standard'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {req.status === SOSStatus.DISPATCHED && (
                      <Button onClick={() => setConfirmingReceiptId(req.id)} size="sm" variant="clinical" className="rounded-xl px-10">Confirm Receipt</Button>
                    )}
                    <StatusBadge status={req.status} />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-12 items-start">
                  <div className="md:col-span-2">
                    <SosTimeline currentStatus={req.status} />
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 h-full">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing Context</h4>
                    <div className="space-y-4 text-xs font-bold uppercase tracking-tight text-slate-600">
                      <div className="flex justify-between items-center pb-2 border-b border-white">
                        <span>Signal Integrity</span>
                        <span className="text-emerald-600">VERIFIED</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-white">
                        <span>Hub Handshake</span>
                        <span className="text-slate-900">NODE-R4</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Dispatch ETA</span>
                        <span className="text-rose-600">REAL-TIME</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmingReceiptId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl space-y-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Confirm Receipt</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Audit Closure Protocol</p>
            </div>
            <FormField label="Clinical Remarks (Optional)">
              <textarea
                value={fulfillmentRemark}
                onChange={e => setFulfillmentRemark(e.target.value)}
                placeholder="Notes on unit verification, temp check, etc..."
                rows={4}
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-900 focus:outline-none transition-all text-sm font-bold placeholder:text-slate-300"
              />
            </FormField>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-2xl py-5" onClick={() => setConfirmingReceiptId(null)}>Abort</Button>
              <Button variant="clinical" className="flex-2 rounded-2xl py-5 shadow-xl shadow-blue-100" onClick={handleConfirmReceipt}>Authorize Delivery</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
