import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeartDisease from './pages/HeartDisease';
import Diabetes from './pages/Diabetes';
import GeneralHealth from './pages/GeneralHealth';
import BrainTumor from './pages/BrainTumor';
import Profile from './pages/Profile';
import './index.css';

// Lazy load admin pages to isolate any import errors
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDatabase = React.lazy(() => import('./pages/admin/AdminDatabase'));
const AdminAudience = React.lazy(() => import('./pages/admin/AdminAudience'));

const AdminFallback = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#030712' }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
            <p style={{ color: '#9ca3af' }}>Loading Admin Panel...</p>
        </div>
    </div>
);

const App = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes — own tree, checked FIRST */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AdminRoute />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
                                <Route path="/admin/database" element={<Suspense fallback={<AdminFallback />}><AdminDatabase /></Suspense>} />
                                <Route path="/admin/audience" element={<Suspense fallback={<AdminFallback />}><AdminAudience /></Suspense>} />
                            </Route>
                        </Route>
                    </Route>

                    {/* User Routes */}
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

