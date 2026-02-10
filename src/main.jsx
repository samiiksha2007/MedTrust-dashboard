import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeartDisease from './pages/HeartDisease';
import Diabetes from './pages/Diabetes';
import GeneralHealth from './pages/GeneralHealth';
import BrainTumor from './pages/BrainTumor';
import Profile from './pages/Profile';
import './index.css';

const App = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            {/* Prediction Routes */}
                            <Route path="/start/heart" element={<HeartDisease />} />
                            <Route path="/start/diabetes" element={<Diabetes />} />
                            <Route path="/start/general" element={<GeneralHealth />} />
                            <Route path="/start/brain" element={<BrainTumor />} />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
