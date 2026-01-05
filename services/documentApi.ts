/**
 * Document Verification API Service
 * Handles document upload and verification endpoints
 */

import api from './api';

export interface DocumentVerification {
    id: string;
    organizationId: string;
    organizationType: 'hospital' | 'bloodbank';
    documentType: 'registration_certificate' | 'blood_bank_license' | 'government_id' | 'authorization_letter';
    ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
    verificationStatus: 'pending_upload' | 'pending_ocr' | 'pending_admin' | 'approved' | 'rejected';
    ocrResult?: {
        rawText: string;
        extractedFields: {
            registrationNumber?: string;
            organizationName?: string;
            issueDate?: string;
            expiryDate?: string;
            issuingAuthority?: string;
        };
        confidenceScore: number;
    };
    matchScore?: number;
    discrepancies?: string[];
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    uploadedAt: string;
    originalFileName: string;
}

/**
 * Upload a document for OCR verification
 */
export const uploadDocument = async (
    file: File,
    organizationId: string,
    organizationType: 'hospital' | 'bloodbank',
    documentType: string
): Promise<{ id: string; ocrStatus: string; verificationStatus: string }> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('organizationId', organizationId);
    formData.append('organizationType', organizationType);
    formData.append('documentType', documentType);

    const response = await api.post('/api/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

/**
 * Get verification status by ID
 */
export const getVerification = async (id: string): Promise<DocumentVerification> => {
    const response = await api.get(`/api/documents/verification/${id}`);
    return response.data.data;
};

/**
 * Get OCR results for a verification
 */
export const getOcrResults = async (id: string): Promise<{
    ocrStatus: string;
    ocrResult?: DocumentVerification['ocrResult'];
    matchScore?: number;
    discrepancies?: string[];
}> => {
    const response = await api.get(`/api/documents/verification/${id}/ocr`);
    return response.data.data;
};

/**
 * Get all verifications for an organization
 */
export const getOrganizationVerifications = async (orgId: string): Promise<DocumentVerification[]> => {
    const response = await api.get(`/api/documents/organization/${orgId}`);
    return response.data.data;
};

/**
 * Get pending verifications (Admin only)
 */
export const getPendingVerifications = async (): Promise<DocumentVerification[]> => {
    const response = await api.get('/api/documents/pending');
    return response.data.data;
};

/**
 * Approve document verification (Admin only)
 */
export const approveVerification = async (id: string, notes?: string): Promise<DocumentVerification> => {
    const response = await api.post(`/api/documents/verification/${id}/approve`, { notes });
    return response.data.data;
};

/**
 * Reject document verification (Admin only)
 */
export const rejectVerification = async (id: string, reason: string): Promise<DocumentVerification> => {
    const response = await api.post(`/api/documents/verification/${id}/reject`, { reason });
    return response.data.data;
};

/**
 * Validate OCR against registration data (Admin only)
 */
export const validateAgainstRegistration = async (
    id: string,
    registrationNumber: string,
    organizationName: string
): Promise<{ matchScore: number; discrepancies: string[] }> => {
    const response = await api.post(`/api/documents/verification/${id}/validate`, {
        registrationNumber,
        organizationName,
    });
    return response.data.data;
};
