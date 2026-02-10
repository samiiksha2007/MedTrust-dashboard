import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: "General Health",
            desc: "Basic health checkup based on vital signs.",
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50",
            link: "/start/general"
        },
        {
            title: "Heart Disease",
            desc: "AI prediction for cardiovascular risks.",
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-50",
            link: "/start/heart"
        },
        {
            title: "Diabetes Prediction",
            desc: "Check risk of diabetes based on glucose levels.",
            icon: Activity,
            color: "text-green-600",
            bg: "bg-green-50",
            link: "/start/diabetes"
        },
        {
            title: "Brain Tumor",
            desc: "MRI Scan analysis for tumor detection.",
            icon: Brain,
            color: "text-purple-600",
            bg: "bg-purple-50",
            link: "/start/brain"
        }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.username}</h1>
                <p className="text-gray-500">Select a prediction model to proceed.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                    >
                        <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-800">{card.title}</h3>
                        <p className="text-gray-500 text-sm mb-4">{card.desc}</p>
                        <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                            Start Analysis <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
