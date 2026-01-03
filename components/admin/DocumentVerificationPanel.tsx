/**
 * Document Verification Panel
 * Admin panel for reviewing document OCR results and approving/rejecting verifications
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPendingVerifications, approveVerification, rejectVerification, DocumentVerification } from '../../services/documentApi';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import EmptyState from '../ui/EmptyState';
import { useToast } from '../../context/ToastContext';

interface Props {
    onClose?: () => void;
}

const DocumentVerificationPanel: React.FC<Props> = ({ onClose }) => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [selectedDoc, setSelectedDoc] = useState<DocumentVerification | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');

    // Fetch pending verifications
    const { data: verifications, isLoading } = useQuery({
        queryKey: ['pendingVerifications'],
        queryFn: getPendingVerifications,
    });

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) => approveVerification(id, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingVerifications'] });
            showToast('Document verification approved', 'success');
            setSelectedDoc(null);
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Approval failed', 'error');
        },
    });

    // Reject mutation
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectVerification(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingVerifications'] });
            showToast('Document verification rejected', 'info');
            setSelectedDoc(null);
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Rejection failed', 'error');
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500';
            case 'processing': return 'bg-yellow-500 animate-pulse';
            case 'pending': return 'bg-slate-400';
            case 'failed': return 'bg-rose-500';
            default: return 'bg-slate-400';
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 70) return 'text-emerald-600 bg-emerald-50';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-rose-600 bg-rose-50';
    };

    if (isLoading) {
        return (
            <div className="p-10 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-sm text-slate-500">Loading verifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Document Verification Queue</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                            OCR-verified documents pending admin review
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            {verifications?.length || 0} Pending
                        </span>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Organization</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Document Type</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">OCR Status</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500">Confidence</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {verifications && verifications.length > 0 ? (
                            verifications.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-slate-900">{doc.organizationId}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">{doc.organizationType}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-xs font-bold uppercase text-slate-700">
                                            {doc.documentType.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${getStatusColor(doc.ocrStatus)}`} />
                                            <span className="text-[10px] font-bold uppercase text-slate-600">{doc.ocrStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        {doc.ocrResult ? (
                                            <span className={`text-xs font-black px-3 py-1 rounded-full ${getConfidenceColor(doc.ocrResult.confidenceScore)}`}>
                                                {doc.ocrResult.confidenceScore}%
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedDoc(doc)}
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            Review OCR
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-0">
                                    <EmptyState
                                        title="No Pending Documents"
                                        description="All document verifications have been processed."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Document Review Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] p-10 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Document Review</p>
                                <h2 className="text-2xl font-black uppercase tracking-tight">{selectedDoc.organizationId}</h2>
                                <p className="text-xs text-slate-500 mt-1">{selectedDoc.documentType.replace(/_/g, ' ')} • {selectedDoc.originalFileName}</p>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="3" />
                                </svg>
                            </button>
                        </div>

                        {/* OCR Results */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Extracted Fields */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Extracted Fields (OCR)</h4>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    {selectedDoc.ocrResult?.extractedFields ? (
                                        Object.entries(selectedDoc.ocrResult.extractedFields).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold uppercase text-slate-500">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className="text-sm font-bold text-slate-900">{value}</span>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400">No fields extracted</p>
                                    )}
                                </div>

                                {/* Confidence Score */}
                                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                                    <span className="text-[10px] font-black uppercase text-slate-500">OCR Confidence</span>
                                    <span className={`text-lg font-black px-4 py-2 rounded-xl ${getConfidenceColor(selectedDoc.ocrResult?.confidenceScore || 0)}`}>
                                        {selectedDoc.ocrResult?.confidenceScore || 0}%
                                    </span>
                                </div>

                                {/* Discrepancies */}
                                {selectedDoc.discrepancies && selectedDoc.discrepancies.length > 0 && (
                                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                                        <p className="text-[10px] font-black uppercase text-rose-600 mb-2">⚠️ Discrepancies Found</p>
                                        <ul className="text-xs text-rose-700 space-y-1">
                                            {selectedDoc.discrepancies.map((d, i) => (
                                                <li key={i}>• {d}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Raw Text */}
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Raw OCR Text</h4>
                                <div className="bg-slate-900 p-6 rounded-2xl h-64 overflow-y-auto">
                                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                                        {selectedDoc.ocrResult?.rawText || 'No text extracted'}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="border-t border-slate-100 pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField label="Approval Notes (Optional)">
                                    <textarea
                                        value={approvalNotes}
                                        onChange={(e) => setApprovalNotes(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        rows={2}
                                        placeholder="Notes for approval..."
                                    />
                                </FormField>
                                <FormField label="Rejection Reason (Required for rejection)">
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        rows={2}
                                        placeholder="Reason for rejection..."
                                    />
                                </FormField>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="danger"
                                    className="flex-1 py-4 rounded-2xl"
                                    disabled={rejectMutation.isPending || !rejectionReason.trim()}
                                    onClick={() => rejectMutation.mutate({ id: selectedDoc.id, reason: rejectionReason })}
                                >
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject Document'}
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1 py-4 rounded-2xl"
                                    disabled={approveMutation.isPending}
                                    onClick={() => approveMutation.mutate({ id: selectedDoc.id, notes: approvalNotes })}
                                >
                                    {approveMutation.isPending ? 'Approving...' : 'Approve Document'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentVerificationPanel;
