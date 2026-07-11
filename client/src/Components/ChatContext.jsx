import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext(null);

const useChat = () => useContext(ChatContext);

const PAGE_SIZE = 50;

const ChatProvider = ({ children }) => {
    const { isAuthenticated, userId } = useAuth();
    const { socket } = useSocket();

    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]); // messages of the active conversation, oldest → newest
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [typingConversations, setTypingConversations] = useState(() => new Set());

    // Refs so socket handlers always see current values without re-binding.
    const activeIdRef = useRef(null);
    activeIdRef.current = activeId;
    const typingTimers = useRef(new Map());

    const activeConversation = useMemo(
        () => conversations.find((c) => c._id === activeId) || null,
        [conversations, activeId]
    );

    // The person on the other side of a 1:1 conversation.
    const getOtherUser = useCallback(
        (conv) => conv?.participants?.find((p) => p._id !== userId) || null,
        [userId]
    );

    const unreadFor = useCallback(
        (conv) => (conv?.unreadCounts && userId ? conv.unreadCounts[userId] || 0 : 0),
        [userId]
    );

    // ---- conversation list ----

    const loadConversations = useCallback(async () => {
        try {
            const { data } = await api.get('/conversations');
            setConversations(data.conversations || []);
        } catch (err) {
            console.error('Failed to load conversations:', err);
        } finally {
            setLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) loadConversations();
    }, [isAuthenticated, loadConversations]);

    const patchConversation = useCallback((conversationId, patch, moveToTop = false) => {
        setConversations((prev) => {
            const idx = prev.findIndex((c) => c._id === conversationId);
            if (idx === -1) return prev;
            const updated = { ...prev[idx], ...patch };
            const rest = prev.filter((c) => c._id !== conversationId);
            return moveToTop ? [updated, ...rest] : [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)];
        });
    }, []);

    // ---- selecting a conversation / loading its thread ----

    const markAsRead = useCallback(
        async (conversationId) => {
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === conversationId
                        ? { ...c, unreadCounts: { ...(c.unreadCounts || {}), [userId]: 0 } }
                        : c
                )
            );
            try {
                await api.put(`/messages/read/${conversationId}`);
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        },
        [userId]
    );

    const selectConversation = useCallback(
        async (conversation) => {
            const conversationId = conversation?._id || null;
            if (conversationId === activeIdRef.current) return;

            // Swap socket rooms (rooms power typing indicators).
            if (socket) {
                if (activeIdRef.current) socket.emit('leave_conversation', activeIdRef.current);
                if (conversationId) socket.emit('join_conversation', conversationId);
            }

            setActiveId(conversationId);
            setMessages([]);
            setHasMoreMessages(false);
            if (!conversationId) return;

            setLoadingMessages(true);
            try {
                const { data } = await api.get(`/messages/${conversationId}`, {
                    params: { limit: PAGE_SIZE },
                });
                const page = (data.messages || []).slice().reverse(); // API returns newest first
                setMessages(page);
                setHasMoreMessages((data.messages || []).length === PAGE_SIZE);
            } catch (err) {
                console.error('Failed to load messages:', err);
            } finally {
                setLoadingMessages(false);
            }

            if (unreadFor(conversation) > 0) markAsRead(conversationId);
        },
        [socket, unreadFor, markAsRead]
    );

    const closeConversation = useCallback(() => {
        if (socket && activeIdRef.current) {
            socket.emit('leave_conversation', activeIdRef.current);
        }
        setActiveId(null);
        setMessages([]);
    }, [socket]);

    const loadOlderMessages = useCallback(async () => {
        if (!activeIdRef.current || loadingMessages) return;
        const conversationId = activeIdRef.current;
        try {
            const { data } = await api.get(`/messages/${conversationId}`, {
                params: { limit: PAGE_SIZE, skip: messages.length },
            });
            const page = (data.messages || []).slice().reverse();
            if (activeIdRef.current !== conversationId) return; // user switched away
            setMessages((prev) => [...page, ...prev]);
            setHasMoreMessages((data.messages || []).length === PAGE_SIZE);
        } catch (err) {
            console.error('Failed to load older messages:', err);
        }
    }, [messages.length, loadingMessages]);

    // ---- sending ----

    const sendMessage = useCallback(
        async (text) => {
            const conversationId = activeIdRef.current;
            const trimmed = text.trim();
            if (!conversationId || !trimmed) return;

            // Optimistic bubble; replaced by the server copy on success.
            const tempId = `temp-${Math.random().toString(36).slice(2)}`;
            const optimistic = {
                _id: tempId,
                conversationId,
                sender: { _id: userId },
                text: trimmed,
                createdAt: new Date().toISOString(),
                readAt: null,
                pending: true,
            };
            setMessages((prev) => [...prev, optimistic]);
            patchConversation(
                conversationId,
                { lastMessage: { text: trimmed, sender: userId, createdAt: optimistic.createdAt } },
                true
            );

            try {
                const { data } = await api.post('/messages', { conversationId, text: trimmed });
                setMessages((prev) =>
                    prev.map((m) => (m._id === tempId ? data.message : m))
                );
            } catch (err) {
                console.error('Failed to send message:', err);
                setMessages((prev) =>
                    prev.map((m) => (m._id === tempId ? { ...m, pending: false, failed: true } : m))
                );
            }
        },
        [userId, patchConversation]
    );

    // ---- starting a chat from user search ----

    const startConversation = useCallback(
        async (otherUser) => {
            try {
                const { data } = await api.post('/conversations', {
                    participantId: otherUser._id,
                });
                const conversation = data.conversation;
                setConversations((prev) => {
                    if (prev.some((c) => c._id === conversation._id)) return prev;
                    return [conversation, ...prev];
                });
                await selectConversation(conversation);
                return conversation;
            } catch (err) {
                console.error('Failed to start conversation:', err);
                return null;
            }
        },
        [selectConversation]
    );

    // ---- typing ----

    const emitTyping = useCallback(
        (isTyping) => {
            if (socket && activeIdRef.current) {
                socket.emit('typing', { conversationId: activeIdRef.current, isTyping });
            }
        },
        [socket]
    );

    // ---- socket event wiring ----

    useEffect(() => {
        if (!socket) return;

        const onNewMessage = ({ message, conversationId }) => {
            const isActive = conversationId === activeIdRef.current;
            if (isActive) {
                setMessages((prev) =>
                    prev.some((m) => m._id === message._id) ? prev : [...prev, message]
                );
                markAsRead(conversationId);
            }
            setConversations((prev) => {
                const idx = prev.findIndex((c) => c._id === conversationId);
                if (idx === -1) {
                    // Conversation we don't know about yet — refresh the list.
                    loadConversations();
                    return prev;
                }
                const conv = { ...prev[idx] };
                conv.lastMessage = {
                    _id: message._id,
                    text: message.text,
                    sender: message.sender?._id || message.sender,
                    createdAt: message.createdAt,
                };
                if (!isActive) {
                    conv.unreadCounts = {
                        ...(conv.unreadCounts || {}),
                        [userId]: ((conv.unreadCounts || {})[userId] || 0) + 1,
                    };
                }
                return [conv, ...prev.filter((c) => c._id !== conversationId)];
            });
        };

        const onConversationCreated = ({ conversation }) => {
            setConversations((prev) =>
                prev.some((c) => c._id === conversation._id) ? prev : [conversation, ...prev]
            );
        };

        const onMessagesRead = ({ conversationId, readAt }) => {
            if (conversationId !== activeIdRef.current) return;
            setMessages((prev) =>
                prev.map((m) =>
                    (m.sender?._id || m.sender) === userId && !m.readAt
                        ? { ...m, readAt }
                        : m
                )
            );
        };

        const onTyping = ({ conversationId, isTyping }) => {
            setTypingConversations((prev) => {
                const next = new Set(prev);
                if (isTyping) next.add(conversationId);
                else next.delete(conversationId);
                return next;
            });

            // Safety net: clear the indicator if a stop event never arrives.
            const timers = typingTimers.current;
            if (timers.has(conversationId)) clearTimeout(timers.get(conversationId));
            if (isTyping) {
                timers.set(
                    conversationId,
                    setTimeout(() => {
                        setTypingConversations((prev) => {
                            const next = new Set(prev);
                            next.delete(conversationId);
                            return next;
                        });
                    }, 4000)
                );
            }
        };

        socket.on('new_message', onNewMessage);
        socket.on('conversation_created', onConversationCreated);
        socket.on('messages_read', onMessagesRead);
        socket.on('typing', onTyping);

        return () => {
            socket.off('new_message', onNewMessage);
            socket.off('conversation_created', onConversationCreated);
            socket.off('messages_read', onMessagesRead);
            socket.off('typing', onTyping);
        };
    }, [socket, userId, markAsRead, loadConversations]);

    const value = {
        conversations,
        loadingConversations,
        activeConversation,
        messages,
        loadingMessages,
        hasMoreMessages,
        loadOlderMessages,
        selectConversation,
        closeConversation,
        sendMessage,
        startConversation,
        emitTyping,
        getOtherUser,
        unreadFor,
        isTyping: (conversationId) => typingConversations.has(conversationId),
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatProvider, useChat };
