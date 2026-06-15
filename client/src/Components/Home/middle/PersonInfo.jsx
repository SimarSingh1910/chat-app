import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import Avatar from '../../common/Avatar';
import { useChat } from '../../ChatContext';
import { useSocket } from '../../SocketContext';

// Header of the open chat: who you're talking to + their live status.
const PersonInfo = ({ onToggleInfo, onBack }) => {
    const { activeConversation, getOtherUser, isTyping } = useChat();
    const { isOnline } = useSocket();

    const other = getOtherUser(activeConversation);
    if (!other) return null;

    const online = isOnline(other._id, other.online);
    const typing = isTyping(activeConversation._id);

    const status = typing ? 'typing…' : online ? 'online' : 'offline';

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur border-b border-gray-200">
            {/* Back to inbox on small screens */}
            <button
                onClick={onBack}
                aria-label="Back"
                className="md:hidden p-1.5 -ml-1 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer"
            >
                <ArrowLeft size={18} />
            </button>

            <Avatar src={other.avatar} alt={other.username} online={online} />

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                    {other.first_name} {other.last_name}
                </p>
                <p className={`text-xs ${typing ? 'text-cyan-600 italic font-medium' : online ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {status}
                </p>
            </div>

            <button
                onClick={onToggleInfo}
                aria-label="Contact info"
                className="p-2 rounded-full text-gray-500 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
            >
                <Info size={19} />
            </button>
        </div>
    );
};

export default PersonInfo;
