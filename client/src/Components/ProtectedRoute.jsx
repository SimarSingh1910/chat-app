import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Auth check still in flight — show a lightweight splash, not a blank page.
    if (isAuthenticated === null) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-teal-100">
                <div className="w-10 h-10 rounded-full border-4 border-cyan-200 border-t-cyan-600 animate-spin" />
                <p className="mt-4 text-sm text-gray-500">Loading your chats…</p>
            </div>
        );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
