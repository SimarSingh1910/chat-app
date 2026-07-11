import React, { useState } from 'react';
import api from '../../lib/api';

const inputClass =
    'border border-gray-300 rounded-lg p-3 w-full focus:border-2 focus:border-cyan-500 hover:border-cyan-400 outline-none transition-all duration-200 text-sm sm:text-base';
const primaryBtnClass =
    'bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg p-3 w-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed';
const linkClass =
    'text-cyan-500 hover:text-cyan-600 cursor-pointer font-semibold text-sm sm:text-base';

const InputForm = () => {
    const [value, setValue] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    // Forgot-password sub-flow
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);

    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setError("Please enter a valid email address.");
            return;
        }
        try {
            const { data } = await api.post('/login', {
                email: value,
                password: pass,
            });
            if (!data.profile) {
                window.location.replace('/profile');
            } else {
                window.location.replace('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || `An error occurred during login: ${err.message}`);
        }
    };
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    }

    const openForgot = () => {
        setForgotEmail(value); // prefill with whatever's in the email box
        setForgotError('');
        setForgotSent(false);
        setShowForgot(true);
    };
    const closeForgot = () => {
        setShowForgot(false);
        setForgotError('');
    };

    const handleForgotSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotEmail)) {
            setForgotError('Please enter a valid email address.');
            return;
        }
        setForgotError('');
        setForgotLoading(true);
        try {
            await api.post('/forgot-password', { email: forgotEmail });
        } catch {
            // Swallow errors on purpose — never reveal whether the email exists.
        } finally {
            setForgotLoading(false);
            setForgotSent(true); // always show the same generic confirmation
        }
    };

    if (showForgot) {
        return (
            <div className='space-y-4'>
                {forgotSent ? (
                    <div className='text-center space-y-3'>
                        <h2 className='text-lg font-semibold text-gray-800'>Check your email</h2>
                        <p className='text-sm text-gray-600'>
                            If an account exists for{' '}
                            <span className='font-medium'>{forgotEmail}</span>, we've sent a link to
                            reset your password. The link expires in 1 hour.
                        </p>
                        <button onClick={closeForgot} className={linkClass}>
                            Back to sign in
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className='text-lg font-semibold text-gray-800 text-center'>
                            Reset your password
                        </h2>
                        <p className='text-sm text-gray-600 text-center'>
                            Enter your email and we'll send you a reset link.
                        </p>
                        <input
                            type='email'
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleForgotSubmit()}
                            placeholder='Email'
                            autoFocus
                            className={inputClass}
                        />
                        <button disabled={forgotLoading} onClick={handleForgotSubmit} className={primaryBtnClass}>
                            {forgotLoading ? 'Sending…' : 'Send reset link'}
                        </button>
                        <div className='text-center'>
                            <button onClick={closeForgot} className={linkClass}>
                                Back to sign in
                            </button>
                        </div>
                        {forgotError && (
                            <div className='text-red-500 text-sm mt-2 text-center'>{forgotError}</div>
                        )}
                    </>
                )}
            </div>
        );
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
                className={inputClass}
            />

            <input
                type="password"
                name="password"
                id="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Password"
                className={inputClass}
            />
            <div className='flex items-center justify-end'>
                <button onClick={openForgot} className={linkClass}>
                    Forgot Password?
                </button>
            </div>
            <button className={primaryBtnClass} onClick={handleLogin}>
                Sign In
            </button>
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
        </div>
    );
}

export default InputForm;
