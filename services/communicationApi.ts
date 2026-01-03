/**
 * Communication API Service
 * Handles messaging between organizations with audit trail
 */

import api from './api';

export interface MessageAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
    ocrText?: string;
}

export interface CommunicationMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderType: 'hospital' | 'bloodbank' | 'admin';
    receiverId: string;
    receiverName: string;
    messageType: 'text' | 'document' | 'blood_request' | 'blood_response' | 'status_update';
    content: string;
    attachments: MessageAttachment[];
    sosId?: string;
    isRead: boolean;
    readAt?: string;
    sequenceNumber: number;
    previousHash: string;
    currentHash: string;
    createdAt: string;
}

export interface Conversation {
    conversationId: string;
    partnerId: string;
    partnerName: string;
    partnerType: 'hospital' | 'bloodbank';
    lastMessage?: CommunicationMessage;
    unreadCount: number;
    sosId?: string;
    updatedAt: string;
}

export interface SendMessageRequest {
    receiverId: string;
    messageType: CommunicationMessage['messageType'];
    content: string;
    sosId?: string;
    attachments?: File[];
}

/**
 * Send a new message
 */
export const sendMessage = async (request: SendMessageRequest): Promise<CommunicationMessage> => {
    const formData = new FormData();
    formData.append('receiverId', request.receiverId);
    formData.append('messageType', request.messageType);
    formData.append('content', request.content);

    if (request.sosId) {
        formData.append('sosId', request.sosId);
    }

    if (request.attachments) {
        request.attachments.forEach((file) => {
            formData.append('attachments', file);
        });
    }

    const response = await api.post('/communication/send', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

/**
 * Get all conversations for current organization
 */
export const getConversations = async (): Promise<Conversation[]> => {
    const response = await api.get('/communication/conversations');
    return response.data.data;
};

/**
 * Get messages in a conversation with a specific organization
 */
export const getConversationMessages = async (partnerId: string): Promise<CommunicationMessage[]> => {
    const response = await api.get(`/communication/conversation/${partnerId}`);
    return response.data.data;
};

/**
 * Get SOS-specific audit trail
 */
export const getSosAuditTrail = async (sosId: string): Promise<CommunicationMessage[]> => {
    const response = await api.get(`/communication/sos/${sosId}/audit`);
    return response.data.data;
};

/**
 * Mark a message as read
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
    await api.post(`/communication/message/${messageId}/read`);
};

/**
 * Verify audit chain integrity
 */
export const verifyChainIntegrity = async (conversationId: string): Promise<{
    isValid: boolean;
    messageCount: number;
    brokenAt?: number;
}> => {
    const response = await api.get(`/communication/conversation/${conversationId}/verify`);
    return response.data.data;
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (): Promise<number> => {
    const response = await api.get('/communication/unread-count');
    return response.data.data.count;
};
