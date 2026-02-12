import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Heart, Activity, Brain, User, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_EMAIL = 'medtrust2026@gmail.com';

const SidebarLink = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );
};

const Layout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Activity className="w-8 h-8" /> MedTrust
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarLink to="/start/general" icon={Activity} label="General Health" />
                    <SidebarLink to="/start/heart" icon={Heart} label="Heart Disease" />
                    <SidebarLink to="/start/diabetes" icon={Activity} label="Diabetes" />
                    <SidebarLink to="/start/brain" icon={Brain} label="Brain Tumor" />
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-3">
                    {/* Server Status Indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-medium text-gray-500">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        API: Connected (Proxy)
                    </div>

                    <a
                        href="https://samiiksha2007.github.io/MedTrust/"
                        className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Blog</span>
                    </a>

                    {/* Admin Panel Link — only visible to admin */}
                    {user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 mb-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors font-medium"
                        >
                            <Shield className="w-5 h-5" />
                            <span>Admin Panel</span>
                        </Link>
                    )}
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 mb-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer group"
                    >
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200 group-hover:bg-blue-200 transition-colors">
                            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-900">
                                {user?.displayName || user?.email?.split('@')[0] || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
