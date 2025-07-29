import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/profile', {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => setIsAuthenticated(res.status === 200))
            .catch(() => setIsAuthenticated(false));
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };