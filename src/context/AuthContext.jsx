import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword // Added for potential sign up
} from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from 'react';

const AuthContext = createContext(null);

// Helper to detect country
const detectCountry = async () => {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            const data = await res.json();
            return data.country_name || 'Unknown';
        }
    } catch (e) {
        console.warn('Country detection failed:', e);
    }
    return 'Unknown';
};

// Helper to log auth events to Firestore
const logAuthEvent = async (email, action) => {
    try {
        const country = await detectCountry();
        await addDoc(collection(db, "authEvents"), {
            email,
            action, // 'login' or 'signup'
            country,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error logging auth event:", error);
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            logAuthEvent(email, 'login'); // Track login
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            logAuthEvent(email, 'signup'); // Track signup
            return true;
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

