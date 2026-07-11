import { motion as Motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import InputForm from './inputForm';
import Google from './google';

const SignIn = ({ switchToSignUp }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <Motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue to ChatApp.</p>

            <div className="mt-6">
                <InputForm />
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
                Don't have an account?
                <button
                    onClick={switchToSignUp}
                    className="ml-1 font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
                >
                    Sign up
                </button>
            </p>

            <div className="my-5 flex items-center gap-4">
                <hr className="w-full border-slate-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
                <hr className="w-full border-slate-200" />
            </div>

            <Google />
        </Motion.div>
    );
};

export default SignIn;
