import React from 'react';
import { Check, CheckCheck, Clock3, CircleAlert } from 'lucide-react';
import { formatTime } from '../../../lib/format';

// Delivery state for the sender's own bubbles.
const StatusTick = ({ message }) => {
    if (message.failed) return <CircleAlert size={13} className="text-red-300" />;
    if (message.pending) return <Clock3 size={12} className="text-cyan-100/80" />;
    if (message.readAt) return <CheckCheck size={14} className="text-white" />;
    return <Check size={14} className="text-cyan-100/80" />;
};

const MessageBubble = ({ message, isMine }) => (
    <div className={`flex message-in ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div
            className={`max-w-[75%] sm:max-w-[65%] px-3.5 py-2 shadow-sm text-sm leading-relaxed break-words whitespace-pre-wrap
                ${isMine
                    ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-white text-gray-800 rounded-2xl rounded-bl-md ring-1 ring-black/5'
                }`}
        >
            {message.text}
            <span
                className={`flex items-center gap-1 justify-end mt-0.5 text-[10px] select-none
                    ${isMine ? 'text-cyan-50/90' : 'text-gray-400'}`}
            >
                {formatTime(message.createdAt)}
                {isMine && <StatusTick message={message} />}
            </span>
        </div>
    </div>
);

export default MessageBubble;
