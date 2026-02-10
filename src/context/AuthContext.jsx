import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    // Login function - Mock implementation for now
    const login = (username) => {
        // In real app, this would verify with backend
        const fakeUser = { id: 1, username, role: 'patient' };
        setUser(fakeUser);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
