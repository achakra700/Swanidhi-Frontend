/**
 * Conversation List Component
 * Shows all conversations for the current organization
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConversations, Conversation } from '../../services/communicationApi';
import EmptyState from '../ui/EmptyState';

interface Props {
    selectedId?: string;
    onSelect: (conversation: Conversation) => void;
}

const ConversationList: React.FC<Props> = ({ selectedId, onSelect }) => {
    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations,
        refetchInterval: 30000, // Refetch every 30s
    });

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'hospital':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                );
            case 'bloodbank':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!conversations || conversations.length === 0) {
        return (
            <EmptyState
                title="No Conversations"
                description="Start a conversation with hospitals or blood banks"
            />
        );
    }

    return (
        <div className="divide-y divide-slate-100">
            {conversations.map((conv) => (
                <button
                    key={conv.conversationId}
                    onClick={() => onSelect(conv)}
                    className={`w-full p-4 flex items-start gap-4 transition-all text-left hover:bg-slate-50 ${selectedId === conv.conversationId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                >
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${conv.partnerType === 'hospital' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                        {getTypeIcon(conv.partnerType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{conv.partnerName}</h4>
                            {conv.lastMessage && (
                                <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
                                    {formatTime(conv.lastMessage.createdAt)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-1">
                            <p className="text-xs text-slate-500 truncate">
                                {conv.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0">
                                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                </span>
                            )}
                        </div>

                        {/* SOS Badge */}
                        {conv.sosId && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded-lg">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L1 21h22L12 2zm0 13c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" />
                                </svg>
                                <span className="text-[9px] font-black uppercase">SOS Linked</span>
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ConversationList;
