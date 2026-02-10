import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export const getResultStatus = (result) => {
    const safeResult = String(result).toLowerCase();

    // High Risk / Disease indicators
    if (
        safeResult.includes("high") ||
        safeResult.includes("1") ||
        safeResult.includes("yes") ||
        safeResult.includes("positive") ||
        (safeResult.includes("tumor") && !safeResult.includes("no_tumor"))
    ) {
        return {
            text: "Detected - Please Consult a Doctor",
            color: "bg-red-100 text-red-700",
            textColor: "text-red-700",
            icon: AlertTriangle,
            isRisk: true
        };
    }

    // Low Risk / Normal indicators
    return {
        text: "Normal - No Immediate Risk",
        color: "bg-green-100 text-green-700",
        textColor: "text-green-700",
        icon: CheckCircle2,
        isRisk: false
    };
};
