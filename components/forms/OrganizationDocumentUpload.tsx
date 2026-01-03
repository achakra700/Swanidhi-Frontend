/**
 * Organization Document Upload Form
 * Used during hospital/blood bank registration for verification documents
 */

import React, { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadDocument } from '../../services/documentApi';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

interface Props {
    organizationId: string;
    organizationType: 'hospital' | 'bloodbank';
    onSuccess?: (verificationId: string) => void;
    onSkip?: () => void;
}

const OrganizationDocumentUpload: React.FC<Props> = ({
    organizationId,
    organizationType,
    onSuccess,
    onSkip,
}) => {
    const { showToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState<string>('registration_certificate');
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const documentTypes = [
        { value: 'registration_certificate', label: 'Registration Certificate' },
        { value: 'blood_bank_license', label: 'Blood Bank License' },
        { value: 'government_id', label: 'Government ID' },
        { value: 'authorization_letter', label: 'Authorization Letter' },
    ];

    const uploadMutation = useMutation({
        mutationFn: () => {
            if (!file) throw new Error('No file selected');
            return uploadDocument(file, organizationId, organizationType, documentType);
        },
        onSuccess: (data) => {
            showToast('Document uploaded successfully. OCR processing started.', 'success');
            onSuccess?.(data.id);
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || err.message || 'Upload failed', 'error');
        },
    });

    const handleFileChange = useCallback((selectedFile: File | null) => {
        if (!selectedFile) {
            setFile(null);
            setPreview(null);
            return;
        }

        // Validate file
        if (selectedFile.size > MAX_FILE_SIZE) {
            showToast('File too large. Maximum size is 10MB.', 'error');
            return;
        }

        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
            showToast('Invalid file type. Allowed: PDF, JPEG, PNG, WebP', 'error');
            return;
        }

        setFile(selectedFile);

        // Generate preview for images
        if (selectedFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }, [showToast]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    }, [handleFileChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    }, []);

    return (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-lg space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-blue-100">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Document Verification</h3>
                <p className="text-sm text-slate-500">
                    Upload your registration documents for automated OCR verification
                </p>
            </div>

            {/* Document Type Selection */}
            <FormField label="Document Type" required>
                <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                    {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </FormField>

            {/* File Drop Zone */}
            <FormField label="Upload Document" required>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : file
                                ? 'border-emerald-400 bg-emerald-50'
                                : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                >
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {preview ? (
                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl shadow-lg" />
                    ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${file ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'
                            }`}>
                            {file ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                        </div>
                    )}

                    <div className="text-center">
                        {file ? (
                            <>
                                <p className="text-sm font-black text-emerald-700 uppercase">{file.name}</p>
                                <p className="text-xs text-emerald-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-slate-600">
                                    Drop your document here or <span className="text-blue-600">browse</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-2">PDF, JPEG, PNG, WebP • Max 10MB</p>
                            </>
                        )}
                    </div>
                </div>
            </FormField>

            {/* Info Box */}
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-900 uppercase">Azure AI Vision OCR</p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                            Your document will be processed using Azure AI Vision to extract registration details automatically.
                            An admin will review the results for final approval.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                {onSkip && (
                    <Button
                        variant="outline"
                        className="flex-1 py-4 rounded-2xl"
                        onClick={onSkip}
                    >
                        Skip for Now
                    </Button>
                )}
                <Button
                    variant="primary"
                    className="flex-1 py-4 rounded-2xl"
                    disabled={!file || uploadMutation.isPending}
                    onClick={() => uploadMutation.mutate()}
                >
                    {uploadMutation.isPending ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Uploading...
                        </>
                    ) : (
                        'Upload & Verify'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default OrganizationDocumentUpload;
