import React, { useState } from 'react';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import api from '../../lib/api';

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
    });
    const [confirmPassword, setConfirm] = useState('')
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleChangeCP = (e) => {
        setConfirm(e.target.value);
    };

    const handleSignup = async () => {
        setError('');

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password strength check
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        if (!strongPasswordRegex.test(formData.password)) {
            setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        // Simple password match check
        if (formData.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await api.post('/signup', formData);
            window.location.replace('/profile');
        } catch (err) {
            setError(err.response?.data?.error || `An error occurred during signup: ${err.message}`);
        }
    };
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <div className="relative w-full">
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First name"
                        className={inputClass}
                    />
                </div>
                <div className="relative w-full">
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last name"
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={inputClass}
                />
            </div>

            <div className="relative">
                <AtSign size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={inputClass}
                />
            </div>

            <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={inputClass}
                />
            </div>

            <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChangeCP}
                    onKeyDown={handleEnter}
                    placeholder="Confirm password"
                    className={inputClass}
                />
            </div>

            <button
                className="w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 active:scale-[.99]"
                onClick={handleSignup}
            >
                Create account
            </button>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default SignupForm;
