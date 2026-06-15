import React from 'react';
import Avatar from '../../common/Avatar';
import { formatListTime } from '../../../lib/format';

// One conversation row in the inbox list.
const ContactCard = ({ otherUser, lastMessage, lastMessageIsMine, time, unread, online, typing, isSelected, onClick }) => {
    const preview = typing
        ? 'typing…'
        : lastMessage
            ? `${lastMessageIsMine ? 'You: ' : ''}${lastMessage}`
            : 'Say hello 👋';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150
                ${isSelected ? 'bg-cyan-50 ring-1 ring-cyan-200' : 'hover:bg-gray-100'}`}
        >
            <Avatar src={otherUser?.avatar} alt={otherUser?.username} online={online} />

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                        {otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown user'}
                    </p>
                    <span className={`text-[11px] shrink-0 ${unread > 0 ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
                        {formatListTime(time)}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-xs truncate ${
                        typing
                            ? 'text-cyan-600 italic font-medium'
                            : unread > 0
                                ? 'text-gray-800 font-medium'
                                : 'text-gray-500'
                    }`}>
                        {preview}
                    </p>
                    {unread > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-cyan-600 text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                            {unread > 99 ? '99+' : unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ContactCard;
