import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

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

        // Simulate API Call delay
        setTimeout(() => {
            // Mock Result logic
            const mockResult = Math.random() > 0.5 ? "High Risk Detected" : "Normal Health Status";
            setResult({
                prediction: mockResult,
                hash: "0x7f83...2a9c" // Mock Blockchain Hash
            });
            setLoading(false);
        }, 2000);
    };

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
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${result.prediction.includes("High Risk") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                            {result.prediction.includes("High Risk") ? <AlertTriangle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analysis Complete</h3>
                        <p className={`text-xl font-bold mb-6 ${result.prediction.includes("High Risk") ? "text-red-600" : "text-green-600"}`}>
                            result: {result.prediction}
                        </p>

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
