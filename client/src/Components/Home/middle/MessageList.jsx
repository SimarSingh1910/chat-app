import React, { useEffect, useRef, useCallback, Fragment } from 'react';
import { TimerReset } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useChat } from '../../ChatContext';
import { useAuth } from '../../AuthContext';
import { formatDayLabel, isDifferentDay } from '../../../lib/format';

const DaySeparator = ({ date }) => (
    <div className="flex items-center justify-center my-3">
        <span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-black/5 text-[11px] font-medium text-gray-500 shadow-sm">
            {formatDayLabel(date)}
        </span>
    </div>
);

const TypingBubble = () => (
    <div className="flex justify-start message-in">
        <div className="bg-white rounded-2xl rounded-bl-md ring-1 ring-black/5 shadow-sm px-4 py-3 flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-cyan-600 inline-block" />
            ))}
        </div>
    </div>
);

const MessageList = () => {
    const { userId } = useAuth();
    const {
        messages,
        loadingMessages,
        hasMoreMessages,
        loadOlderMessages,
        activeConversation,
        isTyping,
    } = useChat();

    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const stickToBottom = useRef(true);

    const typing = activeConversation ? isTyping(activeConversation._id) : false;

    // Track whether the user is reading old history; if so, don't yank them down.
    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    }, []);

    useEffect(() => {
        if (stickToBottom.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages, typing]);

    // Always start pinned to the latest message when switching conversations.
    useEffect(() => {
        stickToBottom.current = true;
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [activeConversation?._id]);

    if (loadingMessages) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                Loading messages…
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto chat-scroll px-4 py-3"
        >
            {/* Ephemeral-messages notice — messages auto-delete after 24h (TTL index) */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mb-2">
                <TimerReset size={12} />
                Messages in this chat disappear after 24 hours
            </div>

            {hasMoreMessages && (
                <div className="flex justify-center mb-2">
                    <button
                        onClick={loadOlderMessages}
                        className="px-3 py-1 rounded-full bg-white ring-1 ring-black/5 text-xs font-medium text-cyan-700 hover:bg-cyan-50 cursor-pointer shadow-sm"
                    >
                        Load earlier messages
                    </button>
                </div>
            )}

            {messages.length === 0 && !typing && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1">Send the first message to break the ice 🧊</p>
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                {messages.map((message, i) => {
                    const prev = messages[i - 1];
                    const showDay = !prev || isDifferentDay(prev.createdAt, message.createdAt);
                    const isMine = (message.sender?._id || message.sender) === userId;
                    return (
                        <Fragment key={message._id}>
                            {showDay && <DaySeparator date={message.createdAt} />}
                            <MessageBubble message={message} isMine={isMine} />
                        </Fragment>
                    );
                })}
                {typing && <TypingBubble />}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
