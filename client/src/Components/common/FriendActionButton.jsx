import React from 'react';
import { UserPlus, Clock, Check, MessageCircle, Loader2 } from 'lucide-react';
import { useFriends } from '../FriendsContext';

const base =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shrink-0 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

// Relationship-driven action for a user (search rows, right panel):
// none → Add friend · outgoing → Requested (tap cancels) · incoming → Accept ·
// friend → Message. Reads getRelationship LIVE so it updates in place.
const FriendActionButton = ({ user, onMessage }) => {
    const { getRelationship, sendRequest, acceptRequest, cancelRequest, isBusy } = useFriends();
    const rel = getRelationship(user._id, user.relationship);
    const busy = isBusy(user._id);
    const spinner = <Loader2 size={13} className="animate-spin" />;

    if (rel === 'friend') {
        return (
            <button className={`${base} bg-cyan-600 text-white hover:bg-cyan-700`} onClick={() => onMessage?.(user)}>
                <MessageCircle size={13} /> Message
            </button>
        );
    }
    if (rel === 'incoming') {
        return (
            <button disabled={busy} className={`${base} bg-cyan-600 text-white hover:bg-cyan-700`} onClick={() => acceptRequest(user._id)}>
                {busy ? spinner : <Check size={13} />} Accept
            </button>
        );
    }
    if (rel === 'outgoing') {
        return (
            <button disabled={busy} title="Tap to cancel" className={`${base} bg-gray-100 text-gray-600 hover:bg-gray-200`} onClick={() => cancelRequest(user._id)}>
                {busy ? spinner : <Clock size={13} />} Requested
            </button>
        );
    }
    return (
        <button disabled={busy} className={`${base} bg-cyan-50 text-cyan-700 hover:bg-cyan-100`} onClick={() => sendRequest(user._id)}>
            {busy ? spinner : <UserPlus size={13} />} Add friend
        </button>
    );
};

export default FriendActionButton;
