import React from 'react';
import PredictionForm from '../components/PredictionForm';
import { API_BASE_URL } from '../apiConfig';

const HeartDisease = () => {
    const fields = [
        { name: "age", label: "Age (0-120)", type: "number", required: true },
        { name: "sex", label: "Sex", type: "select", options: ["M", "F"], required: true },
        { name: "chest_pain_type", label: "Chest Pain Type", type: "select", options: ["ATA", "NAP", "ASY", "TA"], required: true },
        { name: "resting_bp", label: "Resting Blood Pressure (0-200)", type: "number", required: true },
        { name: "colestrol", label: "Cholesterol (0-600)", type: "number", required: true },
        { name: "fasting_bs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select", options: ["0", "1"], required: true },
        { name: "resting_ecg", label: "Resting ECG", type: "select", options: ["Normal", "ST", "LVH"], required: true },
        { name: "max_hr", label: "Max Heart Rate (0-200)", type: "number", required: true },
        { name: "ex_ang", label: "Exercise Angina", type: "select", options: ["Y", "N"], required: true },
        { name: "old_peak", label: "Old Peak (Float)", type: "number", step: "0.1", required: true },
        { name: "slope", label: "ST Slope", type: "select", options: ["Up", "Flat", "Down"], required: true },
    ];

    return (
        <PredictionForm
            title="Heart Disease"
            fields={fields}
            endpoint={`${API_BASE_URL}/predict/heart_disease`}
        />
    );
};

export default HeartDisease;
