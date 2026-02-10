import React from 'react';
import PredictionForm from '../components/PredictionForm';
import { API_BASE_URL } from '../apiConfig';

const GeneralHealth = () => {
    const fields = [
        { name: "age", label: "Age (0-120)", type: "number", required: true },
        { name: "weight", label: "Weight (kg)", type: "number", step: "0.1", required: true },
        { name: "height", label: "Height (cm)", type: "number", step: "0.1", required: true },
        { name: "exercise", label: "Exercise Level", type: "select", options: ["low", "medium", "high"], required: true },
        { name: "sleep", label: "Sleep (Hours 0-24)", type: "number", step: "0.5", required: true },
        { name: "sugar_intake", label: "Sugar Intake", type: "select", options: ["low", "medium", "high"], required: true },
        { name: "smoking", label: "Smoking Status", type: "select", options: ["yes", "no"], required: true },
        { name: "alcohol", label: "Alcohol Consumption", type: "select", options: ["yes", "no"], required: true },
        { name: "married", label: "Marital Status (Married?)", type: "select", options: ["yes", "no"], required: true },
        { name: "profession", label: "Profession", type: "select", options: ["student", "farmer", "driver", "doctor", "artist", "engineer", "teacher", "office_worker"], required: true },
    ];

    return (
        <PredictionForm
            title="Life Risk Prediction"
            fields={fields}
            endpoint={`${API_BASE_URL}/predict/life_risk`}
        />
    );
};

export default GeneralHealth;
