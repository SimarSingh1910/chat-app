import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20';
const primaryBtnClass =
    'w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60';
const linkClass =
    'font-semibold text-cyan-600 transition-colors hover:text-cyan-700 cursor-pointer';

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
            <div className="space-y-4">
                {forgotSent ? (
                    <div className="space-y-3 text-center">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-cyan-50 text-cyan-600">
                            <Mail size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Check your email</h2>
                        <p className="text-sm text-slate-500">
                            If an account exists for{' '}
                            <span className="font-medium text-slate-700">{forgotEmail}</span>, we've sent a
                            link to reset your password. The link expires in 1 hour.
                        </p>
                        <button onClick={closeForgot} className={`inline-flex items-center gap-1.5 ${linkClass}`}>
                            <ArrowLeft size={15} /> Back to sign in
                        </button>
                    </div>
                ) : (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Reset your password</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>
                        <div className="relative">
                            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleForgotSubmit()}
                                placeholder="Email"
                                autoFocus
                                className={inputClass}
                            />
                        </div>
                        <button disabled={forgotLoading} onClick={handleForgotSubmit} className={primaryBtnClass}>
                            {forgotLoading ? 'Sending…' : 'Send reset link'}
                        </button>
                        <div className="text-center">
                            <button onClick={closeForgot} className={`inline-flex items-center gap-1.5 text-sm ${linkClass}`}>
                                <ArrowLeft size={15} /> Back to sign in
                            </button>
                        </div>
                        {forgotError && (
                            <p className="text-center text-sm text-red-500">{forgotError}</p>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Email"
                    className={inputClass}
                />
            </div>

            <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
            </div>

            <div className="flex items-center justify-end">
                <button onClick={openForgot} className={`text-sm ${linkClass}`}>
                    Forgot password?
                </button>
            </div>

            <button className={primaryBtnClass} onClick={handleLogin}>
                Sign in
            </button>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </div>
    );
}

export default InputForm;
