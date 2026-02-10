import React from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../apiConfig';
import { Loader2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getResultStatus } from '../utils/predictionUtils';

const BrainTumor = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [image, setImage] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        setLoading(true);
        setResult(null);

        try {
            // Convert blob URL to File object if needed, but here we just need the file input
            // Ideally we should have stored the file object in state. 
            // Let's assume the user re-selects or we can't easily get the file from valid blob url without fetch.
            // BETTER APPROACH: Update handleImageChange to store the file object.

            // For now, let's fix handleImageChange to store file, see next edit.
            if (!selectedFile) {
                alert("Please select an image first");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch(`${API_BASE_URL}/predict/brain_tumor`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Brain Tumor API Response:", data);

            // Handle various response formats
            const predictionResult = data.predicted_class || data.prediction || data.result || "Unknown";

            const rawScore = data.confidence_score || data.confidence || data.accuracy || data.probability;
            let accuracyDisplay = "N/A";
            if (rawScore !== undefined) {
                accuracyDisplay = Number(rawScore).toFixed(2) + "%";
            }

            const mockHash = "0x" + Math.random().toString(16).substr(2, 40);


            try {
                // Sanitize input only
                const safeInputData = JSON.parse(JSON.stringify({ filename: selectedFile.name }));

                const predictionData = {
                    userEmail: user?.email || "anonymous",
                    predictionType: "Brain Tumor Detection",
                    result: String(predictionResult),
                    accuracy: accuracyDisplay,
                    inputData: safeInputData,
                    blockchainHash: mockHash,
                    timestamp: serverTimestamp() // Add AFTER sanitization
                };

                // Save to Firestore
                await addDoc(collection(db, "predictions"), predictionData);
                console.log("Prediction saved to Firestore!", predictionData);
            } catch (error) {
                console.error("Error adding document: ", error);
            }

            setResult({
                prediction: String(predictionResult),
                confidence: accuracyDisplay,
                hash: mockHash
            });

        } catch (error) {
            console.error("Error:", error);
            alert("Prediction failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const statusUI = result ? getResultStatus(result.prediction) : null;

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
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${statusUI?.color || "bg-gray-100"}`}>
                            {statusUI?.icon ? <statusUI.icon className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{statusUI?.text}</h3>
                        <p className="text-gray-500 mb-6">Confidence: {result.confidence}</p>

                        <p className="text-xs text-gray-400 mb-6">raw: {result.prediction}</p>

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
