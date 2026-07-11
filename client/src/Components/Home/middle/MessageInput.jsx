import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useChat } from '../../ChatContext';

const TYPING_IDLE_MS = 1800;

const MessageInput = () => {
    const { sendMessage, emitTyping, activeConversation } = useChat();
    const [text, setText] = useState('');
    const typingRef = useRef(false);
    const idleTimer = useRef(null);
    const inputRef = useRef(null);

    const stopTyping = useCallback(() => {
        if (typingRef.current) {
            typingRef.current = false;
            emitTyping(false);
        }
        clearTimeout(idleTimer.current);
    }, [emitTyping]);

    // Reset draft when switching chats; stop the stale typing signal.
    useEffect(() => {
        setText('');
        stopTyping();
        inputRef.current?.focus();
    }, [activeConversation?._id, stopTyping]);

    useEffect(() => () => clearTimeout(idleTimer.current), []);

    const handleChange = (e) => {
        setText(e.target.value);
        if (!typingRef.current) {
            typingRef.current = true;
            emitTyping(true);
        }
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(stopTyping, TYPING_IDLE_MS);
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        sendMessage(trimmed);
        setText('');
        stopTyping();
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="px-4 py-3 bg-white/90 backdrop-blur border-t border-gray-200">
            <div className="flex items-end gap-2">
                <textarea
                    ref={inputRef}
                    rows={1}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    className="flex-1 resize-none max-h-32 bg-gray-100 focus:bg-white rounded-2xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all chat-scroll"
                    style={{ minHeight: '42px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    aria-label="Send message"
                    className="h-[42px] w-[42px] shrink-0 flex items-center justify-center rounded-full
                        bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md
                        hover:from-cyan-600 hover:to-teal-600 active:scale-95 transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                    <SendHorizontal size={18} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
