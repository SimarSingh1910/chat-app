import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return null; // Optionally show a loading spinner
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;