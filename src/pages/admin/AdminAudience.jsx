import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Globe, Users, Shield, LogIn, UserPlus, MapPin, Clock, Mail } from 'lucide-react';

const AdminAudience = () => {
    const [predictions, setPredictions] = useState([]);
    const [authEvents, setAuthEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch predictions for country/user data
        const fetchPredictions = async () => {
            try {
                const snapshot = await getDocs(collection(db, "predictions"));
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPredictions(data);
            } catch (error) {
                console.error("Error fetching predictions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();

        // Real-time listener for auth events
        const q = query(collection(db, "authEvents"), orderBy("timestamp", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAuthEvents(events);
        }, (error) => {
            console.error("Error listening to auth events:", error);
        });

        return () => unsubscribe();
    }, []);

    // Compute user stats
    const uniqueUsers = [...new Set(predictions.map(p => p.userEmail))];
    const totalUsers = uniqueUsers.length;

    // Country breakdown from predictions
    const countryMap = predictions.reduce((acc, p) => {
        const country = p.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});
    const countryData = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

    // Country breakdown from auth events
    const authCountryMap = authEvents.reduce((acc, e) => {
        const country = e.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});
    const authCountryData = Object.entries(authCountryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

    // User activity (predictions per user)
    const userActivity = uniqueUsers.map(email => {
        const userPreds = predictions.filter(p => p.userEmail === email);
        const lastPred = userPreds.reduce((latest, p) => {
            if (!p.timestamp?.seconds) return latest;
            const t = p.timestamp.seconds;
            return t > latest ? t : latest;
        }, 0);
        const countries = [...new Set(userPreds.map(p => p.country || 'Unknown'))];
        return {
            email,
            predictionCount: userPreds.length,
            lastActive: lastPred,
            countries
        };
    }).sort((a, b) => b.lastActive - a.lastActive);

    const formatTime = (seconds) => {
        if (!seconds) return 'Never';
        const date = new Date(seconds * 1000);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading audience data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Audience & Authentication</h1>
                <p className="text-gray-400">Real-time user activity, authentication events, and geographic distribution.</p>
            </div>

            {/* Read-only notice */}
            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Read-only view — data can only be modified directly in Firebase.</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{totalUsers}</p>
                    <p className="text-sm text-gray-400">Total Users</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{countryData.length}</p>
                    <p className="text-sm text-gray-400">Countries</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <LogIn className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{authEvents.filter(e => e.action === 'login').length}</p>
                    <p className="text-sm text-gray-400">Total Logins</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-pink-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">{authEvents.filter(e => e.action === 'signup').length}</p>
                    <p className="text-sm text-gray-400">Total Signups</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Users by Country */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-400" />
                        Users by Country (Predictions)
                    </h3>
                    {countryData.length > 0 ? (
                        <div className="space-y-3">
                            {countryData.map((item, i) => {
                                const maxCount = countryData[0]?.count || 1;
                                const percent = ((item.count / maxCount) * 100).toFixed(0);
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300 w-32 truncate">{item.country}</span>
                                        <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-400 w-10 text-right">{item.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No country data yet. Country tracking starts with new predictions.</p>
                    )}
                </div>

                {/* Authentication by Country */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-400" />
                        Logins by Country
                    </h3>
                    {authCountryData.length > 0 ? (
                        <div className="space-y-3">
                            {authCountryData.map((item, i) => {
                                const maxCount = authCountryData[0]?.count || 1;
                                const percent = ((item.count / maxCount) * 100).toFixed(0);
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-sm text-gray-300 w-32 truncate">{item.country}</span>
                                        <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-400 w-10 text-right">{item.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No login data yet. Auth tracking starts with the next login.</p>
                    )}
                </div>
            </div>

            {/* Authentication Events Feed */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    Authentication Events
                    <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400 font-normal">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                    </span>
                </h3>
                {authEvents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-800">
                                    <th className="text-left py-3 px-3 font-medium">Action</th>
                                    <th className="text-left py-3 px-3 font-medium">Email</th>
                                    <th className="text-left py-3 px-3 font-medium">Country</th>
                                    <th className="text-left py-3 px-3 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {authEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="py-3 px-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${event.action === 'login'
                                                    ? 'bg-blue-500/15 text-blue-400'
                                                    : 'bg-green-500/15 text-green-400'
                                                }`}>
                                                {event.action === 'login' ? <LogIn className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                                                {event.action === 'login' ? 'Login' : 'Signup'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-gray-300 flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                                            {event.email}
                                        </td>
                                        <td className="py-3 px-3 text-gray-300">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                                {event.country || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-gray-400 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                                            {event.timestamp?.seconds ? formatTime(event.timestamp.seconds) : 'Pending...'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm text-center py-8">No authentication events recorded yet. Events will appear here after the next login or signup.</p>
                )}
            </div>

            {/* User List */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    All Users
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-800">
                                <th className="text-left py-3 px-3 font-medium">User</th>
                                <th className="text-left py-3 px-3 font-medium">Predictions</th>
                                <th className="text-left py-3 px-3 font-medium">Country</th>
                                <th className="text-left py-3 px-3 font-medium">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {userActivity.map((u, i) => (
                                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                                                {u.email.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-gray-300">{u.email}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="inline-flex items-center px-2.5 py-1 bg-indigo-500/15 text-indigo-400 text-xs rounded-full font-medium">
                                            {u.predictionCount}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-300">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                            {u.countries.join(', ')}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-gray-400">
                                        {formatTime(u.lastActive)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAudience;
