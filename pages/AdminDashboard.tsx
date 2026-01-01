
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminStats, usePendingOrganizations, useSystemHealth, useApproveOrganization, useRejectOrganization, useAdminDonors, useUpdateDonorStatus } from '../hooks/useAdmin';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { useRealtimeSosList } from '../hooks/useRealtimeSos';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SOSStatus, SOSRequest, EligibilityStatus, InventoryAction } from '../types';
import SosTimeline from '../components/sos/SosTimeline';

type AdminView = 'OVERVIEW' | 'ORG_APPROVAL' | 'DONOR_CONTROL' | 'SOS_MONITOR' | 'AUDIT_LOGS' | 'SYSTEM_HEALTH' | 'OVERRIDE';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [activeView, setActiveView] = useState<AdminView>('OVERVIEW');

  // Update view based on URL path
  useEffect(() => {
    if (location.pathname.includes('/orgs')) setActiveView('ORG_APPROVAL');
    else if (location.pathname.includes('/donors')) setActiveView('DONOR_CONTROL');
    else if (location.pathname.includes('/sos')) setActiveView('SOS_MONITOR');
    else if (location.pathname.includes('/audit')) setActiveView('AUDIT_LOGS');
    else if (location.pathname.includes('/health')) setActiveView('SYSTEM_HEALTH');
    else if (location.pathname.includes('/override')) setActiveView('OVERRIDE');
    else setActiveView('OVERVIEW');
  }, [location.pathname]);

  // Data hooks
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orgs, isLoading: orgsLoading } = usePendingOrganizations();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: logs } = useAuditLogs();
  const { data: sosList } = useRealtimeSosList();
  const { data: donorsFromApi, isLoading: donorsLoading } = useAdminDonors();

  // Mutations
  const approveMutation = useApproveOrganization();
  const rejectMutation = useRejectOrganization();
  const updateDonorStatusMutation = useUpdateDonorStatus();

  // UI State
  const [selectedSos, setSelectedSos] = useState<SOSRequest | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [adminRemark, setAdminRemark] = useState('');

  // Filters
  const [sosFilterStatus, setSosFilterStatus] = useState<string>('ALL');
  const [sosFilterGroup, setSosFilterGroup] = useState<string>('ALL');
  const [sosFilterUrgency, setSosFilterUrgency] = useState<string>('ALL');

  // Donor Search and Modal
  const [donorSearch, setDonorSearch] = useState('');
  const [selectedDonorHistory, setSelectedDonorHistory] = useState<any | null>(null);

  // Audit Filters
  const [auditFilterUser, setAuditFilterUser] = useState('');
  const [auditFilterAction, setAuditFilterAction] = useState<string>('ALL');
  const [auditFilterDateStart, setAuditFilterDateStart] = useState('');
  const [auditFilterDateEnd, setAuditFilterDateEnd] = useState('');

  const filteredDonors = useMemo(() => {
    if (!donorsFromApi) return [];
    return donorsFromApi.filter((d: any) =>
      d.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.bloodType.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(donorSearch.toLowerCase())
    );
  }, [donorsFromApi, donorSearch]);

  const filteredSosList = useMemo(() => {
    if (!sosList) return [];
    return sosList.filter(s => {
      const sMatch = sosFilterStatus === 'ALL' || s.status === sosFilterStatus;
      const gMatch = sosFilterGroup === 'ALL' || s.bloodType === sosFilterGroup;
      const uMatch = sosFilterUrgency === 'ALL' || s.urgency === sosFilterUrgency;
      return sMatch && gMatch && uMatch;
    });
  }, [sosList, sosFilterStatus, sosFilterGroup, sosFilterUrgency]);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log => {
      const uMatch = !auditFilterUser ||
        log.userId.toLowerCase().includes(auditFilterUser.toLowerCase()) ||
        log.userName.toLowerCase().includes(auditFilterUser.toLowerCase());

      const aMatch = auditFilterAction === 'ALL' || log.action === auditFilterAction;

      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      const startMatch = !auditFilterDateStart || logDate >= auditFilterDateStart;
      const endMatch = !auditFilterDateEnd || logDate <= auditFilterDateEnd;

      return uMatch && aMatch && startMatch && endMatch;
    });
  }, [logs, auditFilterUser, auditFilterAction, auditFilterDateStart, auditFilterDateEnd]);

  const handleDonorStatus = (id: string, nextStatus: EligibilityStatus) => {
    updateDonorStatusMutation.mutate({ id, status: nextStatus }, {
      onSuccess: () => {
        showToast(`Donor ${id} synchronized: ${nextStatus}`, 'success');
      }
    });
  };

  const handleExportCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      showToast('No logs available to export.', 'error');
      return;
    }

    showToast('Compiling secure audit trail export...', 'info');

    const headers = ['LOG_ID', 'TIMESTAMP', 'ACTION', 'OPERATOR_NAME', 'OPERATOR_ID', 'NARRATIVE'];
    const rows = filteredLogs.map(log => [
      log.id,
      log.timestamp,
      log.action,
      log.userName,
      log.userId,
      `"${log.details.replace(/"/g, '""')}"` // Sanitize CSV quotes
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `swanidhi_audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Registry archive dispatched to local storage.', 'success');
  };

  if (statsLoading || orgsLoading || healthLoading || donorsLoading) return <div className="p-10"><DashboardSkeleton /></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <header className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Governance</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Authorized Access Only</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'OVERVIEW', label: 'Monitor' },
            { id: 'ORG_APPROVAL', label: 'Registrations' },
            { id: 'DONOR_CONTROL', label: 'Donors' },
            { id: 'SOS_MONITOR', label: 'Signals' },
            { id: 'OVERRIDE', label: 'Override', variant: 'emergency' },
            { id: 'AUDIT_LOGS', label: 'Audit' },
            { id: 'SYSTEM_HEALTH', label: 'Health' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id as AdminView)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === v.id
                ? v.variant === 'emergency' ? 'bg-rose-600 text-white shadow-lg' : 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </header>

      {
        activeView === 'OVERVIEW' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: 'Hospitals', val: stats?.hospitals },
              { label: 'Blood Banks', val: stats?.banks },
              { label: 'Donors', val: stats?.donors },
              { label: 'Active SOS', val: stats?.activeSos },
              { label: 'Pending Approvals', val: orgs?.filter(o => o.status === 'PENDING').length || 0 },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-slate-400">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</p>
              </div>
            ))}
          </div>
        )
      }

      {
        activeView === 'ORG_APPROVAL' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">Pending Registrations</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Organization</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Type</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Reg ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgs?.filter(o => o.status === 'PENDING').map(org => (
                  <tr key={org.id} className="hover:bg-slate-50">
                    <td className="px-8 py-4">
                      <p className="text-sm font-bold text-slate-900">{org.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{org.location}</p>
                    </td>
                    <td className="px-8 py-4 text-xs font-bold uppercase">{org.type}</td>
                    <td className="px-8 py-4 text-xs font-mono font-bold">{org.regId}</td>
                    <td className="px-8 py-4 text-right space-x-3">
                      <button onClick={() => setSelectedOrg(org)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Review Docs</button>
                      <button onClick={() => approveMutation.mutate({ id: org.id, adminId: user!.id, adminName: user!.name })} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase">Approve</button>
                    </td>
                  </tr>
                ))}
                {orgs?.filter(o => o.status === 'PENDING').length === 0 && (
                  <tr><td colSpan={4} className="p-0"><EmptyState title="Registry Clear" description="No institutional applications awaiting audit." /></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )
      }

      {
        activeView === 'DONOR_CONTROL' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="SEARCH NAME, ID OR BLOOD GROUP..."
                  value={donorSearch}
                  onChange={e => setDonorSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all text-[11px] font-black uppercase tracking-widest shadow-inner"
                />
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="3" /></svg>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Grid Synchronization: Active
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-10 py-6 border-b border-slate-50">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Donor Registry Control</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Donor Node</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Biological Class</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Registry Status</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDonors.length > 0 ? (
                    filteredDonors.map((donor: any) => (
                      <tr key={donor.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-105 transition-transform">
                              {donor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-950 uppercase tracking-tight">{donor.name}</p>
                              <p className="text-[9px] font-mono text-slate-400 uppercase mt-1">ID: {donor.id} • SRC: {donor.registeredBy}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-2xl font-black text-slate-950 tracking-tighter">{donor.bloodType}</span>
                        </td>
                        <td className="px-10 py-6">
                          <StatusBadge status={donor.status} />
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={() => setSelectedDonorHistory(donor)}
                              className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                            >
                              Activity History
                            </button>
                            {donor.status === EligibilityStatus.PENDING_VERIFICATION ? (
                              <>
                                <button onClick={() => handleDonorStatus(donor.id, EligibilityStatus.ELIGIBLE)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-50">Approve</button>
                                <button onClick={() => handleDonorStatus(donor.id, EligibilityStatus.INELIGIBLE)} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-50">Decline</button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleDonorStatus(donor.id, donor.status === EligibilityStatus.ELIGIBLE ? EligibilityStatus.DEFERRED : EligibilityStatus.ELIGIBLE)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${donor.status === EligibilityStatus.ELIGIBLE
                                  ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                                  : 'bg-slate-900 text-white shadow-lg'
                                  }`}
                              >
                                {donor.status === EligibilityStatus.ELIGIBLE ? 'Suspend Account' : 'Activate Node'}
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:hidden">Authorized Protocol</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <EmptyState title="No Matching Donors" description="Adjust your query parameters to locate specific grid nodes." />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {
        activeView === 'SOS_MONITOR' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-4">
              <select value={sosFilterStatus} onChange={e => setSosFilterStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold uppercase">
                <option value="ALL">All Status</option>
                {Object.values(SOSStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={sosFilterGroup} onChange={e => setSosFilterGroup(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold uppercase">
                <option value="ALL">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={sosFilterUrgency} onChange={e => setSosFilterUrgency(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold uppercase">
                <option value="ALL">All Urgency</option>
                {['Immediate', 'High', 'Standard'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">SOS ID</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Group</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Urgency</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSosList.map(sos => (
                    <tr key={sos.id} className="hover:bg-slate-50">
                      <td className="px-8 py-4 text-xs font-mono font-bold">{sos.id}</td>
                      <td className="px-8 py-4 text-xs font-black">{sos.bloodType}</td>
                      <td className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">{sos.urgency || 'Standard'}</td>
                      <td className="px-8 py-4"><StatusBadge status={sos.status} /></td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => setSelectedSos(sos)} className="text-[10px] font-black uppercase text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg">Timeline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {
        activeView === 'OVERRIDE' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-rose-950 p-10 rounded-[3rem] text-white border border-rose-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 13c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" /></svg>
              </div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Emergency Override Terminal</h2>
                <p className="text-xs font-bold text-rose-300 uppercase tracking-widest">Authorized for Senior Governance only. Protocols initiated here bypass standard operational validation for life-safety critical scenarios.</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Active Grid Signals for Escalation</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Signal Node</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Source</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Current State</th>
                    <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Escalation Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sosList?.filter(s => s.status !== SOSStatus.FULFILLED && s.status !== SOSStatus.CANCELLED).map(sos => (
                    <tr key={sos.id} className="hover:bg-rose-50/30 transition-colors group">
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-950 uppercase tracking-tight">{sos.id}</p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase mt-1">Class: {sos.bloodType} • {sos.units} Units</p>
                      </td>
                      <td className="px-10 py-6 text-xs font-bold uppercase text-slate-600">{sos.hospitalName}</td>
                      <td className="px-10 py-6"><StatusBadge status={sos.status} /></td>
                      <td className="px-10 py-6 text-right">
                        <button
                          onClick={() => { showToast(`Initiating manual escalation for ${sos.id}...`, 'info'); setSelectedSos(sos); }}
                          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-600 transition-all"
                        >
                          Force Transition
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {
        activeView === 'SYSTEM_HEALTH' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Infrastructure Nodes</h3>
              <div className="space-y-4">
                {health?.probes.map((p: any) => (
                  <div key={p.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${p.status === 'UP' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                      <span className="text-[11px] font-bold uppercase text-slate-700">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{p.latency}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Service Integrity</h3>
              <div className="space-y-3">
                {['VITE_API_URL', 'SIGNALR_ENDPOINT', 'AUTH_GRID_ID', 'CORE_LOG_BUCKET'].map(key => (
                  <div key={key} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-slate-500 py-3 border-b border-slate-50">
                    <span>{key}</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black">VALIDATED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      {
        activeView === 'AUDIT_LOGS' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 w-full">
                  <FormField label="Operator / User ID">
                    <input
                      type="text"
                      placeholder="NAME OR ID..."
                      value={auditFilterUser}
                      onChange={e => setAuditFilterUser(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                    />
                  </FormField>
                  <FormField label="Action Protocol">
                    <select
                      value={auditFilterAction}
                      onChange={e => setAuditFilterAction(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase focus:ring-2 focus:ring-slate-900 outline-none transition-all cursor-pointer"
                    >
                      <option value="ALL">All Actions</option>
                      {Object.values(InventoryAction).map(a => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Cycle Start">
                    <input
                      type="date"
                      value={auditFilterDateStart}
                      onChange={e => setAuditFilterDateStart(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                    />
                  </FormField>
                  <FormField label="Cycle End">
                    <input
                      type="date"
                      value={auditFilterDateEnd}
                      onChange={e => setAuditFilterDateEnd(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                    />
                  </FormField>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 lg:flex-none py-4 rounded-xl"
                    onClick={() => {
                      setAuditFilterUser('');
                      setAuditFilterAction('ALL');
                      setAuditFilterDateStart('');
                      setAuditFilterDateEnd('');
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 lg:flex-none py-4 px-10 rounded-xl shadow-lg shadow-slate-100"
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                  {filteredLogs.length} Records In-View
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Registry Sync Active
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 space-y-4">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-5 p-6 hover:bg-slate-50 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 group">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex-shrink-0 flex items-center justify-center text-[10px] font-black group-hover:scale-105 transition-transform shadow-lg shadow-slate-100">
                        {log.action.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                          <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.2em]">{log.action.replace('_', ' ')}</p>
                          <p className="text-[9px] text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{log.details}</p>
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
                          <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-500">OP</div>
                          <p className="text-[10px] text-slate-900 uppercase font-black tracking-tight">
                            {log.userName}
                            <span className="mx-2 text-slate-200">|</span>
                            <span className="text-slate-400 font-mono text-[9px]">{log.userId}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No Matching Logs"
                    description="Adjust your governance filters to locate specific node interaction records."
                  />
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* SOS Timeline Modal */}
      {
        selectedSos && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] mb-2">Registry Monitoring</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Signal: {selectedSos?.id}</h2>
                </div>
                <button onClick={() => setSelectedSos(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg>
                </button>
              </div>
              <SosTimeline currentStatus={selectedSos?.status || SOSStatus.CREATED} />
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Metadata</h4>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Grid Origin</p>
                    <p className="text-xs font-bold uppercase">{selectedSos?.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Requirement</p>
                    <p className="text-xs font-bold uppercase">{selectedSos?.units} Units of {selectedSos?.bloodType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Donor History Modal */}
      {
        selectedDonorHistory && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-950 text-white rounded-3xl flex items-center justify-center text-2xl font-black">{selectedDonorHistory.bloodType}</div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{selectedDonorHistory.name}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry Node: {selectedDonorHistory.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDonorHistory(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" /></svg>
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Linked</p>
                    <p className="text-xs font-bold text-slate-900 uppercase">{selectedDonorHistory.phone}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-1 lowercase">{selectedDonorHistory.email}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Anchor</p>
                    <p className="text-xs font-bold text-slate-900 uppercase">{selectedDonorHistory.registeredBy}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">Protocol Interaction History</h4>
                  <div className="space-y-3">
                    {selectedDonorHistory.history.map((h: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 bg-rose-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-[10px] font-black text-slate-950 uppercase">{h.action.replace('_', ' ')}</p>
                            <span className="text-[9px] font-mono text-slate-400">{h.date}</span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-tight">{h.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50 flex gap-4">
                <Button
                  className="flex-1 rounded-2xl py-4 text-[10px] tracking-widest"
                  variant="outline"
                  onClick={() => handleDonorStatus(selectedDonorHistory.id, EligibilityStatus.DEFERRED)}
                >
                  Defer Node
                </Button>
                <Button
                  className="flex-1 rounded-2xl py-4 text-[10px] tracking-widest"
                  onClick={() => setSelectedDonorHistory(null)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Org Review Modal */}
      {
        selectedOrg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl space-y-10">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-black uppercase tracking-tight">Node Audit: {selectedOrg.name}</h2>
                <button onClick={() => setSelectedOrg(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" /></svg>
                </button>
              </div>
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certification Asset</p>
                    <p className="text-xs font-bold uppercase">License_Verification.pdf</p>
                  </div>
                  <button className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2">Open Doc</button>
                </div>
                <FormField label="Administrative Remarks">
                  <textarea
                    value={adminRemark}
                    onChange={e => setAdminRemark(e.target.value)}
                    className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-900 focus:outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                    rows={3}
                    placeholder="Justification for approval/rejection..."
                  />
                </FormField>
                <div className="flex gap-4">
                  <Button variant="danger" className="flex-1 rounded-2xl" onClick={() => { rejectMutation.mutate({ id: selectedOrg.id, reason: 'AUDIT_FAILED', note: adminRemark, adminId: user!.id, adminName: user!.name }); setSelectedOrg(null); }}>Reject Application</Button>
                  <Button variant="primary" className="flex-1 rounded-2xl" onClick={() => { approveMutation.mutate({ id: selectedOrg.id, adminId: user!.id, adminName: user!.name }); setSelectedOrg(null); }}>Approve Node</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminDashboard;
