import React from 'react';
import PredictionForm from '../components/PredictionForm';
import { API_BASE_URL } from '../apiConfig';

const Diabetes = () => {
    const fields = [
        { name: "gender", label: "Gender", type: "select", options: ["Female", "Male"], required: true },
        { name: "age", label: "Age (0-120)", type: "number", required: true },
        { name: "hypertension", label: "Hypertension", type: "select", options: ["0", "1"], required: true },
        { name: "heart_disease", label: "Heart Disease History", type: "select", options: ["0", "1"], required: true },
        { name: "smoking_history", label: "Smoking History", type: "select", options: ["never", "current", "former", "ever", "not current", "No Info"], required: true },
        { name: "bmi", label: "BMI (0-60)", type: "number", step: "0.1", required: true },
        { name: "HbA1c_level", label: "HbA1c Level (0-15)", type: "number", step: "0.1", required: true },
        { name: "blood_glucose_level", label: "Blood Glucose Level (0-500)", type: "number", required: true },
    ];

    return (
        <PredictionForm
            title="Diabetes"
            fields={fields}
            endpoint={`${API_BASE_URL}/predict/diabetes`}
        />
    );
};

export default Diabetes;
