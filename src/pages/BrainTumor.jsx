import React from 'react';
import { Loader2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

const BrainTumor = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        setLoading(true);
        // Simulate API Call
        setTimeout(() => {
            setResult({
                prediction: "No Tumor Detected",
                confidence: "98.2%",
                hash: "0x3a2...9b1"
            });
            setLoading(false);
        }, 2500);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Brain Tumor Detection</h2>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                {!result ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            {image ? (
                                <div className="relative h-64 w-full">
                                    <img src={image} alt="Preview" className="h-full w-full object-contain" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-medium">Click to upload MRI Scan</p>
                                    <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, DICOM</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!image || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Analyze MRI Scan"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 bg-green-100 text-green-600`}>
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{result.prediction}</h3>
                        <p className="text-gray-500 mb-6">Confidence: {result.confidence}</p>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block text-left">
                            <p className="text-sm text-gray-500 mb-1">Blockchain Verification Hash:</p>
                            <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 font-mono break-all">
                                {result.hash}
                            </code>
                        </div>

                        <button
                            onClick={() => { setResult(null); setImage(null); }}
                            className="block mx-auto mt-8 text-blue-600 font-medium hover:underline"
                        >
                            Analyze New Scan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Need to import useState here since we didn't use the wrapper component
import { useState } from 'react';

export default BrainTumor;
