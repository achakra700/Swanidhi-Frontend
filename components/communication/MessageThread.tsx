/**
 * Message Thread Component
 * Displays messages in a conversation with real-time updates
 */

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getConversationMessages,
    sendMessage,
    markMessageAsRead,
    CommunicationMessage,
    SendMessageRequest
} from '../../services/communicationApi';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
    partnerId: string;
    partnerName: string;
    partnerType: 'hospital' | 'bloodbank';
    sosId?: string;
    onClose?: () => void;
}

const MessageThread: React.FC<Props> = ({ partnerId, partnerName, partnerType, sosId, onClose }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newMessage, setNewMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [messageType, setMessageType] = useState<SendMessageRequest['messageType']>('text');

    // Fetch messages
    const { data: messages, isLoading } = useQuery({
        queryKey: ['messages', partnerId],
        queryFn: () => getConversationMessages(partnerId),
        refetchInterval: 10000, // Poll every 10s
    });

    // Send message mutation
    const sendMutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            setNewMessage('');
            setAttachments([]);
            setMessageType('text');
            queryClient.invalidateQueries({ queryKey: ['messages', partnerId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || 'Failed to send message', 'error');
        },
    });

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark unread messages as read
    useEffect(() => {
        if (messages) {
            messages
                .filter((m) => !m.isRead && m.senderId === partnerId)
                .forEach((m) => markMessageAsRead(m.id));
        }
    }, [messages, partnerId]);

    const handleSend = () => {
        if (!newMessage.trim() && attachments.length === 0) return;

        sendMutation.mutate({
            receiverId: partnerId,
            messageType: attachments.length > 0 ? 'document' : messageType,
            content: newMessage,
            sosId,
            attachments: attachments.length > 0 ? attachments : undefined,
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments((prev) => [...prev, ...files].slice(0, 5)); // Max 5 files
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getMessageTypeIcon = (type: string) => {
        switch (type) {
            case 'blood_request':
                return <span className="text-rose-500">🩸</span>;
            case 'blood_response':
                return <span className="text-emerald-500">✓</span>;
            case 'status_update':
                return <span className="text-blue-500">📋</span>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${partnerType === 'hospital' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                        <span className="text-lg font-black">{partnerName.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{partnerName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{partnerType}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {sosId && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded-lg">
                            SOS: {sosId.slice(0, 8)}...
                        </span>
                    )}
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    </div>
                ) : messages && messages.length > 0 ? (
                    messages.map((msg) => {
                        const isOwn = msg.senderId !== partnerId;
                        return (
                            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                                    {/* Message bubble */}
                                    <div className={`px-4 py-3 rounded-2xl ${isOwn
                                            ? 'bg-slate-900 text-white rounded-br-md'
                                            : 'bg-white border border-slate-200 text-slate-900 rounded-bl-md'
                                        }`}>
                                        {/* Message type indicator */}
                                        {msg.messageType !== 'text' && (
                                            <div className={`text-[10px] font-bold uppercase mb-1 ${isOwn ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {getMessageTypeIcon(msg.messageType)} {msg.messageType.replace('_', ' ')}
                                            </div>
                                        )}

                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                        {/* Attachments */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {msg.attachments.map((att) => (
                                                    <a
                                                        key={att.id}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                                            }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        <span className="text-xs truncate">{att.fileName}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Timestamp */}
                                    <p className={`text-[10px] text-slate-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.createdAt)}
                                        {isOwn && msg.isRead && <span className="ml-1">✓✓</span>}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2">
                    {attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg">
                            <span className="text-xs truncate max-w-32">{file.name}</span>
                            <button onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-end gap-3">
                    {/* Attachment button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Message input */}
                    <div className="flex-1">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full px-4 py-3 bg-slate-100 border-0 rounded-2xl resize-none focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                        />
                    </div>

                    {/* Send button */}
                    <Button
                        onClick={handleSend}
                        disabled={sendMutation.isPending || (!newMessage.trim() && attachments.length === 0)}
                        className="px-6 py-3 rounded-2xl"
                    >
                        {sendMutation.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </Button>
                </div>

                {/* Quick actions for SOS */}
                {sosId && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => {
                                setMessageType('blood_request');
                                setNewMessage('Blood units available for transfer');
                            }}
                            className="text-[10px] font-bold uppercase px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                        >
                            🩸 Blood Available
                        </button>
                        <button
                            onClick={() => {
                                setMessageType('status_update');
                                setNewMessage('Units dispatched, ETA: ');
                            }}
                            className="text-[10px] font-bold uppercase px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                            📋 Status Update
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageThread;
