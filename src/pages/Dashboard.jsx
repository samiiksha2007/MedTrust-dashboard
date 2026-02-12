import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Brain, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: "General Health",
            desc: "Comprehensive health screening using vital signs, BMI, and lifestyle factors for early risk detection.",
            icon: Activity,
            gradient: "from-blue-500 to-cyan-400",
            shadowColor: "shadow-blue-200",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            tag: "Most Popular",
            link: "/start/general"
        },
        {
            title: "Heart Disease",
            desc: "Advanced cardiovascular risk analysis powered by AI, using cholesterol, BP, and ECG parameters.",
            icon: Heart,
            gradient: "from-rose-500 to-pink-400",
            shadowColor: "shadow-rose-200",
            iconBg: "bg-rose-500/10",
            iconColor: "text-rose-500",
            tag: "Critical",
            link: "/start/heart"
        },
        {
            title: "Diabetes Prediction",
            desc: "Glucose-level intelligence system that analyzes insulin resistance, BMI, and genetic markers.",
            icon: Zap,
            gradient: "from-emerald-500 to-teal-400",
            shadowColor: "shadow-emerald-200",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            tag: "Preventive",
            link: "/start/diabetes"
        },
        {
            title: "Brain Tumor",
            desc: "Deep learning MRI scan analysis for accurate tumor classification and early-stage detection.",
            icon: Brain,
            gradient: "from-violet-500 to-purple-400",
            shadowColor: "shadow-violet-200",
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-500",
            tag: "Image AI",
            link: "/start/brain"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">AI-Powered Diagnostics</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Choose a prediction model to begin your health analysis.</p>
            </div>

            {/* Trust Banner */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5 mb-8">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">Blockchain-verified results</span> — Every prediction is securely hashed and stored for tamper-proof medical records.
                </p>
            </div>

            {/* Prediction Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {cards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className={`group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:${card.shadowColor} hover:-translate-y-1`}
                    >
                        {/* Tag */}
                        <div className="absolute top-5 right-5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${card.gradient} text-white`}>
                                {card.tag}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5">{card.desc}</p>

                        {/* CTA */}
                        <div className={`inline-flex items-center gap-2 font-semibold text-sm bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                            Start Analysis
                            <ArrowRight className={`w-4 h-4 ${card.iconColor} group-hover:translate-x-1 transition-transform duration-300`} />
                        </div>

                        {/* Bottom gradient line */}
                        <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${card.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </Link>
                ))}
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400 mt-8">
                All predictions are AI-assisted and should not replace professional medical advice.
            </p>
        </div>
    );
};

export default Dashboard;
