import React from 'react';
import PredictionForm from '../components/PredictionForm';

const GeneralHealth = () => {
    const fields = [
        { name: "age", label: "Age", type: "number", required: true },
        { name: "weight", label: "Weight (kg)", type: "number", required: true },
        { name: "height", label: "Height (cm)", type: "number", required: true },
        { name: "systolic", label: "Systolic BP", type: "number", required: true },
        { name: "diastolic", label: "Diastolic BP", type: "number", required: true },
        { name: "symptoms", label: "Describe Symptoms", type: "text", required: true, fullWidth: true, placeholder: "e.g., Fever, Headache..." },
    ];

    return (
        <PredictionForm
            title="General Health Check"
            fields={fields}
            endpoint="/api/predict/general"
        />
    );
};

export default GeneralHealth;
