import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { User, Mail, Calendar, Activity, Edit2, Save, AlertTriangle, CheckCircle2, Shield, Clock, Hash, FileText } from 'lucide-react';

const getResultStatus = (result) => {
    const safeResult = String(result).toLowerCase();
    if (
        safeResult.includes("high") ||
        safeResult.includes("1") ||
        safeResult.includes("yes") ||
        safeResult.includes("positive") ||
        (safeResult.includes("tumor") && !safeResult.includes("no_tumor"))
    ) {
        return {
            text: "Detected - Please Consult a Doctor",
            color: "bg-red-50 text-red-700 border border-red-200",
            icon: AlertTriangle
        };
    }
    return {
        text: "Normal - No Immediate Risk",
        color: "bg-green-50 text-green-700 border border-green-200",
        icon: CheckCircle2
    };
};

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        displayName: user?.displayName || user?.email?.split('@')[0] || "Patient",
        email: user?.email || "",
        phone: "Not Set",
        age: "Not Set",
        bloodGroup: "Not Set"
    });

    useEffect(() => {
        const fetchPredictions = async () => {
            if (!user?.email) return;
            try {
                const q = query(
                    collection(db, "predictions"),
                    where("userEmail", "==", user.email)
                );
                const querySnapshot = await getDocs(q);
                const fetchedPredictions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA;
                });
                setPredictions(fetchedPredictions);
            } catch (error) {
                console.error("Error fetching predictions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            if (user && profileData.displayName !== user.displayName) {
                await updateProfile(user, { displayName: profileData.displayName });
                alert("Profile updated successfully!");
            } else {
                alert("Profile saved!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsEditing(false);
        }
    };

    const detectedCount = predictions.filter(p => {
        const s = getResultStatus(p.result);
        return s.text.includes("Detected");
    }).length;
    const normalCount = predictions.length - detectedCount;

    const formatDate = (timestamp) => {
        if (!timestamp?.seconds) return "Just now";
        return new Date(timestamp.seconds * 1000).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                {/* Banner */}
                <div className="h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-t-2xl relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIi8+PC9zdmc+')] opacity-60 rounded-t-2xl"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 sm:px-8 pb-6 pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        {/* Avatar */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                            {profileData.displayName.charAt(0).toUpperCase()}
                        </div>

                        {/* Name & Email */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{profileData.displayName}</h1>
                            <p className="text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5" />
                                {profileData.email}
                            </p>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all self-start sm:self-auto ${isEditing
                                ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                }`}
                        >
                            {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                            <p className="text-2xl font-bold text-blue-700">{predictions.length}</p>
                            <p className="text-xs text-blue-500 font-medium">Total Tests</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                            <p className="text-2xl font-bold text-green-700">{normalCount}</p>
                            <p className="text-xs text-green-500 font-medium">Normal</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
                            <p className="text-2xl font-bold text-red-700">{detectedCount}</p>
                            <p className="text-xs text-red-500 font-medium">Detected</p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" /> Personal Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.displayName}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-sm transition-all outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Age</label>
                                        <input
                                            type="text"
                                            value={profileData.age}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-sm transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Blood Group</label>
                                        <input
                                            type="text"
                                            value={profileData.bloodGroup}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-sm transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <Mail className="w-4 h-4 text-purple-600" /> Contact
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled={true}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-sm transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-600" /> Medical History
                    </h2>
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        {predictions.length} record{predictions.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : predictions.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No medical records found</p>
                        <p className="text-sm text-gray-400 mt-1">Run an AI analysis to see results here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {predictions.map((pred) => {
                            const status = getResultStatus(pred.result);
                            return (
                                <div key={pred.id} className="bg-gray-50 hover:bg-gray-100/80 rounded-xl p-4 transition-all border border-gray-100 hover:border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        {/* Test Type */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm">{pred.predictionType}</p>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-gray-500" />
                                                    {formatDate(pred.timestamp)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Shield className="w-3 h-3 text-gray-500" />
                                                    Confidence: {pred.accuracy}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Result Badge */}
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${status.color} self-start`}>
                                            <status.icon className="w-3.5 h-3.5" />
                                            {status.text}
                                        </div>
                                    </div>

                                    {/* Hash */}
                                    {pred.blockchainHash && (
                                        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-gray-200/60">
                                            <Hash className="w-3 h-3 text-gray-400" />
                                            <code className="text-[11px] text-gray-400 font-mono">
                                                {pred.blockchainHash.substring(0, 20)}...
                                            </code>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
