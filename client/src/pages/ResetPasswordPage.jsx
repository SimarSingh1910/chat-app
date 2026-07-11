import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

// Same strength rule the signup form enforces.
const STRONG_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

const inputClass =
    'border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        if (!token) {
            setError('This reset link is invalid or has expired.');
            return;
        }
        if (!STRONG_PASSWORD.test(password)) {
            setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/reset-password', { token, password });
            navigate('/login', {
                replace: true,
                state: { notice: 'Password reset successfully. Please sign in.' },
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className='bg-gradient-to-r from-cyan-500 to-teal-500 min-h-screen flex items-center justify-center py-8'>
            <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8'>
                <div className='bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center'>
                        Reset password
                    </h1>
                    <p className='text-sm text-gray-600 mb-6 text-center'>
                        Choose a new password for your account.
                    </p>

                    <div className='space-y-4'>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='New password'
                            autoFocus
                            className={inputClass}
                        />
                        <input
                            type='password'
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            onKeyDown={handleEnter}
                            placeholder='Confirm new password'
                            className={inputClass}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg p-3 w-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Resetting…' : 'Reset password'}
                        </button>
                        {error && (
                            <div className='text-red-500 text-sm mt-2 text-center'>{error}</div>
                        )}
                        <div className='text-center'>
                            <button
                                onClick={() => navigate('/login')}
                                className='text-cyan-500 hover:text-cyan-600 cursor-pointer font-semibold text-sm sm:text-base'
                            >
                                Back to sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
