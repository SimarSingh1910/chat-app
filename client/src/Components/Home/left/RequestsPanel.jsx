import React from 'react';
import { Check, X, Clock, Inbox, Send } from 'lucide-react';
import Avatar from '../../common/Avatar';
import { useFriends } from '../../FriendsContext';

const Row = ({ u, children }) => (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
        <Avatar src={u.avatar} alt={u.username} />
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{u.first_name} {u.last_name}</p>
            <p className="text-xs text-gray-500 truncate">@{u.username}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">{children}</div>
    </div>
);

const SectionHeader = ({ children }) => (
    <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{children}</p>
);

const EmptyState = ({ icon, label }) => {
    const Icon = icon;
    return (
        <div className="flex flex-col items-center text-center px-6 py-6 text-gray-400">
            <Icon size={28} strokeWidth={1.5} className="mb-2" />
            <p className="text-sm">{label}</p>
        </div>
    );
};

// Requests view: Incoming (Accept / Reject) + Outgoing (Requested / Cancel).
const RequestsPanel = () => {
    const { incomingRequests, outgoingRequests, acceptRequest, rejectRequest, cancelRequest, isBusy } = useFriends();

    return (
        <div className="px-2 pb-2">
            <SectionHeader>Incoming</SectionHeader>
            {incomingRequests.length === 0 ? (
                <EmptyState icon={Inbox} label="No incoming requests" />
            ) : (
                incomingRequests.map((u) => (
                    <Row key={u._id} u={u}>
                        <button
                            onClick={() => acceptRequest(u._id)}
                            disabled={isBusy(u._id)}
                            className="inline-flex items-center gap-1 rounded-full bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 cursor-pointer disabled:opacity-60"
                        >
                            <Check size={13} /> Accept
                        </button>
                        <button
                            onClick={() => rejectRequest(u._id)}
                            disabled={isBusy(u._id)}
                            aria-label="Reject"
                            title="Reject"
                            className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-60"
                        >
                            <X size={16} />
                        </button>
                    </Row>
                ))
            )}

            <SectionHeader>Outgoing</SectionHeader>
            {outgoingRequests.length === 0 ? (
                <EmptyState icon={Send} label="No outgoing requests" />
            ) : (
                outgoingRequests.map((u) => (
                    <Row key={u._id} u={u}>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                            <Clock size={13} /> Requested
                        </span>
                        <button
                            onClick={() => cancelRequest(u._id)}
                            disabled={isBusy(u._id)}
                            className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 cursor-pointer disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    </Row>
                ))
            )}
        </div>
    );
};

export default RequestsPanel;
