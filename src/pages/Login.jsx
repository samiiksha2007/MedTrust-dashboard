import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Stethoscope, ArrowRight, ArrowLeft, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetStatus, setResetStatus] = useState(null); // 'success' | 'error' | null
    const [resetMessage, setResetMessage] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail.trim()) return;
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetStatus('success');
            setResetMessage('Password reset link sent! Check your email inbox.');
        } catch (error) {
            setResetStatus('error');
            if (error.code === 'auth/user-not-found') {
                setResetMessage('No account found with this email.');
            } else {
                setResetMessage('Failed to send reset email. Please try again.');
            }
        }
    };

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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end -mt-2">
                            <button
                                type="button"
                                onClick={() => { setShowForgotPassword(true); setResetEmail(email); setResetStatus(null); }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

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

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Reset Password</h3>
                            <p className="text-sm text-gray-500 mb-4">Enter your email and we'll send you a password reset link.</p>

                            {resetStatus === 'success' ? (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <p className="text-green-600 font-medium text-sm">{resetMessage}</p>
                                    <button
                                        onClick={() => setShowForgotPassword(false)}
                                        className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="your-email@example.com"
                                        required
                                    />
                                    {resetStatus === 'error' && (
                                        <p className="text-red-500 text-xs">{resetMessage}</p>
                                    )}
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(false)}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Send Reset Link
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
