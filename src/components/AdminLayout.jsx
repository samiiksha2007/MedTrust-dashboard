import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Users, ArrowLeft, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebarLink = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </Link>
    );
};

const AdminLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-gray-950">
            {/* Dark Admin Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 fixed h-full hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">MedTrust</h1>
                            <p className="text-xs text-indigo-400 font-medium tracking-wide">ADMIN PANEL</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Analytics</p>
                    <AdminSidebarLink to="/admin" icon={LayoutDashboard} label="Overview" />
                    <AdminSidebarLink to="/admin/database" icon={Database} label="Database" />
                    <AdminSidebarLink to="/admin/audience" icon={Users} label="Audience" />
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-3">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-gray-200 rounded-lg transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                            {(user?.displayName || user?.email || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-200">
                                {user?.displayName || user?.email?.split('@')[0] || "Admin"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-all duration-200 text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-8 bg-gray-950 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
