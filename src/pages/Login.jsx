import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email.trim() && password.trim()) {
            try {
                if (isLogin) {
                    await login(email, password);
                } else {
                    await signup(email, password);
                }
                navigate('/dashboard');
            } catch (error) {
                console.error("Auth failed", error);
                alert((isLogin ? "Login Failed: " : "Signup Failed: ") + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="flex flex-col items-center mb-8 relative">
                    <a
                        href="https://samiiksha2007.github.io/MedTrust/"
                        className="absolute left-0 top-0 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Back to Blog"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </a>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome to MedTrust</h1>
                    <p className="text-gray-500 text-center mt-2">
                        {isLogin ? "Secure AI-Powered Healthcare Prediction System" : "Create your account to get started"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLogin ? "Access Dashboard" : "Create Account"} <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>

                <p className="text-xs text-center text-gray-400 mt-8">
                    Academic Project. For educational purposes only.
                </p>
            </div>
        </div>
    );
};

export default Login;
