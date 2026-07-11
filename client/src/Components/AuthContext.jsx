import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    // The logged-in user's profile (merged user + profile fields from GET /profile).
    // user.user._id is the Mongo user id — exposed as `userId` for convenience.
    const [user, setUser] = useState(null);

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await api.get('/profile');
            setUser(data.profile);
            setIsAuthenticated(true);
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const userId = user?.user?._id || null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, userId, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };
