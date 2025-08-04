import React, { useState } from 'react';

const InputForm = () => {
    const [value, setValue] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setError("Please enter a valid email address.");
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // use if backend uses cookies
                body: JSON.stringify({
                    email: value,
                    password: pass
                }),
            });

            const data = await res.json();
            if (res.ok) {
                window.location.replace('/');
            } else {
                setError(data.error || 'Login failed.');
            }
        } catch (err) {
            setError(`An error occurred during login: ${err.message}`);
        }
    };
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    }
    return (
        <div className='space-y-4'>
            <input
                type="email"
                name="email"
                id="email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Email"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />

            <input
                type="password"
                name="password"
                id="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Password"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />
            <div className='flex items-center justify-end'>
                <button className='text-cyan-500 hover:text-cyan-600 cursor-pointer font-semibold text-sm sm:text-base'>
                    Forgot Password?
                </button>
            </div>
            <button className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg p-3 w-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-semibold text-sm sm:text-base'
                onClick={handleLogin}>
                Sign In
            </button>
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
        </div>
    );
}

export default InputForm;