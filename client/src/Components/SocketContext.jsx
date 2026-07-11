import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSocket, disconnectSocket } from '../lib/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext({ socket: null, isOnline: () => false });

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    // Live presence overrides: userId -> true/false. Users we haven't heard
    // about fall back to the `online` flag the API returned at load time.
    const [presence, setPresence] = useState(() => new Map());
    // State (not a ref) so consumers re-render once the socket exists.
    const [activeSocket, setActiveSocket] = useState(null);

    useEffect(() => {
        // Only hold a live socket while authenticated.
        if (!isAuthenticated) {
            disconnectSocket();
            setActiveSocket(null);
            setPresence(new Map());
            return;
        }

        const socket = getSocket();
        setActiveSocket(socket);
        if (!socket.connected) socket.connect();

        const setStatus = (userId, online) =>
            setPresence((prev) => new Map(prev).set(userId, online));
        const onOnline = ({ userId }) => setStatus(userId, true);
        const onOffline = ({ userId }) => setStatus(userId, false);

        socket.on('user_online', onOnline);
        socket.on('user_offline', onOffline);

        return () => {
            socket.off('user_online', onOnline);
            socket.off('user_offline', onOffline);
        };
    }, [isAuthenticated]);

    // fallback: the `online` value the REST API reported for this user.
    const isOnline = useCallback(
        (userId, fallback = false) =>
            presence.has(userId) ? presence.get(userId) : fallback,
        [presence]
    );

    return (
        <SocketContext.Provider value={{ socket: activeSocket, isOnline }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, useSocket };
