import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Database, Search, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const getResultStatus = (result) => {
    const safeResult = String(result).toLowerCase();
    if (
        safeResult.includes('high') || safeResult.includes('1') ||
        safeResult.includes('yes') || safeResult.includes('positive') ||
        (safeResult.includes('tumor') && !safeResult.includes('no_tumor'))
    ) {
        return { text: 'Detected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle };
    }
    return { text: 'Normal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
};

const ROWS_PER_PAGE = 25;

const AdminDatabase = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "predictions"));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA;
                });
                setPredictions(data);
            } catch (error) {
                console.error("Error fetching predictions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get unique prediction types for filter
    const predictionTypes = ['All', ...new Set(predictions.map(p => p.predictionType).filter(Boolean))];

    // Filter predictions
    const filtered = predictions.filter(p => {
        const matchesSearch = searchQuery === '' ||
            (p.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.predictionType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.blockchainHash || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || p.predictionType === filterType;
        return matchesSearch && matchesType;
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
    const paginatedData = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading database...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Firebase Database</h1>
                <p className="text-gray-400">Structured view of all prediction records. This view is read-only.</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by email, type, or hash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer min-w-[180px]"
                    >
                        {predictionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <Database className="w-4 h-4" />
                    <span>{filtered.length} records found</span>
                    {searchQuery && <span className="text-indigo-400">• Filtered</span>}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prediction Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Result</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Accuracy</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Blockchain Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center text-gray-500">
                                        No records match your search.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((pred, idx) => {
                                    const status = getResultStatus(pred.result);
                                    const rowNum = (currentPage - 1) * ROWS_PER_PAGE + idx + 1;
                                    return (
                                        <tr key={pred.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{rowNum}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                                                {pred.timestamp?.seconds
                                                    ? new Date(pred.timestamp.seconds * 1000).toLocaleString('en-IN', {
                                                        timeZone: 'Asia/Kolkata',
                                                        day: '2-digit', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit', hour12: true
                                                    })
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-200 font-medium">{pred.userEmail || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                                                    {pred.predictionType || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                                                    <status.icon className="w-3 h-3" />
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-300 font-medium">{pred.accuracy || '—'}</td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-gray-800 px-2 py-1 rounded-md text-gray-400 font-mono border border-gray-700">
                                                    {pred.blockchainHash ? `${pred.blockchainHash.substring(0, 16)}...` : '—'}
                                                </code>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ROWS_PER_PAGE + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-gray-400 px-3">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Immutability Notice */}
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-300">
                    This view is <strong>read-only</strong>. To modify records, please use the Firebase Console directly.
                </p>
            </div>
        </div>
    );
};

export default AdminDatabase;
