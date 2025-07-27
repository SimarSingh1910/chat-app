import React, { useState } from 'react';

const InputForm = () => {
    const [value, setValue] = useState('');
    const [pass, setPass] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
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
                setSuccess('Login successful!');
                window.location.replace('/');
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError(`An error occurred during login: ${err.message}`);
        }
    };

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
                placeholder="Password"
                className='border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base'
            />
            <div className='flex items-center justify-between mt-2'>
                <label className='flex items-center text-sm sm:text-base text-gray-600'>
                    <input
                        type="checkbox"
                        className='mr-2'
                    />
                    Remember me
                </label>
                <button className='text-cyan-500 hover:text-cyan-600 cursor-pointer font-semibold text-sm sm:text-base'>
                    Forgot Password?
                </button>
            </div>
            <button className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg p-3 w-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-semibold text-sm sm:text-base'
                onClick={handleLogin}>
                Login
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
        </div>
    );
}

export default InputForm;