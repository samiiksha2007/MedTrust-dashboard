import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
        {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const AdminDashboard = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "predictions"));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPredictions(data);
            } catch (error) {
                console.error("Error fetching predictions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Compute stats
    const totalPredictions = predictions.length;
    const uniqueUsers = [...new Set(predictions.map(p => p.userEmail))].length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const predictionsToday = predictions.filter(p => {
        if (!p.timestamp?.seconds) return false;
        const d = new Date(p.timestamp.seconds * 1000);
        return d >= today;
    }).length;

    const detectedCount = predictions.filter(p => {
        const r = String(p.result).toLowerCase();
        return r.includes('high') || r.includes('1') || r.includes('yes') || r.includes('positive') ||
            (r.includes('tumor') && !r.includes('no_tumor'));
    }).length;

    const detectionRate = totalPredictions > 0 ? ((detectedCount / totalPredictions) * 100).toFixed(1) : '0';

    // Prediction type breakdown (Pie chart)
    const typeBreakdown = predictions.reduce((acc, p) => {
        const type = p.predictionType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(typeBreakdown).map(([name, value]) => ({ name, value }));

    // Predictions over time (Line chart — last 30 days)
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        last30Days.push({
            date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            timestamp: d.getTime(),
            count: 0
        });
    }
    predictions.forEach(p => {
        if (!p.timestamp?.seconds) return;
        const d = new Date(p.timestamp.seconds * 1000);
        d.setHours(0, 0, 0, 0);
        const entry = last30Days.find(e => e.timestamp === d.getTime());
        if (entry) entry.count++;
    });

    // Results distribution (Bar chart)
    const barData = [
        { name: 'Detected', count: detectedCount, fill: '#ef4444' },
        { name: 'Normal', count: totalPredictions - detectedCount, fill: '#22c55e' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Analytics Overview</h1>
                <p className="text-gray-400">Complete end-to-end analysis of MedTrust platform data.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value={uniqueUsers} color="bg-indigo-500/20 text-indigo-400" />
                <StatCard icon={Activity} label="Total Predictions" value={totalPredictions} color="bg-pink-500/20 text-pink-400" />
                <StatCard icon={TrendingUp} label="Predictions Today" value={predictionsToday} color="bg-amber-500/20 text-amber-400" />
                <StatCard icon={AlertTriangle} label="Detection Rate" value={`${detectionRate}%`} color="bg-red-500/20 text-red-400" subtext={`${detectedCount} of ${totalPredictions} detected`} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart — Predictions Over Time */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Predictions Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={last30Days}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} interval={4} />
                            <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                                labelStyle={{ color: '#9ca3af' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart — Prediction Type Breakdown */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Prediction Type Breakdown</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-gray-500">No data yet</div>
                    )}
                </div>
            </div>

            {/* Bar Chart — Results Distribution */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Results Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {barData.map((entry, index) => (
                                <Cell key={`bar-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;
