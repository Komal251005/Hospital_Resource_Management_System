import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaLock, FaHospital } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
        setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setLoginError('');

        try {
            const response = await authAPI.login(formData.email, formData.password);

            if (response.success) {
                // Store token and user data from backend
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/dashboard');
            } else {
                setLoginError(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.message ||
                'Unable to connect to server. Please try again.';
            setLoginError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <FaHospital className="text-white text-4xl" />
                            <h1 className="text-2xl font-bold text-white">Hospital Resource</h1>
                        </div>
                        <p className="text-teal-100 text-sm">Management System</p>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-full shadow-lg">
                                <FaUserCircle className="text-white text-5xl" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                            Welcome Back
                        </h2>

                        {loginError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 text-center font-medium mb-2">
                                Demo Credentials
                            </p>
                            <p className="text-xs text-gray-500 text-center">
                                Email: <span className="font-mono text-teal-600">admin@hospital.com</span>
                            </p>
                            <p className="text-xs text-gray-500 text-center">
                                Password: <span className="font-mono text-teal-600">Admin@123</span>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-teal-100 text-sm mt-6">
                    © 2026 Hospital Resource Management System
                </p>
            </div>
        </div>
    );
};

export default Login;
