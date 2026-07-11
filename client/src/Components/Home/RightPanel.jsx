import React, { useEffect, useState } from 'react';
import { X, Mail, AtSign, Sparkles, TimerReset, MessageCircle, UserPlus, UserRoundMinus, Clock, Check } from 'lucide-react';
import Avatar from '../common/Avatar';
import api from '../../lib/api';
import { useChat } from '../ChatContext';
import { useSocket } from '../SocketContext';
import { useFriends } from '../FriendsContext';

// Contact details for the person in the open conversation.
const RightPanel = ({ onClose, onMessage }) => {
    const { activeConversation, getOtherUser } = useChat();
    const { isOnline } = useSocket();
    const { getRelationship, sendRequest, acceptRequest, cancelRequest, unfriend, isBusy } = useFriends();

    const other = getOtherUser(activeConversation);
    const [details, setDetails] = useState(null);

    // The conversation list only carries the basics; fetch the full profile.
    useEffect(() => {
        setDetails(null);
        if (!other?._id) return;
        let cancelled = false;
        api.get(`/users/${other._id}`)
            .then(({ data }) => !cancelled && setDetails(data.user))
            .catch((err) => console.error('Failed to load contact info:', err));
        return () => {
            cancelled = true;
        };
    }, [other?._id]);

    if (!other) return null;

    const online = isOnline(other._id, other.online);
    const info = details || other;
    const rel = getRelationship(other._id, details?.relationship);
    const busy = isBusy(other._id);
    const actionBtn =
        'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
    const handleUnfriend = () => {
        if (window.confirm(`Remove ${info.first_name} ${info.last_name} from your friends?`)) {
            unfriend(other._id);
        }
    };
    // Profiles store hobbies as an array; older docs may have a {name: bool} map.
    const hobbies = Array.isArray(info.hobbies)
        ? info.hobbies
        : Object.keys(info.hobbies || {}).filter((k) => info.hobbies[k]);

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-auto chat-scroll">
            <div className="flex items-center justify-between px-4 pt-4">
                <p className="text-sm font-semibold text-gray-700">Contact info</p>
                <button
                    onClick={onClose}
                    aria-label="Close contact info"
                    className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                    <X size={17} />
                </button>
            </div>

            {/* Identity */}
            <div className="flex flex-col items-center px-6 pt-4 pb-5 border-b border-gray-200">
                <Avatar src={info.avatar} alt={info.username} size="xl" online={online} />
                <h2 className="mt-3 text-lg font-bold text-gray-900 text-center">
                    {info.first_name} {info.last_name}
                </h2>
                {info.pronoun && (
                    <p className="text-xs text-gray-400 mt-0.5">{info.pronoun}</p>
                )}
                <span
                    className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        online ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {online ? 'Online' : 'Offline'}
                </span>

                {/* Relationship action */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    {rel === 'friend' && (
                        <>
                            <button onClick={() => onMessage?.(info)} className={`${actionBtn} bg-cyan-600 text-white hover:bg-cyan-700`}>
                                <MessageCircle size={14} /> Message
                            </button>
                            <button onClick={handleUnfriend} disabled={busy} className={`${actionBtn} border border-red-200 text-red-600 hover:bg-red-50`}>
                                <UserRoundMinus size={14} /> Unfriend
                            </button>
                        </>
                    )}
                    {rel === 'none' && (
                        <button onClick={() => sendRequest(other._id)} disabled={busy} className={`${actionBtn} bg-cyan-50 text-cyan-700 hover:bg-cyan-100`}>
                            <UserPlus size={14} /> Add friend
                        </button>
                    )}
                    {rel === 'outgoing' && (
                        <button onClick={() => cancelRequest(other._id)} disabled={busy} title="Tap to cancel" className={`${actionBtn} bg-gray-100 text-gray-600 hover:bg-gray-200`}>
                            <Clock size={14} /> Requested
                        </button>
                    )}
                    {rel === 'incoming' && (
                        <button onClick={() => acceptRequest(other._id)} disabled={busy} className={`${actionBtn} bg-cyan-600 text-white hover:bg-cyan-700`}>
                            <Check size={14} /> Accept
                        </button>
                    )}
                </div>
            </div>

            {/* Status mood */}
            {info.statusMood && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        About
                    </p>
                    <p className="text-sm text-gray-700">{info.statusMood}</p>
                </div>
            )}

            {/* Contact details */}
            <div className="px-6 py-4 border-b border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700 min-w-0">
                    <AtSign size={15} className="text-cyan-600 shrink-0" />
                    <span className="truncate">{info.username}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 min-w-0">
                    <Mail size={15} className="text-cyan-600 shrink-0" />
                    <span className="truncate">{info.email}</span>
                </div>
            </div>

            {/* Hobbies */}
            {hobbies.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        <Sparkles size={12} /> Hobbies
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {hobbies.map((hobby) => (
                            <span
                                key={hobby}
                                className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium capitalize"
                            >
                                {hobby}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <div className="px-6 py-4 mt-auto">
                <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <TimerReset size={12} className="shrink-0" />
                    Messages disappear after 24 hours
                </p>
            </div>
        </div>
    );
};

export default RightPanel;
