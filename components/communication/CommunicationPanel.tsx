/**
 * Communication Panel Component
 * Full messaging interface for Hospital and BloodBank dashboards
 */

import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { Conversation } from '../../services/communicationApi';

interface Props {
    sosId?: string;
    defaultPartnerId?: string;
    defaultPartnerName?: string;
    defaultPartnerType?: 'hospital' | 'bloodbank';
}

const CommunicationPanel: React.FC<Props> = ({
    sosId,
    defaultPartnerId,
    defaultPartnerName,
    defaultPartnerType
}) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
        defaultPartnerId && defaultPartnerName && defaultPartnerType
            ? {
                conversationId: `${defaultPartnerId}-default`,
                partnerId: defaultPartnerId,
                partnerName: defaultPartnerName,
                partnerType: defaultPartnerType,
                unreadCount: 0,
                sosId,
                updatedAt: new Date().toISOString(),
            }
            : null
    );
    const [showNewMessage, setShowNewMessage] = useState(false);

    return (
        <div className="h-[600px] bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden">
            <div className="flex h-full">
                {/* Sidebar - Conversation List */}
                <div className="w-80 border-r border-slate-100 flex flex-col bg-white">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Messages</h2>
                            <button
                                onClick={() => setShowNewMessage(true)}
                                className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>

                        {/* Search (optional) */}
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        <ConversationList
                            selectedId={selectedConversation?.conversationId}
                            onSelect={(conv) => {
                                setSelectedConversation(conv);
                                setShowNewMessage(false);
                            }}
                        />
                    </div>
                </div>

                {/* Main Content - Message Thread */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <MessageThread
                            partnerId={selectedConversation.partnerId}
                            partnerName={selectedConversation.partnerName}
                            partnerType={selectedConversation.partnerType}
                            sosId={selectedConversation.sosId || sosId}
                            onClose={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-slate-50/50">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Swift Communication</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                                    Select a conversation or start a new one to communicate with hospitals and blood banks
                                </p>

                                {/* SOS Quick Link */}
                                {sosId && (
                                    <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 max-w-xs mx-auto">
                                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">
                                            Active SOS Request
                                        </p>
                                        <p className="text-xs text-rose-700 font-bold">{sosId}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Message Modal */}
            {showNewMessage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-black uppercase tracking-tight">New Message</h3>
                            <button
                                onClick={() => setShowNewMessage(false)}
                                className="p-2 hover:bg-slate-100 rounded-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">
                                    Search Organization
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter hospital or blood bank name..."
                                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                />
                            </div>

                            <p className="text-xs text-slate-400 text-center py-4">
                                Search for an organization to start a conversation
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationPanel;
