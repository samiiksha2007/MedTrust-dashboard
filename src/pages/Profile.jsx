import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { User, Mail, Calendar, Activity, Edit2, Save, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

const getResultStatus = (result) => {
    const safeResult = String(result).toLowerCase();

    // High Risk / Disease indicators
    if (
        safeResult.includes("high") ||
        safeResult.includes("1") ||
        safeResult.includes("yes") ||
        safeResult.includes("positive") ||
        safeResult.includes("tumor") && !safeResult.includes("no_tumor")
    ) {
        return {
            text: "Detected - Please Consult a Doctor",
            color: "bg-red-100 text-red-700",
            icon: AlertTriangle
        };
    }

    // Low Risk / Normal indicators
    return {
        text: "Normal - No Immediate Risk",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle2
    };
};

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // User profile state
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
                // Note: using 'orderBy' with 'where' requires a Firestore Index.
                // We'll remove orderBy for now to ensure it works immediately.
                // You can add client-side sorting if needed.
                const q = query(
                    collection(db, "predictions"),
                    where("userEmail", "==", user.email)
                );

                const querySnapshot = await getDocs(q);
                const fetchedPredictions = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => {
                    // Sort by timestamp descending (newest first)
                    // Handle missing timestamps safely
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
                await updateProfile(user, {
                    displayName: profileData.displayName
                });
                // Force reload/update of auth state if needed, but usually Firebase handles it
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

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg">
                                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                                    {profileData.displayName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{profileData.displayName}</h1>
                                <p className="text-gray-500">{profileData.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                        </button>
                    </div>

                    {/* Profile Details Form */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Personal Information
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.displayName}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                                        <input
                                            type="text"
                                            value={profileData.age}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                                        <input
                                            type="text"
                                            value={profileData.bloodGroup}
                                            disabled={!isEditing}
                                            onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-600" /> Contact Details
                            </h3>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled={true} // Email usually shouldn't be edited easily
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        disabled={!isEditing}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Records / History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-green-600" /> Medical History Record
                </h2>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading records...</div>
                ) : predictions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No medical records found.</p>
                        <p className="text-sm text-gray-400 mt-1">Run an AI analysis to see results here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 font-semibold text-gray-600 pl-4">Date</th>
                                    <th className="pb-4 font-semibold text-gray-600">Test Type</th>
                                    <th className="pb-4 font-semibold text-gray-600">Result</th>
                                    <th className="pb-4 font-semibold text-gray-600">Accuracy</th>
                                    <th className="pb-4 font-semibold text-gray-600">ID / Hash</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {predictions.map((pred) => {
                                    const status = getResultStatus(pred.result);
                                    return (
                                        <tr key={pred.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-4 text-gray-600 font-medium">
                                                {pred.timestamp?.seconds
                                                    ? new Date(pred.timestamp.seconds * 1000).toLocaleString('en-IN', {
                                                        timeZone: 'Asia/Kolkata',
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })
                                                    : "Just now"}
                                            </td>
                                            <td className="py-4 font-medium text-gray-900">{pred.predictionType}</td>
                                            <td className="py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                    <status.icon className="w-3 h-3" />
                                                    {status.text}
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-600 font-medium">{pred.accuracy}</td>
                                            <td className="py-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-mono">
                                                    {pred.blockchainHash?.substring(0, 10)}...
                                                </code>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
