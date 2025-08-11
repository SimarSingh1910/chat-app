import React, { useState } from 'react';

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
            const res = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect if needed:
                window.location.replace('/profile');
            } else {
                setError(data.error || 'Signup failed.');
            }
        } catch (err) {
            setError(`An error occurred during signup: ${err.message}`);
        }
    };
    const handleEnter= (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    }
    return (
        <div className='space-y-4'>
            <div className='flex gap-4'>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
                />
            </div>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />

            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />

            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />

            <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChangeCP}
                onKeyDown={handleEnter}
                placeholder="Confirm Password"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />

            <button
                className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg p-3 w-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-semibold text-sm sm:text-base'
                onClick={handleSignup}
            >
                Sign Up
            </button>

            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </div>
    );
};

export default SignupForm;
