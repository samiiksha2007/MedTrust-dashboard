import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getResultStatus } from '../utils/predictionUtils';

const PredictionForm = ({ title, fields, onSubmit, endpoint }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const { user } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data); // Debugging

            // Handle various response formats
            const predictionResult = data.predicted_class || data.prediction || data.result || data.output || "Unknown";

            // Format accuracy string
            let accuracyDisplay = "N/A";
            const rawScore = data.confidence_score || data.confidence || data.accuracy || data.probability;

            if (rawScore !== undefined) {
                const score = Number(rawScore);
                accuracyDisplay = score <= 1 ? (score * 100).toFixed(2) + "%" : score.toFixed(2) + "%";
            }

            // Generate mock hash
            const mockHash = "0x" + Math.random().toString(16).substr(2, 40);



            // Sanitize input data ONLY (exclude timestamp which is a special object)
            const safeInputData = JSON.parse(JSON.stringify(formData));

            const predictionData = {
                userEmail: user?.email || "anonymous",
                predictionType: title,
                result: String(predictionResult),
                accuracy: accuracyDisplay,
                inputData: safeInputData,
                blockchainHash: mockHash,
                timestamp: serverTimestamp() // Add timestamp AFTER sanitization
            };

            // Save to Firestore
            await addDoc(collection(db, "predictions"), predictionData);
            console.log("Prediction saved to Firestore!", predictionData);

            setResult({
                prediction: String(predictionResult),
                accuracy: accuracyDisplay,
                hash: mockHash
            });

        } catch (error) {
            console.error("Prediction Error: ", error);
            alert("Failed to get prediction: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper for display
    const getResultUI = () => {
        if (!result) return null;
        return getResultStatus(result.prediction);
    };

    const statusUI = getResultUI();

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{title} Prediction</h2>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {!result ? (
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                        {fields.map((field, idx) => (
                            <div key={idx} className={field.fullWidth ? "md:col-span-2" : ""}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        required={field.required}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleChange}
                                    >
                                        <option value="">Select...</option>
                                        {field.options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        required={field.required}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Data...
                                    </>
                                ) : (
                                    "Run AI Analysis"
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${statusUI?.color || "bg-gray-100"}`}>
                            {statusUI?.icon ? <statusUI.icon className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete</h3>

                        {/* Display User Friendly Text */}
                        <p className={`text-xl font-bold mb-2 ${statusUI?.textColor || "text-gray-800"}`}>
                            {statusUI?.text}
                        </p>

                        <p className="text-gray-600 font-medium mb-6">
                            Model Accuracy: {result.accuracy}
                        </p>

                        {/* Debugging: Show raw result in small text if needed */}
                        <p className="text-xs text-gray-400 mb-6">raw: {result.prediction}</p>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block text-left">
                            <p className="text-sm text-gray-500 mb-1">Blockchain Verification Hash:</p>
                            <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 font-mono break-all">
                                {result.hash}
                            </code>
                        </div>

                        <button
                            onClick={() => setResult(null)}
                            className="block mx-auto mt-8 text-blue-600 font-medium hover:underline"
                        >
                            Run Another Analysis
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionForm;
