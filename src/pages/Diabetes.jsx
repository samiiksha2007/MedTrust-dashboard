import React from 'react';
import PredictionForm from '../components/PredictionForm';

const Diabetes = () => {
    const fields = [
        { name: "pregnancies", label: "Pregnancies", type: "number", required: true },
        { name: "glucose", label: "Glucose Level", type: "number", required: true },
        { name: "bloodPressure", label: "Blood Pressure", type: "number", required: true },
        { name: "skinThickness", label: "Skin Thickness", type: "number", required: true },
        { name: "insulin", label: "Insulin Level", type: "number", required: true },
        { name: "bmi", label: "BMI", type: "number", required: true },
    ];

    return (
        <PredictionForm
            title="Diabetes"
            fields={fields}
            endpoint="/api/predict/diabetes"
        />
    );
};

export default Diabetes;
