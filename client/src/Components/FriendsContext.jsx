import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import api from '../lib/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const FriendsContext = createContext(null);
const useFriends = () => useContext(FriendsContext);

// user list helpers (dedupe / remove by _id, ids are JSON strings)
const upsertById = (list, user) =>
    list.some((u) => u._id === user._id) ? list : [user, ...list];
const removeById = (list, id) => list.filter((u) => u._id !== id);

const FriendsProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { socket } = useSocket();

    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncoming] = useState([]);
    const [outgoingRequests, setOutgoing] = useState([]);
    const [hydrated, setHydrated] = useState(false);
    const [busy, setBusy] = useState(() => new Set()); // userIds with an in-flight action
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    const showToast = useCallback((message) => {
        setToast(message);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);
    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    // id-sets for O(1) relationship lookup
    const friendIds = useMemo(() => new Set(friends.map((u) => u._id)), [friends]);
    const incomingIds = useMemo(() => new Set(incomingRequests.map((u) => u._id)), [incomingRequests]);
    const outgoingIds = useMemo(() => new Set(outgoingRequests.map((u) => u._id)), [outgoingRequests]);

    // Live relationship, derived from the id-sets so search/right-panel buttons
    // update in place. Falls back to the server-provided value for first paint
    // (before hydration completes).
    const getRelationship = useCallback(
        (userId, fallback = 'none') => {
            if (!hydrated) return fallback;
            if (friendIds.has(userId)) return 'friend';
            if (outgoingIds.has(userId)) return 'outgoing';
            if (incomingIds.has(userId)) return 'incoming';
            return 'none';
        },
        [hydrated, friendIds, outgoingIds, incomingIds]
    );

    const setBusyFor = useCallback((id, on) => {
        setBusy((prev) => {
            const next = new Set(prev);
            if (on) next.add(id); else next.delete(id);
            return next;
        });
    }, []);
    const isBusy = useCallback((id) => busy.has(id), [busy]);

    // ---- hydrate ----
    const hydrate = useCallback(async () => {
        try {
            const [f, r] = await Promise.all([
                api.get('/friends'),
                api.get('/friends/requests'),
            ]);
            setFriends(f.data.friends || []);
            setIncoming(r.data.incoming || []);
            setOutgoing(r.data.outgoing || []);
        } catch (err) {
            console.error('Failed to load friends:', err);
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            hydrate();
        } else {
            setFriends([]);
            setIncoming([]);
            setOutgoing([]);
            setHydrated(false);
        }
    }, [isAuthenticated, hydrate]);

    // ---- actions (button disabled+spinner while in flight; commit on success) ----
    const sendRequest = useCallback(async (userId) => {
        setBusyFor(userId, true);
        try {
            const { data } = await api.post('/friends/request', { userId });
            if (data.autoAccepted) {
                // Mutual case: went straight to friends, not outgoing.
                setFriends((prev) => upsertById(prev, data.user));
                setOutgoing((prev) => removeById(prev, userId));
                setIncoming((prev) => removeById(prev, userId));
            } else {
                setOutgoing((prev) => upsertById(prev, data.user));
            }
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not send request');
        } finally {
            setBusyFor(userId, false);
        }
    }, [setBusyFor, showToast]);

    const acceptRequest = useCallback(async (userId) => {
        setBusyFor(userId, true);
        try {
            const { data } = await api.post('/friends/accept', { userId });
            setFriends((prev) => upsertById(prev, data.user));
            setIncoming((prev) => removeById(prev, userId));
            setOutgoing((prev) => removeById(prev, userId));
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not accept request');
        } finally {
            setBusyFor(userId, false);
        }
    }, [setBusyFor, showToast]);

    const rejectRequest = useCallback(async (userId) => {
        setBusyFor(userId, true);
        try {
            await api.post('/friends/reject', { userId });
            setIncoming((prev) => removeById(prev, userId));
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not reject request');
        } finally {
            setBusyFor(userId, false);
        }
    }, [setBusyFor, showToast]);

    const cancelRequest = useCallback(async (userId) => {
        setBusyFor(userId, true);
        try {
            await api.post('/friends/cancel', { userId });
            setOutgoing((prev) => removeById(prev, userId));
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not cancel request');
        } finally {
            setBusyFor(userId, false);
        }
    }, [setBusyFor, showToast]);

    const unfriend = useCallback(async (userId) => {
        setBusyFor(userId, true);
        try {
            await api.delete(`/friends/${userId}`);
            setFriends((prev) => removeById(prev, userId));
        } catch (err) {
            showToast(err.response?.data?.error || 'Could not remove friend');
        } finally {
            setBusyFor(userId, false);
        }
    }, [setBusyFor, showToast]);

    // ---- sockets (registered synchronously; cleaned up on unmount) ----
    useEffect(() => {
        if (!socket) return;

        const onReceived = ({ user }) => {
            if (user) setIncoming((prev) => upsertById(prev, user));
        };
        const onAccepted = ({ user }) => {
            // Covers both normal accept and auto-accept (emitted to both sides).
            if (!user) return;
            setFriends((prev) => upsertById(prev, user));
            setOutgoing((prev) => removeById(prev, user._id));
            setIncoming((prev) => removeById(prev, user._id));
        };
        const onRemoved = ({ userId }) => {
            if (userId) setFriends((prev) => removeById(prev, userId));
        };
        // Counterparty-side live sync for cancel/reject (actor already updated locally).
        const onCancelled = ({ userId }) => {
            if (userId) setIncoming((prev) => removeById(prev, userId));
        };
        const onRejected = ({ userId }) => {
            if (userId) setOutgoing((prev) => removeById(prev, userId));
        };

        socket.on('friend_request_received', onReceived);
        socket.on('friend_request_accepted', onAccepted);
        socket.on('friend_removed', onRemoved);
        socket.on('friend_request_cancelled', onCancelled);
        socket.on('friend_request_rejected', onRejected);
        return () => {
            socket.off('friend_request_received', onReceived);
            socket.off('friend_request_accepted', onAccepted);
            socket.off('friend_removed', onRemoved);
            socket.off('friend_request_cancelled', onCancelled);
            socket.off('friend_request_rejected', onRejected);
        };
    }, [socket]);

    const value = {
        friends,
        incomingRequests,
        outgoingRequests,
        incomingCount: incomingRequests.length,
        hydrated,
        getRelationship,
        isBusy,
        sendRequest,
        acceptRequest,
        rejectRequest,
        cancelRequest,
        unfriend,
        showToast,
    };

    return (
        <FriendsContext.Provider value={value}>
            {children}
            {toast && (
                <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white shadow-lg">
                    {toast}
                </div>
            )}
        </FriendsContext.Provider>
    );
};

export { FriendsProvider, useFriends };
