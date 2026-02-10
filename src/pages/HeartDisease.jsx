import React from 'react';
import PredictionForm from '../components/PredictionForm';

const HeartDisease = () => {
    const fields = [
        { name: "age", label: "Age", type: "number", required: true },
        { name: "sex", label: "Sex", type: "select", options: ["Male", "Female"], required: true },
        { name: "cp", label: "Chest Pain Type", type: "select", options: ["Typical Angina", "Atypical Angina", "Non-anginal Pain", "Asymptomatic"], required: true },
        { name: "trestbps", label: "Resting Blood Pressure", type: "number", required: true },
        { name: "chol", label: "Serum Cholestoral (mg/dl)", type: "number", required: true },
        { name: "fbs", label: "Fasting Blood Sugar > 120 mg/dl", type: "select", options: ["True", "False"], required: true },
    ];

    return (
        <PredictionForm
            title="Heart Disease"
            fields={fields}
            endpoint="/api/predict/heart"
        />
    );
};

export default HeartDisease;
